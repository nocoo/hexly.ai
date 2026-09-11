CREATE TABLE checks (
  project_id TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  slot INTEGER NOT NULL,
  checked_at INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('operational', 'degraded', 'down', 'unconfigured')),
  http_status INTEGER,
  latency_ms INTEGER,
  error_code TEXT,
  version TEXT,
  PRIMARY KEY (project_id, slot)
) WITHOUT ROWID;

CREATE INDEX checks_retention ON checks (checked_at);
