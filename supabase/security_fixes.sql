-- =============================================
-- MazaStudio - Supabase Security Fixes
-- 2026-05-12 | Security Advisor 경고 전체 해결
-- Supabase Dashboard > SQL Editor에서 실행하세요.
-- =============================================


-- =============================================
-- [1] Function Search Path Mutable 해결 (⚠️ Warning x2)
-- 함수 내 search_path를 명시적으로 고정하여
-- SQL injection 경로 차단
-- =============================================

ALTER FUNCTION public.update_updated_at_column() 
  SET search_path = public;

ALTER FUNCTION public.handle_new_user() 
  SET search_path = public;


-- =============================================
-- [2] Public/Signed-In Can Execute SECURITY DEFINER 해결 (⚠️ Warning x6)
-- PUBLIC 및 authenticated 롤에서 SECURITY DEFINER 함수를
-- 직접 호출할 수 없도록 권한 제한.
-- handle_new_user: trigger 전용이므로 service_role만 허용
-- is_admin / is_admin_safe: authenticated가 호출하되 PUBLIC은 차단
-- =============================================

-- handle_new_user: auth trigger 내부에서만 호출되므로 PUBLIC 차단
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;
GRANT  EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- is_admin: 관리자 확인 함수 — authenticated만 호출 가능
REVOKE EXECUTE ON FUNCTION public.is_admin()      FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin_safe() FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.is_admin()      TO authenticated;
GRANT  EXECUTE ON FUNCTION public.is_admin_safe() TO authenticated;


-- =============================================
-- [3] RLS Enabled No Policy 해결 (ℹ️ Info x3)
-- RLS가 활성화됐지만 정책이 없는 테이블에 정책 추가
-- =============================================

-- [3-1] ai_cache: 구버전 테이블 (ms_ai_cache로 교체됨)
--   → 서버(service_role)만 접근, 일반 유저 차단
ALTER TABLE public.ai_cache ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ai_cache_deny_public" ON public.ai_cache;
CREATE POLICY "ai_cache_deny_public"
  ON public.ai_cache
  FOR ALL
  USING (false);   -- service_role은 RLS 우회, 그 외 전면 차단

-- [3-2] ms_ai_cache: 현재 사용 중인 AI 캐시 테이블
--   → 서버(service_role)만 접근
ALTER TABLE public.ms_ai_cache ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ms_ai_cache_deny_public" ON public.ms_ai_cache;
CREATE POLICY "ms_ai_cache_deny_public"
  ON public.ms_ai_cache
  FOR ALL
  USING (false);   -- service_role은 RLS 우회

-- [3-3] ms_vaults: 개인 키워드 금고 — 본인 데이터만 조회/수정 가능
ALTER TABLE public.ms_vaults ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ms_vaults_owner_only" ON public.ms_vaults;
CREATE POLICY "ms_vaults_owner_only"
  ON public.ms_vaults
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- =============================================
-- [4] Public Bucket Allows Listing 해결 (⚠️ Warning x1)
-- storage.assets 버킷의 광범위한 SELECT 정책 제한
-- 인증된 사용자만 자신의 파일을 조회할 수 있도록 변경
-- =============================================

-- 기존 과도한 policy 삭제
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read"  ON storage.objects;
DROP POLICY IF EXISTS "Give users access to own folder" ON storage.objects;

-- 인증된 사용자: 자신의 user_id 폴더만 SELECT/INSERT/DELETE 가능
CREATE POLICY "Authenticated users own folder"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (
    bucket_id = 'assets'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'assets'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- images/ 폴더 (blog-images 버킷): 서버(service_role)가 업로드하고 공개 읽기 허용
CREATE POLICY "Public read blog images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'blog-images');


-- =============================================
-- [5] H-02 마이그레이션 (이미 schema.sql에 포함된 내용을 여기서도 실행)
-- ms_series 테이블에 누락 컬럼 추가
-- =============================================
ALTER TABLE public.ms_series ADD COLUMN IF NOT EXISTS current_index INT DEFAULT 0;
ALTER TABLE public.ms_series ADD COLUMN IF NOT EXISTS total_count   INT DEFAULT 0;


-- =============================================
-- [6] L-01: ai_cache → ms_ai_cache 데이터 이전 (선택)
-- 구버전 캐시 데이터가 있다면 신버전으로 복사
-- 비어 있다면 아래는 skip해도 됩니다.
-- =============================================
-- INSERT INTO public.ms_ai_cache (prompt_hash, model, response, tokens_used, created_at)
-- SELECT prompt_hash, model, response, tokens_used, created_at
-- FROM   public.ai_cache
-- ON CONFLICT (prompt_hash) DO NOTHING;


-- =============================================
-- ✅ 완료 체크
-- =============================================
-- ⚠️ [수동 처리 필요] Leaked Password Protection:
--   Supabase Dashboard > Authentication > Security
--   → "Enable Leaked Password Protection" 토글 ON
--
-- ⚠️ [수동 처리 필요] Public Bucket Allows Listing:
--   Supabase Dashboard > Storage > Policies
--   → assets 버킷에 위 정책이 적용됐는지 확인
-- =============================================
