-- MAZA Studio Observability & Metrics
-- For detailed system monitoring

CREATE TABLE IF NOT EXISTS ms_worker_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_name TEXT NOT NULL, -- 'ai', 'image', 'validation', 'publish'
    job_id TEXT NOT NULL,
    status TEXT NOT NULL, -- 'success', 'failed'
    processing_time_ms INTEGER,
    error_type TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ms_metrics_worker ON ms_worker_metrics (worker_name, created_at);
CREATE INDEX IF NOT EXISTS idx_ms_metrics_status ON ms_worker_metrics (status);
