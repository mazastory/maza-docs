-- =============================================
-- MAZA Studio - Topic Cluster Schema (Phase B-1)
-- Authority Graph 실체화: Topic Cluster, Silo, Internal Link
-- =============================================

-- 1. Topic Cluster (필라 페이지 중심 묶음)
CREATE TABLE IF NOT EXISTS ms_topic_clusters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  site_id UUID REFERENCES ms_sites(id) ON DELETE CASCADE,
  pillar_keyword TEXT NOT NULL,          -- 핵심 키워드 (예: "재테크")
  sub_keywords TEXT[] DEFAULT '{}',      -- 연관 키워드 배열 (예: ["주식", "적금", "ETF"])
  silo_name TEXT,                        -- Silo 이름 (카테고리 단위)
  target_depth INTEGER DEFAULT 5,        -- 목표 글 수
  current_depth INTEGER DEFAULT 0,       -- 현재 발행 글 수
  authority_score FLOAT DEFAULT 0.0,    -- 0.0 ~ 1.0 (실제 CTR/인덱싱 기반)
  status TEXT DEFAULT 'building'         -- building | established | dominant
    CHECK (status IN ('building', 'established', 'dominant')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ms_posts에 cluster_id FK 추가
ALTER TABLE ms_posts 
  ADD COLUMN IF NOT EXISTS cluster_id UUID REFERENCES ms_topic_clusters(id) ON DELETE SET NULL;

-- 3. Internal Link Graph (글 간 연결 관계)
CREATE TABLE IF NOT EXISTS ms_internal_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_post_id UUID NOT NULL REFERENCES ms_posts(id) ON DELETE CASCADE,
  target_post_id UUID NOT NULL REFERENCES ms_posts(id) ON DELETE CASCADE,
  anchor_text TEXT,                      -- 실제 링크 앵커 텍스트
  is_pillar_link BOOLEAN DEFAULT FALSE,  -- 필라 페이지로 향하는 링크 여부
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(source_post_id, target_post_id)
);

-- 4. Cluster 자동 업데이트 (글 발행 시 depth 증가)
CREATE OR REPLACE FUNCTION update_cluster_depth()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.cluster_id IS NOT NULL AND NEW.status = 'published' THEN
    UPDATE ms_topic_clusters
    SET 
      current_depth = (
        SELECT COUNT(*) FROM ms_posts 
        WHERE cluster_id = NEW.cluster_id AND status = 'published'
      ),
      status = CASE
        WHEN current_depth >= target_depth THEN 'established'
        ELSE 'building'
      END,
      updated_at = NOW()
    WHERE id = NEW.cluster_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_post_published_update_cluster ON ms_posts;
CREATE TRIGGER on_post_published_update_cluster
  AFTER INSERT OR UPDATE ON ms_posts
  FOR EACH ROW EXECUTE FUNCTION update_cluster_depth();

-- 5. 인덱스
CREATE INDEX IF NOT EXISTS idx_topic_clusters_user ON ms_topic_clusters(user_id);
CREATE INDEX IF NOT EXISTS idx_topic_clusters_site ON ms_topic_clusters(site_id);
CREATE INDEX IF NOT EXISTS idx_posts_cluster ON ms_posts(cluster_id);
CREATE INDEX IF NOT EXISTS idx_internal_links_source ON ms_internal_links(source_post_id);
CREATE INDEX IF NOT EXISTS idx_internal_links_target ON ms_internal_links(target_post_id);

-- RLS 정책
ALTER TABLE ms_topic_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE ms_internal_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own clusters" ON ms_topic_clusters
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own links" ON ms_internal_links
  FOR ALL USING (
    EXISTS (SELECT 1 FROM ms_posts WHERE id = source_post_id AND user_id = auth.uid())
  );
