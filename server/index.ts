import './env.js'; // MUST BE FIRST
import { env } from './config/env.js';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { MazaLogger } from './lib/logger.js';

if (process.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.VITE_SENTRY_DSN,
    integrations: [
      nodeProfilingIntegration(),
    ],
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,
    profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,
    environment: process.env.NODE_ENV || 'development'
  });
  MazaLogger.info('[Server] 🛡️ Sentry Node SDK initialized.');
}
import express from 'express';
import { createServer } from 'http';
import { initWebSocketServer } from './lib/websocketServer.js';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { rateLimit } from 'express-rate-limit';
import generateRoute from './routes/generate.js';
import photoRoute from './routes/photo.js';
import verifyRoute from './routes/verify.js';
import dashboardRoute from './routes/dashboard.js';
import googleRoute from './routes/google.js';
import seriesRoute from './routes/series.js';
import refineRoute from './routes/refine.js';
import healthRoute from './routes/health.js';
import registryRoute from './routes/registry.js';
import extensionRoute from './routes/extension.js'; 
import orchestratorRoute from './routes/orchestrator.js';
import hunterRoute from './routes/hunter.js';
import platformsRoute from './routes/platforms.js';
import { supabaseAdmin } from './lib/supabaseServer.js';
import { getOptimizedImage } from './lib/imageService.js';
import { startWorkers, stopWorkers } from './workers/index.js';
import { requireAuth } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = process.env.PORT || 3001;

// [PROD FIX] Trust proxy for Cloud Run/Load Balancer (rate-limit protection)
app.set('trust proxy', 1);

// [O-01] Trace ID Middleware
app.use((req, res, next) => {
  const traceId = req.headers['x-request-id'] || uuidv4();
  req.headers['x-request-id'] = traceId;
  next();
});

// Global API Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 300, // limit each IP to 300 requests per windowMs
  message: { success: false, error: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해 주세요.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', apiLimiter);

// [B-03 FIX] CORS — 로컬 개발 + 프로덕션 도메인 통합
const allowedOrigins = [
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:3000',
  'https://mazastudio.kr',
  'https://www.mazastudio.kr',
  'https://api.mazastudio.kr',
  process.env.FRONTEND_URL || '',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // 서버 간 요청(origin 없음) 또는 Extension 허용
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('chrome-extension://')) {
      return callback(null, true);
    }
    callback(new Error('CORS policy: Origin not allowed'));
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Setup health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'MazaStory Minimal Server is running' });
});

// Setup ready check (checks DB and Redis connections)
app.get('/api/ready', async (req, res) => {
  try {
    let dbOk = false;
    let redisOk = false;
    
    // Check DB
    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin.from('ms_events').select('id').limit(1);
      if (!error) dbOk = true;
    }
    
    // Check Redis
    const { redisConnection } = await import('./lib/redis.js');
    if (redisConnection.status === 'ready') {
      await redisConnection.ping();
      redisOk = true;
    }

    if (dbOk && redisOk) {
      res.status(200).json({ status: 'ready', db: 'ok', redis: 'ok' });
    } else {
      res.status(503).json({ status: 'not_ready', db: dbOk ? 'ok' : 'error', redis: redisOk ? 'ok' : 'error' });
    }
  } catch (error: any) {
    res.status(503).json({ status: 'not_ready', error: error.message });
  }
});

// Serve dynamic environment configuration to the frontend
app.get('/api/config.js', (req, res) => {
  const config = {
    VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY,
  };
  res.type('application/javascript');
  res.send(`window.__RUNTIME_CONFIG__ = ${JSON.stringify(config)};`);
});

// Setup multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Routes
app.use('/api/generate', generateRoute);
app.use('/api/generate/photo', photoRoute);
app.use('/api/verify', verifyRoute);
app.use('/api/dashboard', dashboardRoute);
app.use('/api/google', googleRoute);
app.use('/api/series', seriesRoute);
app.use('/api/refine', refineRoute);
app.use('/api/health/stats', healthRoute);
app.use('/api/registry', registryRoute);
app.use('/api/extension', extensionRoute); // v2.0: Extension AI 엔드포인트
app.use('/api/admin/orchestrator', orchestratorRoute);
app.use('/api/hunter', hunterRoute);
app.use('/api/platforms', platformsRoute);

app.post('/api/dashboard/log-gsc-ping', async (req, res) => {
  try {
    const { user_id, type } = req.body;
    if (!user_id) return res.status(400).json({ success: false, error: 'user_id is required' });
    
    await supabaseAdmin.from('ms_events').insert([{
      user_id,
      event_type: 'gsc_ping',
      metadata: { type }
    }]);
    
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// /api/seo-check: 미구현으로 인해 제거됨 (M-04 클린업)
// TODO: 향후 블로그 홈 SEO 전체 점검 기능으로 구현 예정

app.post('/api/image', async (req, res) => {
  try {
    const { keyword } = req.body;
    if (!keyword) return res.status(400).json({ success: false, error: 'keyword is required' });
    const imageUrl = await getOptimizedImage(keyword);
    res.json({ success: true, data: imageUrl });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// /api/setup/auto is deprecated in favor of /api/google/* real endpoints in google.ts

// /api/series/:id/schedule is now handled inside seriesRoute

// [SECURITY FIX 2] requireAuth 적용 - user_id 파라미터 신뢰 금지
app.get('/api/sites', requireAuth, async (req, res) => {
  try {
    const userId = req.userId!; // JWT에서 추출한 검증된 ID
    
    const { data, error } = await supabaseAdmin
      .from('ms_sites')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;

    const sites = (data || []).map((s: any) => ({
      ...s,
      metadata: {
        google_site_verification: s.sc_verification,
        ga4_measurement_id: s.ga_measurement_id
      }
    }));

    res.json({ sites });
  } catch (error: any) {
    MazaLogger.error(`[API Error] /api/sites:`, error);
    res.status(500).json({ error: '사이트 정보를 가져오는 중 오류가 발생했습니다.' }); // sanitized
  }
});


// [SECURITY FIX 2] requireAuth 적용
app.get('/api/extension/pending-posts', requireAuth, async (req, res) => {
  try {
    const user_id = req.userId!; // JWT 검증된 ID

    // 1. ms_scheduled_posts에서 발행 대기 중인 포스트 조회 (미래 예약 포함)
    const { data: scheduled } = await supabaseAdmin
      .from('ms_scheduled_posts')
      .select(`
        id, publish_at, status,
        ms_posts (id, title, content, html_content, metadata, status),
        ms_sites (id, domain, platform)
      `)
      .eq('user_id', user_id)
      .in('status', ['pending', 'ready', 'processing']) 
      // [Diversity Fix] 대소문자 관계없이 tistory 플랫폼 검색
      .or('platform.ilike.tistory', { foreignTable: 'ms_sites' })
      .order('publish_at', { ascending: true })
      .limit(20);

    // 2. ms_posts에서 직접 draft 상태인 포스트 조회 (수동 발행용)
    const { data: drafts } = await supabaseAdmin
      .from('ms_posts')
      .select('*, ms_sites(domain, platform)')
      .eq('user_id', user_id)
      .neq('status', 'published')
      .neq('status', 'deleted')
      .or('platform.ilike.tistory', { foreignTable: 'ms_sites' })
      .order('created_at', { ascending: false })
      .limit(50);
    
    // [Selector Fix] 최신 티스토리 셀렉터 정보 가져오기
    const { data: selectorData } = await supabaseAdmin
      .from('ms_selectors')
      .select('selectors')
      .eq('platform', 'tistory')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const tistorySelectors = selectorData?.selectors || null;

    // Combine and map to extension format
    const allItems: any[] = [];

    // Scheduled items (Priority)
    (scheduled || []).forEach((item: any) => {
      if (!item.ms_posts || !item.ms_sites) return;
      
      // 예약 포스트인 경우에도 엔진 상태가 ready_to_publish이거나 image_processing인 경우 노출
      const engineStatus = item.ms_posts.metadata?.engine_status;
      const isProcessing = engineStatus === 'image_processing';
      if (engineStatus && engineStatus !== 'ready_to_publish' && !isProcessing) return;

      allItems.push({
        id: item.ms_posts.id,
        scheduled_id: item.id,
        content: {
          title: item.ms_posts.title,
          content: item.ms_posts.content,
          html: item.ms_posts.html_content || item.ms_posts.content,
          keyword: item.ms_posts.metadata?.data?.topic || item.ms_posts.metadata?.data?.keyword || item.ms_posts.title,
          hashtags: item.ms_posts.metadata?.data?.hashtags || [],
          category: item.ms_posts.metadata?.data?.category || '',
          domain: item.ms_sites.domain,
          platform: item.ms_sites.platform, // 플랫폼 추가
          image1: item.ms_posts.metadata?.data?.image1 || null,
          blocks: item.ms_posts.metadata?.blocks,
          selectors: tistorySelectors
        },
        publish_at: item.publish_at,
        is_scheduled: true
      });
    });

    // Manual draft items
    (drafts || []).forEach((p: any) => {
      if (allItems.find(item => item.id === p.id)) return;
      
      const site = Array.isArray(p.ms_sites) ? p.ms_sites[0] : p.ms_sites;
      if (!site?.domain) return; // 도메인 없으면 제외

      allItems.push({
        id: p.id,
        content: {
          title: p.title,
          content: p.content,
          html: p.html_content || p.content,
          keyword: p.metadata?.data?.topic || p.metadata?.data?.keyword || p.title,
          hashtags: p.metadata?.data?.hashtags || [],
          category: p.metadata?.data?.category || '',
          domain: site.domain,
          platform: site.platform, // 플랫폼 추가
          selectors: tistorySelectors
        },
        is_scheduled: false
      });
    });

    res.json({ posts: allItems });
  } catch (error: any) {
    console.error('[Extension API Error]', error);
    res.status(500).json({ error: error.message });
  }
});

// [NOTE] /api/dashboard/autopilot-status는 server/routes/dashboard.ts 에서 처리
// 이 파일의 중복 핸들러는 제거됨 (dashboard.ts 라우트가 우선 등록되어야 함)

// [SECURITY FIX 2] requireAuth 적용
app.get('/api/extension/stats', requireAuth, async (req, res) => {
  try {
    const user_id = req.userId!;

    const { count: published_count } = await supabaseAdmin
      .from('ms_posts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user_id)
      .eq('status', 'published');
    
    res.json({
      published_count: published_count || 0,
      challenge_day: 1
    });
  } catch (error: any) {
    res.status(500).json({ error: '통계를 가져오는 중 오류가 발생했습니다.' }); // sanitized
  }
});

// [NOTE] /api/extension/delete-post, /api/extension/analyze-page, /api/extension/preview-injection
// 이 경로들은 server/routes/extension.ts (extensionRoute)가 담당합니다.
// 아래 inline 핸들러는 기존 mark-published와 stats로만 구성됩니다.

// [SECURITY FIX 3] mark-published: requireAuth + PostStatus Enum 적용 (RULE-03)
app.post('/api/extension/mark-published', requireAuth, async (req, res) => {
  try {
    const { post_id, scheduled_id, published_url } = req.body;
    const user_id = req.userId!; // JWT 검증된 ID
    const { verificationQueue } = await import('./lib/queues.js');
    const { PostStatus } = await import('./lib/postStatus.js');

    if (!post_id || !published_url) {
      return res.status(400).json({ success: false, error: 'post_id와 published_url이 필요합니다.' });
    }

    // [SECURITY] 자신의 포스트인지 확인 후 VERIFYING 상태로 전환
    const { data: post, error: postErr } = await supabaseAdmin
      .from('ms_posts')
      .update({ 
        status: PostStatus.VERIFYING, // RULE-02: Enum 사용
        published_url: published_url 
      })
      .eq('id', post_id)
      .eq('user_id', user_id) // 자신의 포스트만 업데이트
      .select('id')
      .single();

    if (postErr || !post) {
      return res.status(403).json({ success: false, error: '접근 권한이 없거나 포스트를 찾을 수 없습니다.' });
    }

    if (scheduled_id) {
      await supabaseAdmin
        .from('ms_scheduled_posts')
        .update({ status: PostStatus.VERIFYING })
        .eq('id', scheduled_id);
    }

    // 비동기 검증 큐에 추가 (RULE-03: 검증 통과 시에만 PUBLISHED 처리)
    await verificationQueue.add('verify-url', {
      postId: post_id,
      scheduledId: scheduled_id,
      publishedUrl: published_url
    });
    
    res.json({ success: true, message: '발행 검증 중입니다...' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: '발행 처리 중 오류가 발생했습니다.' }); // sanitized
  }
});

// Extension Telemetry Receiver (Step 5 - 익스텐션 에러 수신)
app.post('/api/observability/log', async (req, res) => {
  try {
    const { context, error, meta } = req.body;
    const msg = `[EXT:${context}] ${error?.message || 'unknown'}`;
    console.error(msg, meta);

    // DB에 기록 (선택적 - ms_events 테이블 활용)
    if (supabaseAdmin && meta?.taskId) {
      await supabaseAdmin.from('ms_events').insert([{
        user_id: meta?.userId || 'extension',
        event_type: 'extension_error',
        metadata: { context, error, meta }
      }]).then(() => {}).catch(() => {}); // 로깅 실패는 무시
    }
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ success: false });
  }
});

// =============================================
// [v3] Extension Infra Inject API
// =============================================

/**
 * POST /api/extension/infra-inject
 * 웹앱 → 서버 → Redis Queue → 익스텐션(Polling) → 티스토리 DOM 주입
 */
app.post('/api/extension/infra-inject', requireAuth, async (req, res) => {
  const { domain, sc_verification, ga_measurement_id } = req.body;
  const user_id = req.userId!;
  const redis = (await import('./lib/redis.js')).default;

  const jobId = `infra-${Date.now()}`;
  
  // [BUG-3 FIX] 입력값 정제 — 쌍따옴표/홑따옴표/접두사 모두 처리
  let clean_sc = sc_verification?.trim() || '';
  // <meta ... content="XXX" /> 전체 태그에서 값만 추출
  const scDoubleMatch = clean_sc.match(/content="([^"]+)"/);
  const scSingleMatch = clean_sc.match(/content='([^']+)'/);
  if (scDoubleMatch) clean_sc = scDoubleMatch[1];
  else if (scSingleMatch) clean_sc = scSingleMatch[1];
  // google-site-verification=XXX 접두사 제거
  if (clean_sc.startsWith('google-site-verification=')) {
    clean_sc = clean_sc.replace('google-site-verification=', '');
  }

  let clean_ga = ga_measurement_id?.trim() || '';
  // ?id=G-XXX 패턴에서 값만 추출
  if (clean_ga.includes('id=')) {
    const match = clean_ga.match(/id=(G-[A-Z0-9]+)/);
    if (match) clean_ga = match[1];
  }
  // G-로 시작하지 않으면 무효
  if (clean_ga && !clean_ga.startsWith('G-')) clean_ga = '';

  // [BUG-3 FIX] 빈 값이면 해당 코드 블록 제외 (빈 메타태그 주입 방지)
  const scHtml = clean_sc
    ? `<meta name="google-site-verification" content="${clean_sc}" />`
    : '';
  const gaHtml = clean_ga
    ? `<!-- Global site tag (gtag.js) -->\n<script async src="https://www.googletagmanager.com/gtag/js?id=${clean_ga}"></script>\n<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${clean_ga}');</script>`
    : '';

  if (!scHtml && !gaHtml) {
    return res.status(400).json({ success: false, error: '주입할 서치콘솔 또는 GA4 코드가 없습니다. 값을 먼저 저장해 주세요.' });
  }

  const htmlParts = [scHtml, gaHtml].filter(Boolean);
  const html = `<!-- Maza Infra -->\n${htmlParts.join('\n')}\n<!-- End Maza Infra -->`;

  try {
    const task = {
      id: jobId,
      type: 'INFRA_INJECT',
      platform: 'tistory',
      domain: domain,
      url: `https://${domain.split('.')[0]}.tistory.com/manage/design/skin/edit#/source/html`,
      payload: {
        html
      }
    };

    // Redis 리스트에 작업 추가 (최우선 순위로 처리하기 위해 LPUSH)
    await redis.lpush(`tasks:queue:${user_id}`, JSON.stringify(task));
    // 오래된 작업 방지를 위해 만료 시간 설정 (선택사항, 리스트는 expire 대신 직접 관리 권장)
    
    console.log(`[v3 Infra] Task ${jobId} queued for user ${user_id}`);
    res.json({ success: true, message: '작업이 큐에 등록되었습니다.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// =============================================
// [v3 Architecture] Orchestration APIs
// =============================================

/**
 * 익스텐션 전용: 다음 실행할 작업 가져오기 (Orchestrator -> Robot Arm)
 */
app.get('/api/tasks/next', requireAuth, async (req, res) => {
  try {
    const user_id = req.userId!;
    const redis = (await import('./lib/redis.js')).default;

    // 0. Redis에서 즉시 실행 작업(예: INFRA_INJECT) 조회
    const redisTask = await redis.rpop(`tasks:queue:${user_id}`);
    if (redisTask) {
      const task = JSON.parse(redisTask);
      console.log(`[v3 Orchestrator] Redis task found: ${task.id}`);
      return res.json({ success: true, command: 'EXECUTE', data: task });
    }
    
    // 1. 최우선 순위 작업 조회 (예약된 포스트 중 미발행 건)
    const { data: nextTask, error } = await supabaseAdmin
      .from('ms_scheduled_posts')
      .select('*, ms_sites(domain, platform), ms_posts(title, content, html_content, metadata)')
      .eq('user_id', user_id)
      .eq('status', 'pending')
      .lte('scheduled_at', new Date().toISOString())
      .order('scheduled_at', { ascending: true })
      .limit(1)
      .maybeSingle(); // single() 대신 maybeSingle() 사용 (error 방지)

    if (error || !nextTask) {
      return res.json({ success: true, command: 'IDLE', message: '대기 중인 작업이 없습니다.' });
    }

    // 2. 명령 객체(Command Object) 구성
    const command = {
      id: nextTask.id,
      type: 'PUBLISH_POST',
      platform: nextTask.ms_sites.platform,
      domain: nextTask.ms_sites.domain,
      url: `https://${nextTask.ms_sites.domain.split('.')[0]}.tistory.com/manage/post`,
      payload: {
        title: nextTask.ms_posts.title,
        body: nextTask.ms_posts.html_content || nextTask.ms_posts.content,
        tags: nextTask.ms_posts.metadata?.data?.hashtags || [],
      }
    };

    // 3. 작업 상태를 'processing'으로 업데이트 (중복 실행 방지)
    await supabaseAdmin
      .from('ms_scheduled_posts')
      .update({ status: 'processing', updated_at: new Date().toISOString() })
      .eq('id', nextTask.id);

    console.log(`[v3 Orchestrator] Task ${nextTask.id} assigned to extension.`);
    res.json({ success: true, command: 'EXECUTE', data: command });
  } catch (error: any) {
    console.error('[v3 Orchestrator Error]', error);
    res.status(500).json({ success: false, error: '명령을 생성하지 못했습니다.' });
  }
});

/**
 * [Phase 5] Hunter Engine: Emergency Stop
 * 진행 중인 시리즈 생성을 즉시 중단하고 대기열을 파기합니다.
 */
app.post('/api/hunter/stop-series', requireAuth, async (req, res) => {
  try {
    const user_id = req.userId!;
    
    // 1. 진행 중(GENERATING)이거나 대기 중(QUEUED)인 모든 작업을 CANCELLED로 변경
    const { error } = await supabaseAdmin
      .from('ms_scheduled_posts')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('user_id', user_id)
      .in('status', ['generating', 'queued', 'processing']);

    if (error) throw error;

    console.log(`[Hunter] 🛑 Emergency Stop triggered for user: ${user_id}`);
    res.json({ success: true, message: '모든 자동화 작업이 중단되었습니다.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: '중단 요청 처리 실패' });
  }
});

/**
 * 익스텐션 전용: 작업 결과 보고 (Robot Arm -> Orchestrator)
 */
app.post('/api/tasks/report', requireAuth, async (req, res) => {
  try {
    const { taskId, postId, status, result } = req.body;
    const user_id = req.userId!;
    
    const { PostStatus } = await import('./lib/postStatus.js');
    const { verificationQueue } = await import('./lib/queues.js');

    if (status === 'success') {
      // 성공 시 발행 URL 업데이트 및 검증 큐 추가
      await supabaseAdmin
        .from('ms_posts')
        .update({ 
          status: PostStatus.VERIFYING,
          published_url: result.published_url 
        })
        .eq('id', postId)
        .eq('user_id', user_id);

      await supabaseAdmin
        .from('ms_scheduled_posts')
        .update({ status: PostStatus.VERIFYING })
        .eq('id', taskId);

      // 비동기 검증 큐 추가
      await verificationQueue.add('verify-url', {
        postId: postId,
        scheduledId: taskId,
        publishedUrl: result.published_url
      });
    } else {
      // 실패 시 상태 업데이트
      await supabaseAdmin
        .from('ms_scheduled_posts')
        .update({ 
          status: 'failed',
          metadata: { error: result.error }
        })
        .eq('id', taskId);
    }

    console.log(`[v3 Orchestrator] Task ${taskId} reported as ${status}.`);
    res.json({ success: true, blocks: result.blocks || [] });
  } catch (error: any) {
    MazaLogger.error(`[Revise] Error`, error);
    res.status(500).json({ success: false, error: error.message || "수정 중 오류 발생" });
  }
});

if (process.env.VITE_SENTRY_DSN) {
  Sentry.setupExpressErrorHandler(app);
}

// [E-01] Global Error Handler (MUST BE AFTER ROUTES)
app.use(errorHandler);

// --- Serve React Frontend ---
// Serve static files from the React app build directory
app.use(express.static(path.join(process.cwd(), 'dist')));

// The "catchall" handler: for any request that doesn't match an API route, send back React's index.html
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ error: 'API route not found' });
  } else {
    res.sendFile(path.join(process.cwd(), 'dist/index.html'));
  }
});

// [B-03] 프로덕션: 빌드된 프론트엔드 정적 파일 서빙
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(path.dirname(new URL(import.meta.url).pathname), '../dist');
  app.use(express.static(distPath));
  // SPA fallback — /api/* 제외 모든 경로를 index.html로
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
  MazaLogger.info(`[Server] Serving static files from: ${distPath}`);
}

// ── v3: HTTP + WebSocket 통합 서버 ───────────────────────
const httpServer = createServer(app);
initWebSocketServer(httpServer);

// Graceful shutdown (tsx watch 재시작 시 EADDRINUSE 방지)
let isShuttingDown = false;
const shutdown = async (signal: string) => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  MazaLogger.info(`[Server] Received ${signal}. Shutting down gracefully...`);
  
  // Give current requests 5 seconds to finish
  const forceExitTimeout = setTimeout(() => {
    MazaLogger.warn('[Server] Forceful shutdown initiated after timeout.');
    process.exit(1);
  }, 5000);

  try {
    await stopWorkers();
    httpServer.close(() => {
      MazaLogger.info('[Server] HTTP server closed.');
      clearTimeout(forceExitTimeout);
      process.exit(0);
    });
  } catch (err) {
    MazaLogger.error('[Server] Error during shutdown', err);
    process.exit(1);
  }
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));

// Start server
httpServer.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    MazaLogger.error(`[Server] ❌ Port ${port} already in use. Run: lsof -ti :${port} | xargs kill -9`);
    process.exit(1);
  } else {
    throw err;
  }
});

httpServer.listen(port, () => {
  MazaLogger.info(`[Server] Maza Studio Server running on port ${port}`);
  MazaLogger.info(`[Server] WebSocket Bridge ready at ws://localhost:${port}/ws`);

  // Start background workers (BullMQ)
  startWorkers();

  // Start Durable Scheduler & Alerting (DB Polling)
  if (supabaseAdmin) {
    Promise.all([
      import('./lib/schedulerService.js'),
      import('./lib/alertService.js'),
      import('./lib/maintenanceService.js')
    ]).then(([{ SchedulerService }, { AlertService }, { MaintenanceService }]) => {
      SchedulerService.start();
      AlertService.start();
      MaintenanceService.start();
    });
  } else {
    MazaLogger.warn('[Server] supabaseAdmin unavailable - Scheduler not started');
  }
});

