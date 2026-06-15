import { Worker, Job } from 'bullmq';
import { redisConnection } from '../lib/redis.js';
import { VerificationService } from '../lib/verificationService.js';
import { MazaLogger } from '../lib/logger.js';

/**
 * [VerificationWorker] 발행된 글의 URL이 실제로 접근 가능한지 확인
 */
export const verificationWorker = new Worker(
  'verify-post',
  async (job: Job) => {
    const { postId, scheduledId, publishedUrl } = job.data;
    MazaLogger.info(`[VerificationWorker] Verifying post ${postId}`, { postId, publishedUrl });

    try {
      const isSuccess = await VerificationService.verifyUrl(postId, publishedUrl);
      await VerificationService.handleResult(postId, scheduledId, isSuccess);
      
      return { success: isSuccess };
    } catch(error: unknown) {
      MazaLogger.error(`[VerificationWorker] ❌ Error in verification job ${job.id}`, error, { postId });
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
