-- MAZA Studio Operational Stability Migration
-- Phase 8: Backup, Isolation & Protection

-- 1. 설정 스냅샷 (Versioning)
CREATE TABLE IF NOT EXISTS ms_config_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    config_type TEXT NOT NULL, -- 'site', 'extension', 'prompt'
    config_data JSONB NOT NULL,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. 사이트별 건강 상태 및 격리 모드
CREATE TABLE IF NOT EXISTS ms_site_health (
    site_id UUID PRIMARY KEY REFERENCES ms_sites(id),
    status TEXT DEFAULT 'healthy', -- 'healthy', 'warning', 'quarantined'
    consecutive_failures INTEGER DEFAULT 0,
    last_error TEXT,
    quarantined_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. API 사용량 트래킹 (Rate Limit Protection)
CREATE TABLE IF NOT EXISTS ms_usage_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    resource_type TEXT NOT NULL, -- 'ai_api', 'image_api', 'tistory_publish'
    usage_count INTEGER DEFAULT 0,
    daily_limit INTEGER DEFAULT 100,
    reset_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ms_usage_user_resource ON ms_usage_tracking (user_id, resource_type);
