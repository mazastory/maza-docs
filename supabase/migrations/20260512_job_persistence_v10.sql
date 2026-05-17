-- MAZA Studio Standardized State Machine & Job Persistence
-- AGENTS.md: Operational Hardening (P-03)

-- 1. 상태 타입 정의 (ENUM 대안으로 CHECK 제약 조건 사용)
ALTER TABLE ms_scheduled_posts DROP CONSTRAINT IF EXISTS ms_scheduled_posts_status_check;
ALTER TABLE ms_scheduled_posts ADD CONSTRAINT ms_scheduled_posts_status_check 
CHECK (status IN (
    'queued',           -- 대기 중
    'processing',       -- 작업 중 (AI/Image 등)
    'retrying',         -- 실패 후 재시도 대기
    'waiting_external', -- 외부 신호 대기 (익스텐션 등)
    'publishing',       -- 실제 플랫폼 발행 중
    'verifying',        -- 발행 후 URL 검증 중
    'completed',        -- 성공 완료
    'failed',           -- 실패 (재시도 가능)
    'dead'              -- 완전 실패 (재시도 횟수 초과)
));

-- 2. 고도화된 지속성 필드 추가
ALTER TABLE ms_scheduled_posts 
ADD COLUMN IF NOT EXISTS job_id TEXT, -- BullMQ Job ID 연동
ADD COLUMN IF NOT EXISTS worker_type TEXT, -- 'ai', 'publish', 'full'
ADD COLUMN IF NOT EXISTS retry_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS max_retries INTEGER DEFAULT 3,
ADD COLUMN IF NOT EXISTS last_error TEXT,
ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS next_retry_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS trace_id TEXT, -- 분산 추적용 ID
ADD COLUMN IF NOT EXISTS content_hash TEXT; -- 중복 생성 방지용

-- 3. 인덱스 강화
CREATE INDEX IF NOT EXISTS idx_ms_scheduled_status_retry ON ms_scheduled_posts (status, next_retry_at) WHERE status IN ('queued', 'retrying');
CREATE INDEX IF NOT EXISTS idx_ms_scheduled_trace ON ms_scheduled_posts (trace_id);
