-- MAZA Studio SEO Authority Engine Migration
-- Phase 6: Topic Graphs & Silo Structures

-- 1. 주제 그래프 테이블
CREATE TABLE IF NOT EXISTS ms_topic_graphs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    main_topic TEXT NOT NULL,
    sub_topics JSONB NOT NULL DEFAULT '[]', -- [{ "topic": "...", "depth": 1, "is_covered": boolean }]
    silo_structure JSONB, -- { "root": "...", "children": [...] }
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ms_topic_graphs_user_topic ON ms_topic_graphs (user_id, main_topic);

-- 2. 내부 링크 매핑 정보 (Orphan 방지용)
ALTER TABLE ms_posts ADD COLUMN IF NOT EXISTS outgoing_links JSONB DEFAULT '[]'; -- 이 글에서 나가는 링크
ALTER TABLE ms_posts ADD COLUMN IF NOT EXISTS incoming_links_count INTEGER DEFAULT 0; -- 이 글로 들어오는 링크 수

-- 3. Thin Content 감지용 메타데이터 필드 추가 (필요 시)
-- 이미 metadata 필드가 있으므로 별도 컬럼은 생략 가능하나, 빠른 조회를 위해 추가 가능
ALTER TABLE ms_posts ADD COLUMN IF NOT EXISTS information_density FLOAT DEFAULT 0;
