-- Maza Autopilot OS: Series Commander Infrastructure (Section 20)
-- 1. 시리즈 마스터 전략 저장 테이블 보완
CREATE TABLE IF NOT EXISTS ms_topic_clusters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    title TEXT,
    master_brief TEXT, 
    status TEXT DEFAULT 'planning', 
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 테이블이 이미 존재할 경우를 대비해 컬럼 강제 추가 및 속성 변경
ALTER TABLE ms_topic_clusters ADD COLUMN IF NOT EXISTS title TEXT;
UPDATE ms_topic_clusters SET title = '무제 시리즈' WHERE title IS NULL;
ALTER TABLE ms_topic_clusters ALTER COLUMN title SET NOT NULL;

-- 2. 포스트 테이블에 맥락 요약 필드 추가
ALTER TABLE ms_posts 
ADD COLUMN IF NOT EXISTS cluster_id UUID REFERENCES ms_topic_clusters(id),
ADD COLUMN IF NOT EXISTS key_takeaways TEXT, 
ADD COLUMN IF NOT EXISTS series_order INTEGER;

-- 3. 스케줄러 대기열 보완
ALTER TABLE ms_scheduled_posts
ADD COLUMN IF NOT EXISTS retry_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_error TEXT,
ADD COLUMN IF NOT EXISTS platform_type TEXT DEFAULT 'tistory';

-- 4. 시리즈 진행 상황을 추적하기 위한 뷰 생성 (기존 뷰 삭제 후 재생성)
DROP VIEW IF EXISTS v_series_progress;
CREATE OR REPLACE VIEW v_series_progress AS
SELECT 
    c.id as cluster_id,
    c.title as series_title,
    COUNT(p.id) as total_posts,
    c.status as cluster_status,
    MAX(p.created_at) as last_post_at
FROM ms_topic_clusters c
LEFT JOIN ms_posts p ON c.id = p.cluster_id
GROUP BY c.id, c.title, c.status;
