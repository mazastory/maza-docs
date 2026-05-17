import { Worker } from 'bullmq';
import { redisConnection } from '../lib/redis.js';
import { getOptimizedImage } from '../lib/imageService.js';
import { supabaseAdmin } from '../lib/supabaseServer.js';
import { validateQueue } from '../lib/queues.js';
import { MazaLogger } from '../lib/logger.js';
import { PostStatus } from '../lib/postStatus.js';
/**
 * [ImageWorker] 이미지 검색 및 매칭 처리반
 */
export const imageWorker = new Worker('image-process', async (job) => {
    const { postId, keyword, userId, scheduledId, title } = job.data;
    MazaLogger.info(`[ImageWorker] Processing job ${job.id} for post: ${postId}`, { postId, userId, keyword, jobId: job.id, scheduledId });
    if (!supabaseAdmin)
        throw new Error('Supabase Admin not initialized');
    // 0. Emergency Stop Check
    if (scheduledId) {
        const { data: currentTask } = await supabaseAdmin
            .from('ms_scheduled_posts')
            .select('status')
            .eq('id', scheduledId)
            .single();
        if (currentTask?.status === 'FAILED' || currentTask?.status === 'CANCELLED') {
            MazaLogger.warn(`[ImageWorker] 🛑 Emergency Stop: Task ${scheduledId} is ${currentTask.status}. Aborting.`);
            return { success: false, reason: 'stopped' };
        }
    }
    // [Stability-First] Don't rush, give the API some breathing room
    await new Promise(resolve => setTimeout(resolve, 2000));
    if (!supabaseAdmin)
        throw new Error('Supabase Admin not initialized');
    try {
        // 1. 이미지 3장 최적화 검색 (Pass title to get more specific results)
        const [img1, img2, img3] = await Promise.all([
            getOptimizedImage(keyword, title),
            getOptimizedImage(`${keyword} detail`, title),
            getOptimizedImage(`${keyword} view`, title)
        ]);
        // 2. DB 업데이트 (메타데이터에 이미지 추가)
        const { data: post, error: fetchError } = await supabaseAdmin
            .from('ms_posts')
            .select('metadata')
            .eq('id', postId)
            .single();
        if (fetchError)
            throw fetchError;
        const updatedMetadata = {
            ...(post.metadata || {}),
            engine_status: PostStatus.IMAGE_PROCESSING, // 이미지 처리 중임을 명시
            data: {
                ...(post.metadata?.data || {}),
                image1: img1,
                image2: img2,
                image3: img3
            }
        };
        const { error: updateError } = await supabaseAdmin
            .from('ms_posts')
            .update({ metadata: updatedMetadata })
            .eq('id', postId);
        if (updateError)
            throw updateError;
        MazaLogger.info(`[ImageWorker] ✅ Images updated for ${postId}`, { postId, userId });
        // 3. 검증 큐로 넘김
        await validateQueue.add('validate-post', {
            postId: postId,
            scheduledId: scheduledId,
            keyword: keyword,
            userId: userId
        });
        return { success: true, images: [img1, img2, img3] };
    }
    catch (error) {
        MazaLogger.error(`[ImageWorker] ❌ Error in job ${job.id}`, error, { postId, userId, jobId: job.id });
        throw error;
    }
}, {
    connection: redisConnection,
    lockDuration: 30000,
    stalledInterval: 30000,
    maxStalledCount: 2
});
