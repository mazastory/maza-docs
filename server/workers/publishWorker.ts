import { Worker, Job } from 'bullmq';
import { redisConnection } from '../lib/redis.js';
import { supabaseAdmin } from '../lib/supabaseServer.js';
import { WordPressAPI } from '../lib/platforms/wordpress.js';
import { BloggerAPI } from '../lib/platforms/blogger.js';
import { MazaLogger } from '../lib/logger.js';
import { StabilizerEngine } from '../lib/stabilizerEngine.js';
import { ObservabilityService } from '../lib/observabilityService.js';
import { PostStatus, FAILURE_POLICY } from '../lib/postStatus.js';
import { VerificationAgent } from '../lib/verificationAgent.js';
import { SERVER_EVENTS } from '../shared/protocol.js';
import { sendToUser } from '../lib/websocketServer.js';

import { GoogleIndexingService } from '../lib/googleIndexing.js';

/**
 * [PublishWorker] 플랫폼별 발행 처리반
 * AGENTS.md: W-05 Safety Protocol (3시간 간격 강제)
 */
export const publishWorker = new Worker(
  'publish-post',
  async (job: Job) => {
    const startTime = Date.now();
    const { postId, scheduledId, userId } = job.data;
    MazaLogger.info(`[PublishWorker] Processing job ${job.id} for post: ${postId}`, { postId, userId, jobId: job.id, scheduledId });

    if (!supabaseAdmin) throw new Error('Supabase Admin not initialized');

    // 0. 안정성 체크
    const isSiteActive = await StabilizerEngine.isSiteActive(job.data.siteId || '');
    if (!isSiteActive) {
      MazaLogger.warn(`[PublishWorker] Skipping job ${job.id}: Site is quarantined.`);
      return { success: false, reason: 'quarantined' };
    }

    try {
      // 1. 포스트 및 사이트 정보 조회
      const { data: post, error: postError } = await supabaseAdmin
        .from('ms_posts')
        .select('*, ms_sites(*)')
        .eq('id', postId)
        .single();

      if (postError || !post) throw new Error(`Post ${postId} not found`);

      const site = post.ms_sites;
      if (!site) throw new Error('Site info missing for publication');

      // 1.5. Idempotency(멱등성) 체크
      const publishHash = post.metadata?.publish_hash;
      if (publishHash && scheduledId) {
        const { data: duplicate } = await supabaseAdmin
          .from('ms_scheduled_posts')
          .select('id')
          .eq('publish_hash', publishHash)
          .eq('status', 'success')
          .neq('id', scheduledId)
          .maybeSingle();

        if (duplicate) {
          console.log(`[PublishWorker] 🛡️ Idempotency: Duplicate post detected for hash ${publishHash}. Skipping.`);
          await supabaseAdmin.from('ms_scheduled_posts').update({ status: 'success', last_error: 'Idempotency: Duplicate skip' }).eq('id', scheduledId);
          return { success: true, duplicate: true };
        }
      }

      // 2. W-05 Safety Protocol 체크 (3시간)
      const { data: recentPost } = await supabaseAdmin
        .from('ms_scheduled_posts')
        .select('publish_at')
        .eq('user_id', userId)
        .eq('status', 'success')
        .order('publish_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (recentPost) {
        const lastPublished = new Date(recentPost.publish_at);
        const diffSeconds = (Date.now() - lastPublished.getTime()) / 1000;
        if (diffSeconds < 10800) { // 3시간 = 10800초
          const waitSeconds = Math.ceil(10800 - diffSeconds);
          const waitMinutes = Math.ceil(waitSeconds / 60);
          
          MazaLogger.warn(`[PublishWorker] 🛡️ W-05 Safety Violation: Auto-rescheduling job ${job.id}`, { userId, lastPublished, waitMinutes });
          
          // BullMQ Job을 지연시켜 다시 큐에 넣음 (Self-Healing)
          // 참고: 큐 인스턴스를 통해 다시 넣는 것이 안정적임
          const { publishQueue } = await import('../lib/queues.js');
          await publishQueue.add('publish-post', job.data, { 
            delay: waitSeconds * 1000, 
            jobId: `w05-retry-${postId}-${Date.now()}` // 중복 방지 ID
          });

          // 현재 Job은 성공으로 처리하고 로그만 남김 (이미 다음 Job이 생성됨)
          await supabaseAdmin.from('ms_scheduled_posts').update({ 
            status: 'pending', 
            last_error: `W-05 Safety: Rescheduled to +${waitMinutes}m` 
          }).eq('id', scheduledId);

          return { success: true, rescheduled: true, waitMinutes };
        }
      }

      // 3. 플랫폼별 발행 로직
      if (site.platform === 'wordpress') {
        const { wp_username, wp_app_password } = site.metadata || {};
        if (!wp_username || !wp_app_password) {
          throw new Error('WordPress credentials missing in site metadata');
        }

        MazaLogger.info(`[PublishWorker] Publishing to WordPress: ${site.domain}`, { postId, domain: site.domain });
        const result = await WordPressAPI.post(site.domain, wp_username, wp_app_password, {
          title: post.title,
          content: post.html_content || post.content,
          status: 'publish'
        });

        if (!result.success) throw new Error(result.error || 'WordPress API Error');

        // [A-3] RULE-03: Verification 실패 시 PUBLISHED 처리 금지
        if (scheduledId) {
           await supabaseAdmin.from('ms_scheduled_posts').update({ status: PostStatus.VERIFYING }).eq('id', scheduledId);
        }
        await supabaseAdmin.from('ms_posts').update({ status: PostStatus.VERIFYING }).eq('id', postId);

        // [A-3] 창발 직후 검증 (blocking - 실패 시 PUBLISHED 전환 금지)
        const verification = await VerificationAgent.verifyPost(result.wp_post_url ?? '', post.title);
        if (verification.success) {
          await updateStatusSuccess(postId, scheduledId, result.wp_post_url);
          MazaLogger.info(`[PublishWorker] ✅ Verified & Published: ${result.wp_post_url}`, { postId });
        } else {
          MazaLogger.warn(`[PublishWorker] ⚠️ Published but VERIFICATION FAILED`, { postId, reason: verification.reason });
          await supabaseAdmin.from('ms_posts').update({
            status: PostStatus.FAILED_VERIFICATION,
            metadata: { verification, published_url: result.wp_post_url }
          }).eq('id', postId);
          if (scheduledId) {
            await supabaseAdmin.from('ms_scheduled_posts').update({
              status: PostStatus.FAILED,
              last_error: `Verification Failed: ${verification.reason}`
            }).eq('id', scheduledId);
          }
        }

      } else if (site.platform === 'tistory') {
        // 티스토리 발행 제한 체크
        const isUsageOk = await StabilizerEngine.checkUsage(userId, 'tistory_publish');
        if (!isUsageOk) throw new Error('Tistory daily publish limit reached');

        // 1. 최신 셀렉터 정보 가져오기 (에디터 변경 대응)
        const { data: selectorData } = await supabaseAdmin
          .from('ms_selectors')
          .select('selectors')
          .eq('platform', 'tistory')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        MazaLogger.info(`[PublishWorker] Tistory post ${postId} is ready for Extension injection.`, { postId, userId });
        
        // 2. WebSocket을 통해 익스텐션에 발행 명령 전달 (Real-time Push)
        const sent = sendToUser(userId, {
          type: SERVER_EVENTS.RUN_ACTION,
          action: 'PUBLISH_POST',
          jobId: job.id,
          data: {
            postId,
            url: `https://${site.domain}/manage/post/write`,
            title: post.title,
            html: post.html_content || post.content,
            selectors: selectorData?.selectors
          }
        });

        if (sent > 0) {
          MazaLogger.info(`[PublishWorker] 🚀 Sent PUBLISH_POST command to user's extension via WebSocket.`, { userId, postId });
        } else {
          MazaLogger.warn(`[PublishWorker] ⚠️ User extension not connected. Post is waiting in 'ready_to_publish' state.`, { userId, postId });
        }

        if (scheduledId) {
          await supabaseAdmin
            .from('ms_scheduled_posts')
            .update({ 
              status: 'waiting_publish',
              metadata: { 
                ...job.data.metadata,
                selectors: selectorData?.selectors,
                safety_check: true,
                retry_on_login_fail: true
              }
            })
            .eq('id', scheduledId);
        }

        await supabaseAdmin
          .from('ms_posts')
          .update({ status: 'ready_to_publish' })
          .eq('id', postId);
      } else if (site.platform === 'blogspot') {
        const { blogger_access_token, blogger_blog_id } = site.metadata || {};
        if (!blogger_access_token || !blogger_blog_id) {
          throw new Error('Blogger credentials or Blog ID missing in site metadata');
        }

        MazaLogger.info(`[PublishWorker] Publishing to Blogspot: ${site.domain}`, { postId, domain: site.domain });
        const result = await BloggerAPI.post(blogger_blog_id, blogger_access_token, {
          title: post.title,
          content: post.html_content || post.content,
          isDraft: false,
          labels: post.category ? post.category.split(',').map((c:string) => c.trim()) : []
        });

        if (!result.success) throw new Error(result.error || 'Blogger API Error');

        if (scheduledId) {
           await supabaseAdmin.from('ms_scheduled_posts').update({ status: PostStatus.VERIFYING }).eq('id', scheduledId);
        }
        await supabaseAdmin.from('ms_posts').update({ status: PostStatus.VERIFYING }).eq('id', postId);

        const verification = await VerificationAgent.verifyPost(result.post_url ?? '', post.title);
        if (verification.success) {
          await updateStatusSuccess(postId, scheduledId, result.post_url);
          MazaLogger.info(`[PublishWorker] ✅ Verified & Published to Blogspot: ${result.post_url}`, { postId });
        } else {
          MazaLogger.warn(`[PublishWorker] ⚠️ Published but VERIFICATION FAILED`, { postId, reason: verification.reason });
          await supabaseAdmin.from('ms_posts').update({
            status: PostStatus.FAILED_VERIFICATION,
            metadata: { verification, published_url: result.post_url }
          }).eq('id', postId);
          if (scheduledId) {
            await supabaseAdmin.from('ms_scheduled_posts').update({
              status: PostStatus.FAILED,
              last_error: `Verification Failed: ${verification.reason}`
            }).eq('id', scheduledId);
          }
        }
      }

      await ObservabilityService.recordMetric('publish', job.id!, 'success', startTime);
      return { success: true };
    } catch(error: unknown) {
      await ObservabilityService.recordMetric('publish', job.id!, 'failed', startTime, error.message);
      MazaLogger.error(`[PublishWorker] ❌ Error in job ${job.id}`, error, { postId, userId, jobId: job.id });
      
      // 사이트 장애 보고 (Isolation)
      if (job.data.siteId) {
        await StabilizerEngine.reportFailure(job.data.siteId, error.message);
      }
      
      // 재시도 정보를 DB에 기록 (Retry Persistence)
      if (scheduledId && supabaseAdmin) {
        await supabaseAdmin
          .from('ms_scheduled_posts')
          .update({
            status: PostStatus.FAILED,  // RULE-02
            last_error: error.message,
            retry_count: (job.attemptsMade || 0) + 1,
            failure_reason: error.message.includes('W-05') ? 'safety_guard' : 'api_error'
          })
          .eq('id', scheduledId);
      }
      
      throw error;
    }
  },
  { 
    connection: redisConnection,
    lockDuration: 30000,
    stalledInterval: 30000,
    maxStalledCount: 2
  }
);

async function updateStatusSuccess(postId: string, scheduledId: string, url?: string) {
  if (!supabaseAdmin) return;
  
  await supabaseAdmin
    .from('ms_posts')
    .update({ status: PostStatus.PUBLISHED, published_url: url, updated_at: new Date().toISOString() })
    .eq('id', postId);

  if (scheduledId) {
    await supabaseAdmin
      .from('ms_scheduled_posts')
      .update({ status: 'success' })
      .eq('id', scheduledId);
  }

  // [Phase 3] Auto-Indexing 요청
  if (url) {
    MazaLogger.info(`[PublishWorker] ⚡ Triggering Phase 3 Auto-Index for: ${url}`);
    await GoogleIndexingService.requestIndexing(url);
  }
}
