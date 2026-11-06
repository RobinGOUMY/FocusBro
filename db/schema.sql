CREATE TABLE IF NOT EXISTS focusbro_accounts (
  username text PRIMARY KEY CHECK (username ~ '^[a-z0-9][a-z0-9_.-]{2,23}$'),
  password_hash text NOT NULL,
  revision integer NOT NULL DEFAULT 0,
  change_id uuid,
  progress jsonb
);

CREATE TABLE IF NOT EXISTS focusbro_sessions (
  token_hash text PRIMARY KEY,
  username text NOT NULL REFERENCES focusbro_accounts(username) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL
);

CREATE INDEX IF NOT EXISTS focusbro_sessions_expiration ON focusbro_sessions (expires_at);

CREATE TABLE IF NOT EXISTS focusbro_auth_attempts (
  key text PRIMARY KEY,
  bucket bigint NOT NULL,
  attempts integer NOT NULL
);
