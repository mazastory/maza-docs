-- Maza Autopilot OS: Series Engine v2.0 (Stabilization)
-- 1. ms_topic_clusters 테이블 보완 (title, keywords 등 필수 필드 통합)
CREATE TABLE IF NOT EXISTS ms_topic_clusters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    site_id UUID REFERENCES ms_sites(id) ON DELETE SET NULL,
    title TEXT NOT NULL DEFAULT '새 시리즈',
    keywords TEXT[] DEFAULT '{}',
    master_brief TEXT,
    status TEXT DEFAULT 'active',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 기존 테이블이 있을 경우를 대비한 컬럼 보강
ALTER TABLE ms_topic_clusters ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE ms_topic_clusters ADD COLUMN IF NOT EXISTS keywords TEXT[] DEFAULT '{}';
ALTER TABLE ms_topic_clusters ADD COLUMN IF NOT EXISTS master_brief TEXT;
ALTER TABLE ms_topic_clusters ADD COLUMN IF NOT EXISTS site_id UUID REFERENCES ms_sites(id);

-- 2. ms_scheduled_posts 배차 대기열 보완
ALTER TABLE ms_scheduled_posts ADD COLUMN IF NOT EXISTS cluster_id UUID REFERENCES ms_topic_clusters(id) ON DELETE SET NULL;
ALTER TABLE ms_scheduled_posts ADD COLUMN IF NOT EXISTS platform_type TEXT DEFAULT 'tistory';

-- 3. RLS 정책 재확인 (보안)
ALTER TABLE ms_topic_clusters ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own clusters" ON ms_topic_clusters;
CREATE POLICY "Users manage own clusters" ON ms_topic_clusters
    FOR ALL USING (auth.uid() = user_id);
