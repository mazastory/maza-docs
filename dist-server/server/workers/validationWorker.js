import { Worker } from 'bullmq';
import { redisConnection } from '../lib/redis.js';
import { supabaseAdmin } from '../lib/supabaseServer.js';
import { RendererAgent } from '../lib/rendererAgent.js';
import { MazaLogger } from '../lib/logger.js';
import { calculateSEOScore } from '../lib/seoEngine.js';
import { validateContent, ValidatorV2 } from '../lib/validator.js';
import { AuthorityEngine } from '../lib/authorityEngine.js';
import { publishQueue } from '../lib/queues.js';
import { PostStatus } from '../lib/postStatus.js';
/**
 * [ValidationWorker] 렌더링 및 SEO 검증 처리반
 */
export const validationWorker = new Worker('validate-post', async (job) => {
    const { postId, keyword, userId, scheduledId } = job.data;
    MazaLogger.info(`[ValidationWorker] Processing job ${job.id} for post: ${postId}`, { postId, userId, keyword, jobId: job.id, scheduledId });
    // [Stability-First] Don't rush, give the API some breathing room
    await new Promise(resolve => setTimeout(resolve, 2000));
    if (!supabaseAdmin)
        throw new Error('Supabase Admin not initialized');
    // 0. Emergency Stop Check
    if (scheduledId) {
        const { data: currentTask } = await supabaseAdmin
            .from('ms_scheduled_posts')
            .select('status')
            .eq('id', scheduledId)
            .maybeSingle();
        if (!currentTask || currentTask.status === 'FAILED' || currentTask.status === 'CANCELLED') {
            MazaLogger.warn(`[ValidationWorker] 🛑 Emergency Stop: Task ${scheduledId} is missing or ${currentTask?.status}. Aborting.`);
            return { success: false, reason: 'stopped' };
        }
    }
    try {
        // 1. 포스트 데이터 및 사이트 설정 조회
        const { data: post, error: postError } = await supabaseAdmin
            .from('ms_posts')
            .select('*, ms_sites(*)')
            .eq('id', postId)
            .single();
        if (postError || !post)
            throw new Error(`Post ${postId} not found`);
        const site = post.ms_sites;
        const data = post.metadata?.data;
        if (!data)
            throw new Error('Post metadata missing data');
        // 1.5. 상태 업데이트 (validating)
        if (scheduledId) {
            await supabaseAdmin.from('ms_scheduled_posts').update({ status: 'pending' }).eq('id', scheduledId);
        }
        // 1.7. 내부 링크 분석 및 추천 (Authority Engine)
        const internalLinks = await AuthorityEngine.getInternalLinkSuggestions(userId, postId, keyword);
        MazaLogger.info(`[ValidationWorker] Found ${internalLinks.length} internal link suggestions`, { postId, count: internalLinks.length });
        // 2. 렌더링 (RendererAgent)
        const renderResult = RendererAgent.renderPost(data, {
            topic: keyword,
            adsenseStatus: site?.adsense_status || 'pending',
            adsensePub: site?.adsense_pub || '',
            coupangId: site?.metadata?.coupang_id || '',
            coupangTracking: site?.metadata?.coupang_tracking_code || '',
            internalLinks: internalLinks // 🔥 추천 링크 주입
        });
        // 3. SEO 점수 및 검증
        const seoScore = calculateSEOScore(renderResult.html, keyword);
        // 마크다운 본문 생성 (엔진 로직 참조)
        const fullMarkdown = `# ${data.title}\n\n${data.intro}\n\n![${keyword}](${data.image1})\n\n${data.content1}\n\n> 💡 **전문가 팁**\n> ${data.insightBox}\n\n![${keyword} 상세](${data.image2})\n\n## 실전 가이드\n\n${data.content2}\n\n![${keyword} 결론](${data.image3})\n\n${data.outro}`;
        const validation = validateContent(fullMarkdown, keyword);
        // 3.5. [NEW] Validation Engine v2 (AdSense Approval Engine)
        const validationV2 = await ValidatorV2.validate(fullMarkdown, keyword, userId);
        // 4. DB 최종 업데이트
        const { error: updateError } = await supabaseAdmin
            .from('ms_posts')
            .update({
            content: fullMarkdown,
            html_content: renderResult.html,
            status: PostStatus.DRAFT, // DB 제약 조건 준수
            word_count: fullMarkdown.replace(/\s+/g, '').length,
            seo_score: Math.round(validationV2.overallScore), // [FIX] INTEGER 타입에 맞춰 정수로 변환 (0~100)
            metadata: {
                ...post.metadata,
                engine_status: PostStatus.READY_TO_PUBLISH, // 실제 상태는 메타데이터에
                blocks: renderResult.blocks,
                validation_score: validation.score,
                validation_v2: validationV2,
                internal_link_suggestions: internalLinks,
                outgoing_links: internalLinks.map((l) => l.post_id || l.url)
            }
        })
            .eq('id', postId);
        if (updateError)
            throw updateError;
        console.log(`[ValidationWorker] ✅ Validation complete for ${postId}. Score: ${seoScore}`);
        // 5. 스케줄된 포스트인지 확인 후 발행 큐로 넘김 (옵션)
        const { data: scheduled } = await supabaseAdmin
            .from('ms_scheduled_posts')
            .select('id')
            .eq('post_id', postId)
            .eq('status', 'pending')
            .maybeSingle();
        if (scheduled) {
            const nextStatus = site?.platform === 'tistory' ? PostStatus.READY_TO_PUBLISH : PostStatus.PUBLISHING;
            MazaLogger.info(`[ValidationWorker] Post ${postId} is scheduled. Moving to ${nextStatus}...`, { postId, scheduledId: scheduled.id, nextStatus });
            await supabaseAdmin.from('ms_scheduled_posts').update({
                status: 'pending' // DB 제약 조건 준수
            }).eq('id', scheduled.id);
            await publishQueue.add('publish-post', {
                postId: postId,
                scheduledId: scheduled.id,
                userId: userId
            });
        }
        return { success: true, score: validationV2.overallScore };
    }
    catch (error) {
        MazaLogger.error(`[ValidationWorker] ❌ Error in job ${job.id}`, error, { postId, userId, jobId: job.id });
        throw error;
    }
}, {
    connection: redisConnection,
    lockDuration: 30000,
    stalledInterval: 30000,
    maxStalledCount: 2
});
