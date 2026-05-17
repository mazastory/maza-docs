-- MAZA Studio Scheduler v4 Migration
-- Phase 4: Durable Schedule & State Machine

-- 1. ms_scheduled_posts 상태 제약 조건 업데이트
-- 기존 제약 조건 삭제 후 신규 상태 추가
ALTER TABLE ms_scheduled_posts DROP CONSTRAINT IF EXISTS ms_scheduled_posts_status_check;

ALTER TABLE ms_scheduled_posts ADD CONSTRAINT ms_scheduled_posts_status_check 
CHECK (status IN (
    'queued',           -- 대기열 진입
    'generating',       -- AI 집필 중
    'validating',       -- SEO/AdSense 검증 중
    'waiting_publish',  -- 발행 대기 (티스토리/익스텐션 등)
    'publishing',       -- API 발행 진행 중
    'verifying',        -- 발행 후 검증 중
    'success',          -- 완료
    'retry',            -- 일시적 오류로 인한 재시도 대기
    'dead'              -- 영구 오류 (실패)
));

-- 2. Idempotency(멱등성) 필드 추가
ALTER TABLE ms_scheduled_posts ADD COLUMN IF NOT EXISTS keyword TEXT;
ALTER TABLE ms_scheduled_posts ADD COLUMN IF NOT EXISTS publish_hash TEXT;
ALTER TABLE ms_scheduled_posts ADD COLUMN IF NOT EXISTS execution_id UUID DEFAULT gen_random_uuid();
ALTER TABLE ms_scheduled_posts ADD COLUMN IF NOT EXISTS last_error TEXT;
ALTER TABLE ms_scheduled_posts ADD COLUMN IF NOT EXISTS retry_count INTEGER DEFAULT 0;

-- 3. 인덱스 추가 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_ms_scheduled_posts_status_at ON ms_scheduled_posts (status, publish_at);
CREATE INDEX IF NOT EXISTS idx_ms_scheduled_posts_hash ON ms_scheduled_posts (publish_hash);

-- 4. ms_posts 테이블 상태도 동기화 (필요 시)
ALTER TABLE ms_posts DROP CONSTRAINT IF EXISTS ms_posts_status_check;
ALTER TABLE ms_posts ADD CONSTRAINT ms_posts_status_check 
CHECK (status IN ('draft', 'ready_to_publish', 'published', 'failed', 'generating', 'validating'));
