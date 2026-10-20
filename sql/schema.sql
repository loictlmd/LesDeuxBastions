-- Run once in the Neon SQL Editor. Safe to run again.
CREATE TABLE IF NOT EXISTS bastion_rooms (
  code text PRIMARY KEY,
  state jsonb NOT NULL,
  expires_at bigint NOT NULL
);
CREATE INDEX IF NOT EXISTS bastion_rooms_expiry ON bastion_rooms (expires_at);
