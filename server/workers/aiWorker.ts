import { Worker, Job } from 'bullmq';
import { redisConnection } from '../lib/redis.js';
import { callAI } from '../lib/aiClient.js';
import { parseJSON } from '../lib/parser.js';
import { buildGeneratePrompt } from '../routes/generate.js';
import { supabaseAdmin } from '../lib/supabaseServer.js';
import { imageQueue } from '../lib/queues.js';
import { MazaLogger } from '../lib/logger.js';
import { FeedbackEngine } from '../lib/feedbackEngine.js';
import { ObservabilityService } from '../lib/observabilityService.js';
import { StabilizerEngine } from '../lib/stabilizerEngine.js';
import { PostStatus } from '../lib/postStatus.js';
import { SeriesManager } from '../lib/seriesManager.js';
import { RendererAgent } from '../lib/rendererAgent.js';
import { calculateSEOScore } from '../lib/seoEngine.js';

/**
 * [AIWorker] 글 본문 생성 처리반
 */
export const aiWorker = new Worker(
  'generate-post',
  async (job: Job) => {
    const startTime = Date.now();
    const { userId, siteId, keyword, scheduledId, postId } = job.data;
    MazaLogger.info(`[AIWorker] Processing job ${job.id} for keyword: ${keyword}`, { userId, siteId, keyword, jobId: job.id, scheduledId });

    if (!supabaseAdmin) throw new Error('Supabase Admin not initialized');

    // 0. Emergency Stop Check (Section 20-3)
    if (scheduledId) {
      const { data: currentTask } = await supabaseAdmin
        .from('ms_scheduled_posts')
        .select('status')
        .eq('id', scheduledId)
        .single();
      
      if (currentTask?.status === 'FAILED' || currentTask?.status === 'CANCELLED') {
        MazaLogger.warn(`[AIWorker] 🛑 Emergency Stop: Task ${scheduledId} is ${currentTask.status}. Aborting.`);
        return { success: false, reason: 'stopped' };
      }
    }

    if (!keyword) {
      // [FIX] 만약 keyword가 null이면 metadata에서 복구 시도
      const { data: retryTask } = await supabaseAdmin
        .from('ms_scheduled_posts')
        .select('keyword, metadata')
        .eq('id', scheduledId)
        .single();
      
      const recoveredKeyword = retryTask?.keyword || retryTask?.metadata?.keyword;
      
      if (!recoveredKeyword) {
        MazaLogger.error(`[AIWorker] ❌ Missing keyword for job ${job.id}. Aborting.`);
        return { success: false, reason: 'missing_keyword' };
      }
      
      // 복구된 키워드로 계속 진행
      job.data.keyword = recoveredKeyword;
      MazaLogger.info(`[AIWorker] 🔄 Recovered keyword: ${recoveredKeyword}`);
    }

    // 0. 안정성 체크 (Site Isolation & Rate Limit)
    const [isSiteActive, isUsageOk] = await Promise.all([
      StabilizerEngine.isSiteActive(siteId),
      StabilizerEngine.checkUsage(userId, 'ai_api')
    ]);

    if (!isSiteActive) {
      MazaLogger.warn(`[AIWorker] Skipping job ${job.id}: Site ${siteId} is quarantined.`, { siteId });
      return { success: false, reason: 'quarantined' };
    }

    if (!isUsageOk) {
      MazaLogger.warn(`[AIWorker] Skipping job ${job.id}: User ${userId} exceeded AI limit.`, { userId });
      throw new Error('AI API daily limit exceeded');
    }

    try {
      // 0. 전략 컨텍스트 가져오기 (Winning Patterns)
      const strategy = await FeedbackEngine.getStrategyContext(userId);
      
      // 0.5. 시리즈 맥락 가져오기 (Section 20-2)
      let seriesContext = '';
      let clusterId = null;
      let seriesOrder = 1;

      if (scheduledId) {
        const { data: schedPost } = await supabaseAdmin
          .from('ms_scheduled_posts')
          .select('*')
          .eq('id', scheduledId)
          .single();
        
        clusterId = schedPost?.metadata?.cluster_id;
        seriesOrder = schedPost?.metadata?.series_order || 1;

        if (clusterId) {
          seriesContext = await SeriesManager.generateNextPostInSeries(clusterId, seriesOrder);
          MazaLogger.info(`[AIWorker] Injecting series context for order: ${seriesOrder}`, { scheduledId, clusterId });
        }
      }

      // 1. AI 생성 프롬프트 빌드 및 호출
      const basePrompt = buildGeneratePrompt(keyword, strategy);
      const finalPrompt = `
        ${seriesContext ? seriesContext : ''}
        
        [필수 추가 요청]
        본문을 작성한 후, 마지막에 반드시 다음 포스트 작성자가 참고할 수 있는 
        이 포스트의 핵심 요약(Key Takeaways)을 'key_takeaways'라는 필드에 포함하여 JSON으로 출력하세요.
        이 요약에는 이번 포스트에서 다룬 주요 주장과 다음 포스트로 이어질 연결 고리가 포함되어야 합니다.

        ${basePrompt}
      `;
      
      const raw = await callAI(finalPrompt, { jsonMode: true, jobId: job.id });
      const data = typeof raw === 'string' ? parseJSON(raw) : raw;

      if (!data || !data.title) {
        throw new Error('AI failed to generate valid content');
      }

      // 2. 드래프트 DB 업데이트 또는 저장
      const postTitle = data.title;
      const keyTakeaways = data.key_takeaways || ""; 
      const contentSummary = (data.intro || "").substring(0, 100);
      const publishHash = Buffer.from(`${siteId}_${postTitle}_${contentSummary}`).toString('base64');

      // 시리즈 메타데이터 구성 (네비게이션용)
      let seriesMetadata = null;
      if (clusterId) {
        const { data: clusterData } = await supabaseAdmin
          .from('ms_topic_clusters')
          .select('title')
          .eq('id', clusterId)
          .single();
        
        const { data: siblingPosts } = await supabaseAdmin
          .from('ms_posts')
          .select('title, metadata')
          .eq('cluster_id', clusterId);

        seriesMetadata = {
          title: clusterData?.title || "관련 시리즈",
          posts: siblingPosts?.map((p: any) => ({
            title: p.title,
            url: p.metadata?.published_url || null,
            current: p.title === postTitle
          })) || []
        };
      }

      // 2. 데이터 구조화 및 HTML 렌더링 (Section 13-1 준수)
      const uiBlocks: any[] = [
        { type: "intro", text: data.intro },
        { type: "heading", text: `${keyword}의 핵심 원리와 이해`, level: 2 },
        { type: "paragraph", text: data.content1 || "" }
      ];

      if (data.insightBox) uiBlocks.push({ type: "insight", text: data.insightBox });
      if (data.comparisonData) {
        uiBlocks.push({ type: "heading", text: data.comparisonData.title || "비교 분석", level: 2 });
        uiBlocks.push({ type: "table", headers: data.comparisonData.headers, rows: data.comparisonData.rows });
      }
      if (data.summary) uiBlocks.push({ type: "summary_box", text: data.summary });
      if (data.content2) {
        uiBlocks.push({ type: "heading", text: "실전 적용 방법 및 주의사항", level: 2 });
        uiBlocks.push({ type: "paragraph", text: data.content2 });
      }
      if (data.experienceNote) uiBlocks.push({ type: "experience", text: data.experienceNote });
      if (data.detailedFaqs) uiBlocks.push({ type: "faq", items: data.detailedFaqs });
      if (data.outro) uiBlocks.push({ type: "conclusion", text: data.outro });
      if (data.hashtags) uiBlocks.push({ type: "hashtags", items: data.hashtags });

      // 사이트 정보 가져오기 (AdSense 연동용)
      const { data: site } = await supabaseAdmin.from('ms_sites').select('*').eq('id', siteId).single();
      
      const renderResult = RendererAgent.renderPost(data, {
        topic: keyword,
        adsenseStatus: site?.adsense_status,
        adsensePub: site?.adsense_pub
      });

      const postData = {
        title: postTitle,
        content: data.intro + "\n" + (data.content1 || ""),
        html_content: renderResult.html,
        word_count: renderResult.html.replace(/\s+/g, '').length,
        seo_score: calculateSEOScore(renderResult.html, keyword),
        status: PostStatus.DRAFT,
        metadata: { 
          data,
          blocks: uiBlocks,
          series: seriesMetadata,
          key_takeaways: keyTakeaways,
          series_order: seriesOrder,
          publish_hash: publishHash,
          engine_status: PostStatus.IMAGE_PROCESSING 
        }
      };

      let finalPostId = postId;

      if (postId) {
        // 이미 생성된 DRAFT 포스트 업데이트
        const { error: updateError } = await supabaseAdmin
          .from('ms_posts')
          .update(postData)
          .eq('id', postId);
        if (updateError) throw updateError;
      } else {
        // 신규 포스트 생성
        const { data: newPost, error: insertError } = await supabaseAdmin
          .from('ms_posts')
          .insert({
            user_id: userId,
            site_id: siteId,
            cluster_id: clusterId,
            ...postData
          })
          .select()
          .single();
        if (insertError) throw insertError;
        finalPostId = newPost.id;
      }

      // 2.5. 스케줄된 포스트 상태 업데이트
      if (scheduledId) {
        await supabaseAdmin.from('ms_scheduled_posts').update({
          post_id: finalPostId,
          status: 'pending'
        }).eq('id', scheduledId);
      }

      MazaLogger.info(`[AIWorker] ✅ Post processed: ${finalPostId}`, { postId: finalPostId, userId, keyword });

      // 3. 이미지 처리 큐로 넘김
      await imageQueue.add('process-image', {
        postId: finalPostId,
        scheduledId: scheduledId,
        keyword: keyword,
        title: postTitle, // Pass title for better image matching
        userId: userId
      });

      await ObservabilityService.recordMetric('ai', job.id!, 'success', startTime);
      return { success: true, postId: finalPostId };
    } catch(error: unknown) {
      await ObservabilityService.recordMetric('ai', job.id!, 'failed', startTime, error.message);
      MazaLogger.error(`[AIWorker] ❌ Error in job ${job.id}`, error, { userId, keyword, jobId: job.id });
      
      if (supabaseAdmin) {
        await supabaseAdmin.from('ms_events').insert([{
          user_id: userId,
          event_type: 'generate_failed',
          status: 'failed',
          metadata: { error: error.message, keyword, job_id: job.id }
        }]);

        await StabilizerEngine.reportFailure(siteId, error.message);
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

aiWorker.on('completed', (job) => {
  console.log(`[AIWorker] 🎊 Job ${job.id} completed!`);
});

aiWorker.on('failed', (job, err) => {
  console.error(`[AIWorker] 💀 Job ${job?.id} failed:`, err.message);
});
