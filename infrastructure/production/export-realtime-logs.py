#!/usr/bin/env python3
"""Export a bounded, support_ref-filtered realtime Docker log window."""

import argparse
import datetime as dt
import os
from pathlib import Path
import re
import subprocess
import sys
import tempfile


UUID_RE = re.compile(
    r"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-"
    r"[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
)
WINDOW_RE = re.compile(r"^([1-9][0-9]*)([smh])$")
MAX_SOURCE_LINES = 20_000
DOCKER_TAIL_LINES = MAX_SOURCE_LINES + 1
MAX_INPUT_BYTES = 32 * 1024 * 1024
MAX_INPUT_LINE_BYTES = 1024 * 1024
MAX_EXPORT_LINES = 1_000
MAX_EXPORT_BYTES = 2 * 1024 * 1024


def parse_window(value):
    match = WINDOW_RE.fullmatch(value)
    if not match:
        raise argparse.ArgumentTypeError("window must be a positive integer followed by s, m, or h")
    amount, unit = int(match.group(1)), match.group(2)
    seconds = amount * {"s": 1, "m": 60, "h": 3600}[unit]
    if seconds > 24 * 3600:
        raise argparse.ArgumentTypeError("window cannot exceed 24h")
    return seconds


def parse_args():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("support_ref", help="UUID support_ref value to match exactly")
    parser.add_argument("--window", default="30m", type=parse_window, help="lookback (default: 30m; maximum: 24h)")
    parser.add_argument("--output", type=Path, help="new private output file (default: generated in the home directory)")
    parser.add_argument("--compose-file", action="append", dest="compose_files", help="Compose file; repeat to layer files")
    parser.add_argument("--project-name", help="Compose project name")
    args = parser.parse_args()
    if not UUID_RE.fullmatch(args.support_ref):
        parser.error("support_ref must be a UUID")
    return args


def log_payload(line):
    # `docker compose logs` prefixes each record with a container name, then
    # `--timestamps` adds the RFC3339 timestamp before the application payload.
    _, separator, payload = line.partition(b" | ")
    if separator:
        line = payload
    _, separator, payload = line.partition(b" ")
    if not separator:
        return line
    return payload


def create_output(path):
    if path is None:
        stamp = dt.datetime.now(dt.timezone.utc).strftime("%Y%m%dT%H%M%SZ")
        path = Path.home() / f"realtime-support-{stamp}.jsonl"
    flags = os.O_WRONLY | os.O_CREAT | os.O_EXCL
    fd = os.open(path, flags, 0o600)
    return path, os.fdopen(fd, "wb")


def stop_process(process):
    if process.poll() is None:
        process.terminate()
    try:
        process.wait(timeout=5)
    except subprocess.TimeoutExpired:
        process.kill()
        process.wait()


def main():
    args = parse_args()
    compose = ["docker", "compose"]
    if args.project_name:
        compose.extend(["-p", args.project_name])
    for compose_file in args.compose_files or []:
        compose.extend(["-f", compose_file])
    command = compose + ["logs", "--no-color", "--timestamps", f"--since={args.window}s", f"--tail={DOCKER_TAIL_LINES}", "realtime"]
    selected = dt.datetime.now(dt.timezone.utc)

    stderr_file = tempfile.TemporaryFile()
    try:
        process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=stderr_file)
    except OSError as error:
        stderr_file.close()
        print(f"ERROR: could not start Docker Compose: {error}", file=sys.stderr)
        return 1

    output_path = None
    output = None
    input_bytes = exported_bytes = exported_lines = 0
    source_lines = 0
    truncated = False
    stopped_for_cap = False
    try:
        while True:
            line = process.stdout.readline(MAX_INPUT_LINE_BYTES + 1)
            if not line:
                break
            input_bytes += len(line)
            source_lines += 1
            if source_lines > MAX_SOURCE_LINES:
                truncated = True
                stopped_for_cap = True
                stop_process(process)
                break
            if len(line) > MAX_INPUT_LINE_BYTES:
                truncated = True
                stopped_for_cap = True
                stop_process(process)
                break
            if input_bytes > MAX_INPUT_BYTES:
                truncated = True
                stopped_for_cap = True
                stop_process(process)
                break
            try:
                import json

                record = json.loads(log_payload(line))
            except (UnicodeDecodeError, ValueError):
                continue
            if not isinstance(record, dict) or record.get("support_ref") != args.support_ref:
                continue
            encoded = (json.dumps(record, separators=(",", ":"), ensure_ascii=False) + "\n").encode("utf-8")
            if exported_lines >= MAX_EXPORT_LINES or exported_bytes + len(encoded) > MAX_EXPORT_BYTES:
                truncated = True
                continue
            if output is None:
                output_path, output = create_output(args.output)
            output.write(encoded)
            exported_lines += 1
            exported_bytes += len(encoded)

        return_code = process.wait()
        stderr_file.seek(0)
        stderr = stderr_file.read(64 * 1024)
        if return_code and not stopped_for_cap:
            raise RuntimeError(stderr.decode("utf-8", errors="replace").strip() or f"docker compose exited {return_code}")
        if output is None:
            output_path, output = create_output(args.output)
        output.flush()
        os.fsync(output.fileno())
        output.close()
        output = None
        start = selected - dt.timedelta(seconds=args.window)
        status = "truncated at configured safety cap" if truncated else ("empty (no exact matches)" if not exported_lines else "complete")
        print(f"{status}: {exported_lines} records, {exported_bytes} bytes; window {start.isoformat()} to {selected.isoformat()} UTC")
        print(f"Private export: {output_path} (mode 0600)")
        stderr_file.close()
        return 0
    except (OSError, RuntimeError) as error:
        if process.poll() is None:
            stop_process(process)
        if output is not None:
            output.close()
        if output_path is not None:
            try:
                output_path.unlink()
            except OSError:
                pass
        stderr_file.close()
        print(f"ERROR: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
