-- Maza Autopilot Stage Real-time Status Table
-- AGENTS.md v7.0: Global Orchestration (Phase 8)

CREATE TABLE IF NOT EXISTS ms_autopilot_status (
  user_id UUID PRIMARY KEY,
  active_job_id TEXT,
  status TEXT DEFAULT 'IDLE', -- IDLE | NAVIGATING | EXECUTING | VERIFYING | HEALING | DONE | ERROR
  progress INTEGER DEFAULT 0,
  current_task TEXT,
  last_error TEXT,
  metadata JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Realtime for this table
ALTER publication supabase_realtime ADD TABLE ms_autopilot_status;

-- RLS Policy
ALTER TABLE ms_autopilot_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own autopilot status"
  ON ms_autopilot_status FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can upsert autopilot status"
  ON ms_autopilot_status FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
