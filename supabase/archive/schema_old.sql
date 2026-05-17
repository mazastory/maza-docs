-- ==========================================
-- MAZA Studio v2 - Master Schema (Clean Install)
-- 2026-05-09
-- ==========================================

-- 0. Prepare extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 0.5 Drop ALL existing legacy and current tables to ensure a 100% clean slate
DROP TABLE IF EXISTS public.ab_test_logs CASCADE;
DROP TABLE IF EXISTS public.ai_cache CASCADE;
DROP TABLE IF EXISTS public.alerts CASCADE;
DROP TABLE IF EXISTS public.analysis_details CASCADE;
DROP TABLE IF EXISTS public.analysis_events CASCADE;
DROP TABLE IF EXISTS public.approval_results CASCADE;
DROP TABLE IF EXISTS public.approved_baselines CASCADE;
DROP TABLE IF EXISTS public.challenge_states CASCADE;
DROP TABLE IF EXISTS public.challenge_templates CASCADE;
DROP TABLE IF EXISTS public.checklist CASCADE;
DROP TABLE IF EXISTS public.content_metadata CASCADE;
DROP TABLE IF EXISTS public.current_state CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.fixes CASCADE;
DROP TABLE IF EXISTS public.model_weights CASCADE;
DROP TABLE IF EXISTS public.ms_ai_cache CASCADE;
DROP TABLE IF EXISTS public.ms_events CASCADE;
DROP TABLE IF EXISTS public.ms_keywords CASCADE;
DROP TABLE IF EXISTS public.ms_posts CASCADE;
DROP TABLE IF EXISTS public.ms_revenue_history CASCADE;
DROP TABLE IF EXISTS public.ms_scheduled_posts CASCADE;
DROP TABLE IF EXISTS public.ms_series CASCADE;
DROP TABLE IF EXISTS public.ms_sites CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.rate_limits CASCADE;
DROP TABLE IF EXISTS public.revenue_tracking CASCADE;
DROP TABLE IF EXISTS public.scheduled_posts CASCADE;
DROP TABLE IF EXISTS public.sites CASCADE;
DROP TABLE IF EXISTS public.usage_logs CASCADE;
DROP TABLE IF EXISTS public.user_actions CASCADE;
DROP TABLE IF EXISTS public.user_journey_logs CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.validation_failures CASCADE;
DROP TABLE IF EXISTS public.verification_queue CASCADE;

-- ==========================================
-- 1. Profiles (Auth Link)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text,
  full_name text,
  avatar_url text,
  role text DEFAULT 'user',
  pro_status text DEFAULT 'free',
  credits integer DEFAULT 10,
  total_revenue numeric(12,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Auth Trigger for new users
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ==========================================
-- 2. ms_sites (User Blogs)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.ms_sites (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform text DEFAULT 'tistory',
  blog_name text,
  blog_description text,
  blog_nickname text,
  domain text,
  category text,
  niche text,
  copyright text,
  adsense_pub text,
  adsense_status text DEFAULT 'pending',
  setup_status jsonb DEFAULT '{"domain":false,"search_console":false,"analytics":false}'::jsonb,
  sc_verification text,
  ga_measurement_id text,
  access_token text,
  metadata jsonb DEFAULT '{}'::jsonb,
  is_setup_complete boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.ms_sites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own sites" ON public.ms_sites FOR ALL USING (auth.uid() = user_id);

-- ==========================================
-- 3. ms_keywords (Keyword Vault)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.ms_keywords (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id uuid REFERENCES public.ms_sites(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  keyword text NOT NULL,
  source text DEFAULT 'manual',
  used_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.ms_keywords ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own keywords" ON public.ms_keywords FOR ALL USING (auth.uid() = user_id);

-- ==========================================
-- 4. ms_series (Sequential Batch Campaigns)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.ms_series (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  site_id uuid REFERENCES public.ms_sites(id) ON DELETE SET NULL,
  title text NOT NULL DEFAULT '새 시리즈',
  keywords text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  current_index integer NOT NULL DEFAULT 0,
  total_count integer NOT NULL DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.ms_series ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own series" ON public.ms_series FOR ALL USING (auth.uid() = user_id);

-- ==========================================
-- 5. ms_posts (The Core Content)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.ms_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id uuid REFERENCES public.ms_sites(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  series_id uuid REFERENCES public.ms_series(id) ON DELETE SET NULL,
  title text NOT NULL,
  content text,
  keyword_id uuid REFERENCES public.ms_keywords(id) ON DELETE SET NULL,
  source_type text DEFAULT 'keyword',
  source_image_url text,
  word_count integer DEFAULT 0,
  status text DEFAULT 'draft',
  published_url text,
  seo_score integer,
  validation_score integer DEFAULT 0,
  html_content text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.ms_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own posts" ON public.ms_posts FOR ALL USING (auth.uid() = user_id);

-- ==========================================
-- 6. ms_scheduled_posts (W-05 Protocol Queue)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.ms_scheduled_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid REFERENCES public.ms_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  site_id uuid REFERENCES public.ms_sites(id) ON DELETE CASCADE,
  publish_at timestamptz NOT NULL,
  status text DEFAULT 'pending',
  error_message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.ms_scheduled_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own scheduled posts" ON public.ms_scheduled_posts FOR ALL USING (auth.uid() = user_id);

-- ==========================================
-- 7. ms_events (Action Logs)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.ms_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  status text DEFAULT 'success',
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.ms_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own events" ON public.ms_events FOR ALL USING (auth.uid() = user_id);

-- ==========================================
-- 8. ms_revenue_history (AdSense tracking)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.ms_revenue_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  site_id uuid REFERENCES public.ms_sites(id) ON DELETE CASCADE,
  amount numeric(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  source text DEFAULT 'adsense',
  recorded_at date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.ms_revenue_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own revenue" ON public.ms_revenue_history FOR ALL USING (auth.uid() = user_id);

-- ==========================================
-- 9. ai_cache (To save API costs)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.ai_cache (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt_hash text UNIQUE NOT NULL,
  model text,
  response text NOT NULL,
  tokens_used integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.ai_cache ENABLE ROW LEVEL SECURITY;
-- No user policy needed as this is an internal cache managed by server using service_role

-- ==========================================
-- Timestamps Triggers
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ms_sites_updated_at ON public.ms_sites;
CREATE TRIGGER update_ms_sites_updated_at
  BEFORE UPDATE ON public.ms_sites
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ms_series_updated_at ON public.ms_series;
CREATE TRIGGER update_ms_series_updated_at
  BEFORE UPDATE ON public.ms_series
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
