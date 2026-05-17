import { Queue } from 'bullmq';
import { redisConnection } from './redis.js';
// 큐 설정 (재시도 전략 등)
const defaultJobOptions = {
    attempts: 3,
    backoff: {
        type: 'exponential',
        delay: 5000, // 5초 대기 후 재시도
    },
    removeOnComplete: true,
    removeOnFail: false,
};
// 1. 글 생성 큐 (AI Writing)
export const generateQueue = new Queue('generate-post', {
    connection: redisConnection,
    defaultJobOptions,
});
// 2. 이미지 처리 큐 (Image optimization/upload)
export const imageQueue = new Queue('image-process', {
    connection: redisConnection,
    defaultJobOptions,
});
// 3. 검증 큐 (SEO/EEAT Validation)
export const validateQueue = new Queue('validate-post', {
    connection: redisConnection,
    defaultJobOptions,
});
// 4. 발행 큐 (Platform distribution)
export const publishQueue = new Queue('publish-post', {
    connection: redisConnection,
    defaultJobOptions,
});
// 6. 발행 결과 검증 큐 (URL Verification)
export const verificationQueue = new Queue('verify-post', {
    connection: redisConnection,
    defaultJobOptions,
});
console.log('[Queue] 📦 All queues initialized');
