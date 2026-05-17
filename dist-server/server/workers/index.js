import { aiWorker } from './aiWorker.js';
import { imageWorker } from './imageWorker.js';
import { validationWorker } from './validationWorker.js';
import { publishWorker } from './publishWorker.js';
/**
 * [Workers] MazaStudio Autopilot OS Workers
 */
export const startWorkers = () => {
    console.log('[Workers] 🛠️ Starting all background workers...');
    // 개별 워커 이벤트 리스너 등록 (옵션)
    [aiWorker, imageWorker, validationWorker, publishWorker].forEach(worker => {
        worker.on('failed', (job, err) => {
            console.error(`[Worker:${worker.name}] Job ${job?.id} failed:`, err.message);
        });
        worker.on('error', err => {
            console.error(`[Worker:${worker.name}] Global error:`, err);
        });
    });
    console.log('[Workers] ✅ All workers are active and listening to queues.');
};
/**
 * [Workers] Gracefully stop all workers
 */
export const stopWorkers = async () => {
    console.log('[Workers] 🛑 Stopping all workers...');
    await Promise.all([
        aiWorker.close(),
        imageWorker.close(),
        validationWorker.close(),
        publishWorker.close()
    ]);
    console.log('[Workers] 💤 All workers stopped.');
};
export { aiWorker, imageWorker, validationWorker, publishWorker };
