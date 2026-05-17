-- Maza Autopilot OS: Absolute Infrastructure Patch (2026-05-14)
-- 모든 레거시 필드 통합 및 엔진 구동 환경 완벽 구축

-- 1. profiles 테이블 보강
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  plan TEXT DEFAULT 'free',
  credits INT DEFAULT 10,
  total_revenue NUMERIC(12, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS credits INT DEFAULT 10;

-- 2. ms_topic_clusters 테이블 보강 (엔진 가동 필수 필드)
ALTER TABLE ms_topic_clusters ADD COLUMN IF NOT EXISTS title TEXT DEFAULT '새 시리즈';
ALTER TABLE ms_topic_clusters ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE ms_topic_clusters ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE ms_topic_clusters ADD COLUMN IF NOT EXISTS keywords TEXT[] DEFAULT '{}';
ALTER TABLE ms_topic_clusters ADD COLUMN IF NOT EXISTS master_brief TEXT;
ALTER TABLE ms_topic_clusters ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE ms_topic_clusters ADD COLUMN IF NOT EXISTS current_index INT DEFAULT 0;
ALTER TABLE ms_topic_clusters ADD COLUMN IF NOT EXISTS interval_hours INT DEFAULT 3;
ALTER TABLE ms_topic_clusters ADD COLUMN IF NOT EXISTS authority_score FLOAT DEFAULT 0.1;
ALTER TABLE ms_topic_clusters ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- 데이터 정합성 보정
UPDATE ms_topic_clusters SET name = title WHERE name IS NULL AND title IS NOT NULL;
UPDATE ms_topic_clusters SET title = name WHERE title IS NULL AND name IS NOT NULL;

-- 3. ms_posts와의 연결
ALTER TABLE ms_posts ADD COLUMN IF NOT EXISTS cluster_id UUID REFERENCES ms_topic_clusters(id) ON DELETE SET NULL;
ALTER TABLE ms_scheduled_posts ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- 4. 인덱스 최적화
CREATE INDEX IF NOT EXISTS idx_topic_clusters_title ON ms_topic_clusters(title);
CREATE INDEX IF NOT EXISTS idx_topic_clusters_status ON ms_topic_clusters(status);
CREATE INDEX IF NOT EXISTS idx_topic_clusters_keywords ON ms_topic_clusters USING GIN (keywords);
CREATE INDEX IF NOT EXISTS idx_profiles_plan ON profiles(plan);

-- =============================================
-- 5. 보안 강화 (Supabase Security Advisor 대응)
-- =============================================

-- [5-1] 함수 보안 강화 (search_path 고정)
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
      updated_at = NOW()
    WHERE id = NEW.cluster_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public;

-- [5-2] 에러 해결: SECURITY DEFINER 뷰 재설정
-- v_series_progress 뷰를 삭제하고 INVOKER 권한으로 재생성하여 에러 해결
DROP VIEW IF EXISTS v_series_progress;
CREATE VIEW v_series_progress WITH (security_invoker = true) AS
SELECT 
  tc.id as cluster_id,
  tc.title,
  tc.target_depth,
  COUNT(p.id) filter (where p.status = 'published') as published_count,
  tc.status
FROM ms_topic_clusters tc
LEFT JOIN ms_posts p ON p.cluster_id = tc.id
GROUP BY tc.id;

-- [5-3] RLS 정책 강제 적용 (지능형 정책 생성)
DO $$ 
DECLARE
    t_name TEXT;
BEGIN
    FOR t_name IN SELECT unnest(ARRAY['ms_performance_metrics', 'ms_site_health', 'ms_worker_metrics', 'ms_usage_tracking', 'ms_config_snapshots'])
    LOOP
        -- 기존 정책 삭제
        EXECUTE format('DROP POLICY IF EXISTS "Policy for %I" ON %I', t_name, t_name);
        
        -- 테이블에 user_id 컬럼이 있는지 확인 후 동적 정책 생성
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = t_name AND column_name = 'user_id') THEN
            EXECUTE format('CREATE POLICY "Policy for %I" ON %I FOR ALL USING (auth.uid() = user_id)', t_name, t_name);
        ELSE
            -- user_id가 없는 시스템 테이블은 인증된 유저만 조회 가능하도록 설정
            EXECUTE format('CREATE POLICY "Policy for %I" ON %I FOR SELECT USING (auth.role() = ''authenticated'')', t_name, t_name);
        END IF;
    END LOOP;
END $$;
