BEGIN;

ALTER TABLE messages
    ADD COLUMN IF NOT EXISTS mentions_ciphertext bytea,
    ADD COLUMN IF NOT EXISTS mentions_nonce bytea;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'messages_mentions_encryption_pair') THEN
        ALTER TABLE messages ADD CONSTRAINT messages_mentions_encryption_pair CHECK (
            (mentions_ciphertext IS NULL AND mentions_nonce IS NULL) OR
            (mentions_ciphertext IS NOT NULL AND octet_length(mentions_ciphertext) > 0 AND mentions_nonce IS NOT NULL AND octet_length(mentions_nonce) > 0)
        );
    END IF;
END;
$$;

INSERT INTO schema_migrations (version)
VALUES ('0014_message_mentions')
ON CONFLICT (version) DO NOTHING;

COMMIT;
