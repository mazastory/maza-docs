-- 2026-05-12: ms_scheduled_posts 테이블에 장애 복구 필드 추가
-- 실행 위치: Supabase Dashboard > SQL Editor

ALTER TABLE public.ms_scheduled_posts 
ADD COLUMN IF NOT EXISTS retry_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_error text,
ADD COLUMN IF NOT EXISTS next_retry_at timestamptz,
ADD COLUMN IF NOT EXISTS failure_reason text;

-- 인덱스 추가 (빠른 스케줄링 조회를 위함)
CREATE INDEX IF NOT EXISTS idx_ms_scheduled_posts_next_retry ON public.ms_scheduled_posts(next_retry_at) 
WHERE status = 'failed' OR status = 'pending';
