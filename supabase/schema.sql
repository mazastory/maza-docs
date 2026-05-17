-- MazaStory Supabase Schema (v2)
-- "유저 행동이 곧 자연스럽게 DB에 적재되는 구조"

-- 1. profiles (Ver01과 공유, 별도 생성 안 함. 기존 테이블 재사용)

-- 2. ms_sites (유저 블로그)
CREATE TABLE IF NOT EXISTS ms_sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL, -- references profiles(id)
  platform TEXT DEFAULT 'tistory',    -- tistory | wordpress
  blog_name TEXT NOT NULL,
  blog_description TEXT,
  blog_nickname TEXT,
  domain TEXT,
  category TEXT,
  niche TEXT,
  copyright TEXT,
  adsense_pub TEXT,
  adsense_status TEXT DEFAULT 'pending', -- pending | approved | rejected
  setup_status JSONB DEFAULT '{"domain":false,"search_console":false,"analytics":false}',
  sc_verification TEXT,
  ga_measurement_id TEXT,
  access_token TEXT,
  metadata JSONB DEFAULT '{}',
  is_setup_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ms_keywords
CREATE TABLE IF NOT EXISTS ms_keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES ms_sites(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  keyword TEXT NOT NULL,
  source TEXT DEFAULT 'manual',
  used_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ms_posts (핵심)
CREATE TABLE IF NOT EXISTS ms_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES ms_sites(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  keyword_id UUID REFERENCES ms_keywords(id) ON DELETE SET NULL,
  source_type TEXT DEFAULT 'keyword',  -- keyword | photo | manual
  source_image_url TEXT,
  word_count INT DEFAULT 0,
  status TEXT DEFAULT 'draft',         -- draft | copied | published
  published_url TEXT,
  seo_score INT,
  validation_score INT DEFAULT 0,      -- AGENTS.md v5.0: 승인 확률 스코어 (0~100)
  html_content TEXT,                    -- 🔥 v2.4 Added: Structured HTML for Tistory
  metadata JSONB DEFAULT '{}',          -- 🔥 v2.4 Added: UI blocks and raw data
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ms_scheduled_posts (PRO 수익 모델)
CREATE TABLE IF NOT EXISTS ms_scheduled_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES ms_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  site_id UUID REFERENCES ms_sites(id) ON DELETE CASCADE,
  publish_at TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pending',       -- pending | success | failed
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ms_events (경량 행동 로그)
-- AGENTS.md v5.0 표준 필드: user_id, event_type, status, metadata, created_at
CREATE TABLE IF NOT EXISTS ms_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  event_type TEXT NOT NULL,            -- generate | publish | validate | login 등
  status TEXT DEFAULT 'success',       -- success | failed | skipped
  metadata JSONB DEFAULT '{}',         -- 상세 데이터 (키워드, 점수, 에러 코드 등)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ms_ai_cache (비용 절약)
CREATE TABLE IF NOT EXISTS ms_ai_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_hash TEXT UNIQUE NOT NULL,
  model TEXT,
  response TEXT NOT NULL,
  tokens_used INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1. profiles (Ver01과 공유, 필요 필드 추가)
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pro_status TEXT DEFAULT 'free';
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS credits INT DEFAULT 10;
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_revenue NUMERIC(12, 2) DEFAULT 0;

-- 2. ms_sites (기존 유지)
-- ...

-- [NEW] 8. ms_series (시리즈 배차 캠페인)
CREATE TABLE IF NOT EXISTS ms_series (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  site_id UUID REFERENCES ms_sites(id) ON DELETE CASCADE,
  title TEXT NOT NULL,                -- 시리즈 명 (예: 정부지원금 노하우 5부작)
  blueprint_id TEXT,                  -- 사용된 Winning Blueprint ID
  keywords TEXT[],                    -- 포함된 키워드 배열
  interval_hours INT DEFAULT 3,       -- 발행 간격 (W-05 규약 기본 3시간)
  current_index INT DEFAULT 0,        -- 현재 진행 인덱스 (engine.ts 업데이트 대상)
  total_count INT DEFAULT 0,          -- 전체 키워드 개수
  status TEXT DEFAULT 'active',       -- active | completed | paused
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- [NEW] 9. ms_vaults (개인 키워드 금고)
CREATE TABLE IF NOT EXISTS ms_vaults (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  site_id UUID REFERENCES ms_sites(id) ON DELETE CASCADE,
  name TEXT NOT NULL,                 -- 금고 명 (예: IT 기기 황금 키워드)
  keywords JSONB DEFAULT '[]',        -- 키워드 풀 [ { "kw": "...", "cpc": 1.2 }, ... ]
  total_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- [NEW] 10. ms_revenue_history (실제 수익 기록)
CREATE TABLE IF NOT EXISTS ms_revenue_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  site_id UUID REFERENCES ms_sites(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  source TEXT DEFAULT 'adsense',
  recorded_at DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 11. Migrations & Indexes
-- =============================================
CREATE INDEX IF NOT EXISTS idx_ms_series_user_id ON ms_series(user_id);
CREATE INDEX IF NOT EXISTS idx_ms_vaults_user_id ON ms_vaults(user_id);
CREATE INDEX IF NOT EXISTS idx_ms_revenue_history_user_id ON ms_revenue_history(user_id);

-- ms_posts에 series_id 연결
ALTER TABLE ms_posts ADD COLUMN IF NOT EXISTS series_id UUID REFERENCES ms_series(id) ON DELETE SET NULL;

-- =============================================
-- 12. H-02 마이그레이션 (2026-05-12)
-- 이미 생성된 ms_series 테이블에 누락된 컬럼 추가
-- Supabase SQL Editor에서 한 번 실행하세요.
-- =============================================
ALTER TABLE ms_series ADD COLUMN IF NOT EXISTS current_index INT DEFAULT 0;
ALTER TABLE ms_series ADD COLUMN IF NOT EXISTS total_count INT DEFAULT 0;

-- L-01: ai_cache 테이블이 ms_ai_cache 로 명칭 통일됨 (aiClient.ts 이미 반영)
-- 기존에 ai_cache 테이블이 있다면 아래 실행:
-- ALTER TABLE ai_cache RENAME TO ms_ai_cache;
