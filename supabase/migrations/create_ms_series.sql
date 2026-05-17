-- MazaStudio: ms_series 테이블 생성 마이그레이션
-- 실행 방법: Supabase Dashboard > SQL Editor 에서 이 파일 내용을 붙여넣고 실행

CREATE TABLE IF NOT EXISTS public.ms_series (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  site_id uuid REFERENCES public.ms_sites(id) ON DELETE SET NULL,
  title text NOT NULL DEFAULT '새 시리즈',
  keywords text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  current_index integer NOT NULL DEFAULT 0,
  total_count integer NOT NULL DEFAULT 0,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS 활성화
ALTER TABLE public.ms_series ENABLE ROW LEVEL SECURITY;

-- 정책: 본인 시리즈만 관리 가능
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'ms_series' AND policyname = 'Users can manage own series'
  ) THEN
    CREATE POLICY "Users can manage own series" ON public.ms_series
      FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

-- Service Role 전체 접근 허용
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'ms_series' AND policyname = 'Service role full access'
  ) THEN
    CREATE POLICY "Service role full access" ON public.ms_series
      FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_ms_series_updated_at ON public.ms_series;
CREATE TRIGGER update_ms_series_updated_at
  BEFORE UPDATE ON public.ms_series
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
