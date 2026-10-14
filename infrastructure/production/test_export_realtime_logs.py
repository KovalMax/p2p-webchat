import json
import os
from pathlib import Path
import stat
import subprocess
import sys
import tempfile
import unittest


SCRIPT = Path(__file__).with_name("export-realtime-logs.py")
SUPPORT_REF = "123e4567-e89b-12d3-a456-426614174000"


class ExportRealtimeLogsTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.working = self.root / "working"
        self.working.mkdir()
        self.bin = self.root / "bin"
        self.bin.mkdir()
        self.compose = self.bin / "docker"
        self.compose.write_text(
            "#!/bin/sh\n"
            "printf '%s\\n' \"$*\" > \"$ARGS_FILE\"\n"
            "cat \"$LOG_FIXTURE\"\n"
            "exit \"${COMPOSE_EXIT:-0}\"\n",
            encoding="utf-8",
        )
        self.compose.chmod(0o755)
        self.fixture = self.root / "fixture.log"
        self.args_file = self.root / "args"

    def tearDown(self):
        self.temp.cleanup()

    def run_export(self, *arguments, exit_code="0"):
        env = os.environ.copy()
        env.update({
            "PATH": f"{self.bin}:{env['PATH']}",
            "HOME": str(self.root),
            "LOG_FIXTURE": str(self.fixture),
            "ARGS_FILE": str(self.args_file),
            "COMPOSE_EXIT": exit_code,
        })
        return subprocess.run(
            [sys.executable, str(SCRIPT), *arguments],
            cwd=self.working,
            env=env,
            text=True,
            capture_output=True,
            check=False,
        )

    def write_records(self, records):
        self.fixture.write_text("".join(
            "realtime-1  | 2026-10-11T20:00:00.000000000Z " + json.dumps(record) + "\n"
            for record in records
        ))

    def test_exact_field_filter_private_file_and_bounded_compose_invocation(self):
        records = [
            {"time": "2026-10-11T20:00:00.000000000Z", "level": "INFO", "msg": "call connected", "support_ref": SUPPORT_REF},
            {"time": "2026-10-11T20:00:00.000000000Z", "level": "INFO", "msg": "near miss", "support_ref": SUPPORT_REF + "0"},
            {"time": "2026-10-11T20:00:00.000000000Z", "level": "INFO", "msg": "nested only", "nested": {"support_ref": SUPPORT_REF}},
        ]
        self.write_records(records)
        output_path = self.root / "private.jsonl"
        result = self.run_export(SUPPORT_REF, "--window", "30m", "--output", str(output_path))

        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual([json.loads(line) for line in output_path.read_text().splitlines()], [records[0]])
        self.assertEqual(stat.S_IMODE(output_path.stat().st_mode), 0o600)
        compose_args = self.args_file.read_text()
        self.assertIn("logs --no-color --timestamps --since=1800s --tail=20001 realtime", compose_args)
        self.assertNotIn("--follow", compose_args)

    def test_invalid_uuid_or_window_fails_before_compose(self):
        self.fixture.write_text("")
        for arguments in (("not-a-uuid",), (SUPPORT_REF, "--window", "25h"), (SUPPORT_REF, "--window", "0m")):
            with self.subTest(arguments=arguments):
                result = self.run_export(*arguments)
                self.assertEqual(result.returncode, 2)
                self.assertFalse(self.args_file.exists())

    def test_exact_maximum_24_hour_lookback_is_accepted(self):
        self.fixture.write_text("")
        output_path = self.root / "maximum-window.jsonl"
        result = self.run_export(SUPPORT_REF, "--window", "24h", "--output", str(output_path))

        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("--since=86400s", self.args_file.read_text())
        self.assertTrue(output_path.exists())

    def test_existing_output_path_is_not_overwritten(self):
        self.fixture.write_text("")
        output_path = self.root / "existing.jsonl"
        original_contents = b"keep this file\n"
        output_path.write_bytes(original_contents)

        result = self.run_export(SUPPORT_REF, "--output", str(output_path))

        self.assertEqual(result.returncode, 1)
        self.assertIn("ERROR:", result.stderr)
        self.assertEqual(output_path.read_bytes(), original_contents)

    def test_empty_match_creates_private_empty_file_and_reports_window(self):
        self.write_records([{"support_ref": "other"}])
        result = self.run_export(SUPPORT_REF)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("empty (no exact matches)", result.stdout)
        self.assertIn("window", result.stdout)
        generated = next(self.root.glob("realtime-support-*.jsonl"))
        self.assertEqual(generated.parent, self.root)
        self.assertEqual(generated.read_bytes(), b"")
        self.assertEqual(stat.S_IMODE(generated.stat().st_mode), 0o600)

    def test_export_line_cap_is_reported(self):
        self.write_records([{"support_ref": SUPPORT_REF, "n": n} for n in range(1001)])
        result = self.run_export(SUPPORT_REF)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("truncated at configured safety cap", result.stdout)
        generated = next(self.root.glob("realtime-support-*.jsonl"))
        self.assertEqual(len(generated.read_text().splitlines()), 1000)

    def test_export_byte_cap_is_reported(self):
        self.write_records([{"support_ref": SUPPORT_REF, "payload": "x" * 30_000} for _ in range(80)])
        result = self.run_export(SUPPORT_REF)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("truncated at configured safety cap", result.stdout)
        generated = next(self.root.glob("realtime-support-*.jsonl"))
        self.assertLessEqual(generated.stat().st_size, 2 * 1024 * 1024)

    def test_source_line_cap_terminates_compose(self):
        terminated_file = self.root / "terminated"
        self.compose.write_text(
            f"#!{sys.executable}\n"
            "import os, signal, sys\n"
            "def terminated(signum, frame):\n"
            "    with open(os.environ['TERMINATED_FILE'], 'w') as marker:\n"
            "        marker.write('yes')\n"
            "    raise SystemExit(0)\n"
            "signal.signal(signal.SIGTERM, terminated)\n"
            "for number in iter(int, 1):\n"
            "    print('realtime-1  | 2026-10-11T20:00:00Z {\\\"support_ref\\\":\\\"other\\\",\\\"n\\\":%d}' % number, flush=True)\n",
            encoding="utf-8",
        )
        self.compose.chmod(0o755)
        env = os.environ.copy()
        env["TERMINATED_FILE"] = str(terminated_file)
        env.update({
            "PATH": f"{self.bin}:{env['PATH']}",
            "HOME": str(self.root),
            "ARGS_FILE": str(self.args_file),
        })
        result = subprocess.run(
            [sys.executable, str(SCRIPT), SUPPORT_REF],
            cwd=self.working,
            env=env,
            text=True,
            capture_output=True,
            check=False,
            timeout=15,
        )

        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("truncated at configured safety cap", result.stdout)
        self.assertTrue(terminated_file.exists(), "Docker Compose was not terminated at the source-line cap")

    def test_compose_failure_removes_partial_export(self):
        self.write_records([{"support_ref": SUPPORT_REF}])
        output_path = self.root / "failed.jsonl"
        result = self.run_export(SUPPORT_REF, "--output", str(output_path), exit_code="7")
        self.assertEqual(result.returncode, 1)
        self.assertIn("ERROR:", result.stderr)
        self.assertFalse(output_path.exists())

    def test_make_support_export_forwards_values_without_shell_evaluation(self):
        makefile_dir = SCRIPT.parents[2]
        capture_path = self.root / "python-args.json"
        marker_path = self.root / "command-substitution-ran"
        fake_python = self.bin / "python3"
        fake_python.write_text(
            f"#!{sys.executable}\n"
            "import json, os, sys\n"
            "with open(os.environ['PYTHON_ARGS_FILE'], 'w') as output:\n"
            "    json.dump(sys.argv[1:], output)\n",
            encoding="utf-8",
        )
        fake_python.chmod(0o755)
        hostile_ref = f"$(touch {marker_path})"
        env = os.environ.copy()
        env.update({
            "PATH": f"{self.bin}:{env['PATH']}",
            "PYTHON_ARGS_FILE": str(capture_path),
            "SUPPORT_REF": hostile_ref,
            "WINDOW": "45m",
        })

        result = subprocess.run(
            ["make", "-C", str(makefile_dir), "support-export"],
            env=env,
            text=True,
            capture_output=True,
            check=False,
        )

        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertFalse(marker_path.exists(), "support reference was evaluated by the shell")
        self.assertEqual(json.loads(capture_path.read_text()), [
            "production/export-realtime-logs.py",
            hostile_ref,
            "--window",
            "45m",
            "--project-name",
            "messenger",
            "--compose-file",
            "docker-compose.yml",
            "--compose-file",
            "docker-compose.override.yml",
        ])

    def test_infrastructure_submake_support_export_still_forwards_values(self):
        makefile_dir = SCRIPT.parents[1]
        capture_path = self.root / "submake-python-args.json"
        fake_python = self.bin / "python3"
        fake_python.write_text(
            f"#!{sys.executable}\n"
            "import json, os, sys\n"
            "with open(os.environ['PYTHON_ARGS_FILE'], 'w') as output:\n"
            "    json.dump(sys.argv[1:], output)\n",
            encoding="utf-8",
        )
        fake_python.chmod(0o755)
        env = os.environ.copy()
        env.update({
            "PATH": f"{self.bin}:{env['PATH']}",
            "PYTHON_ARGS_FILE": str(capture_path),
            "SUPPORT_REF": SUPPORT_REF,
            "WINDOW": "15m",
        })

        result = subprocess.run(
            ["make", "-C", str(makefile_dir), "support-export"],
            env=env,
            text=True,
            capture_output=True,
            check=False,
        )

        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(json.loads(capture_path.read_text()), [
            "production/export-realtime-logs.py",
            SUPPORT_REF,
            "--window",
            "15m",
            "--project-name",
            "messenger",
            "--compose-file",
            "docker-compose.yml",
            "--compose-file",
            "docker-compose.override.yml",
        ])

    def test_make_support_export_leaves_invalid_values_to_exporter_validation(self):
        makefile_dir = SCRIPT.parents[2]
        env = os.environ.copy()
        env.update({"SUPPORT_REF": "not-a-uuid", "WINDOW": "30m"})

        result = subprocess.run(
            ["make", "-C", str(makefile_dir), "support-export"],
            env=env,
            text=True,
            capture_output=True,
            check=False,
        )

        self.assertEqual(result.returncode, 2)
        self.assertIn("support_ref must be a UUID", result.stderr)


if __name__ == "__main__":
    unittest.main()
