-- MAZA Studio Data Feedback Loop Migration
-- Phase 7: GSC/GA4 Metrics & Intelligence

-- 1. 성과 지표 테이블
CREATE TABLE IF NOT EXISTS ms_performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID REFERENCES ms_sites(id),
    post_id UUID REFERENCES ms_posts(id),
    date DATE NOT NULL,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    ctr FLOAT DEFAULT 0,
    position FLOAT DEFAULT 0,
    avg_duration FLOAT DEFAULT 0, -- GA4 체류 시간 (초)
    is_indexed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ms_perf_site_date ON ms_performance_metrics (site_id, date);
CREATE INDEX IF NOT EXISTS idx_ms_perf_post ON ms_performance_metrics (post_id);

-- 2. Winning Patterns (AI 학습용 지표 요약)
CREATE TABLE IF NOT EXISTS ms_winning_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    niche TEXT,
    pattern_type TEXT, -- 'title', 'length', 'category', 'intent'
    insight JSONB, -- { "avg_ctr": 0.05, "best_length": 1800, ... }
    last_updated TIMESTAMPTZ DEFAULT now()
);

-- 3. ms_posts에 실시간 상태 필드 추가
ALTER TABLE ms_posts ADD COLUMN IF NOT EXISTS is_indexed BOOLEAN DEFAULT false;
ALTER TABLE ms_posts ADD COLUMN IF NOT EXISTS gsc_ctr FLOAT DEFAULT 0;
ALTER TABLE ms_posts ADD COLUMN IF NOT EXISTS last_indexed_at TIMESTAMPTZ;
