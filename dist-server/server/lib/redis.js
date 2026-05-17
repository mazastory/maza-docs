import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();
const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
export const redisConnection = new Redis(REDIS_URL, {
    maxRetriesPerRequest: null, // BullMQ requirement
    retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
});
let policyChecked = false;
redisConnection.on('connect', async () => {
    console.log('[Redis] 🚀 Connected to Redis');
    if (!policyChecked) {
        policyChecked = true;
        try {
            const info = await redisConnection.info('memory');
            const match = info.match(/maxmemory_policy:(.+)/);
            const currentPolicy = match ? match[1].trim() : '';
            if (currentPolicy !== 'noeviction') {
                console.warn(`[Redis] ⚠️ Dangerous eviction policy: "${currentPolicy}". Please change to "noeviction" in your Redis Dashboard.`);
                // Attempt to fix once
                try {
                    await redisConnection.config('SET', 'maxmemory-policy', 'noeviction');
                    console.log('[Redis] ✅ Policy corrected.');
                }
                catch (configErr) {
                    // Silence further attempts if restricted
                    console.error('[Redis] 🛑 Auto-fix failed (Permission Denied). Please set "noeviction" manually in Redis Cloud.');
                }
            }
        }
        catch (err) {
            // Ignore errors in policy check
        }
    }
});
redisConnection.on('error', (err) => {
    console.error('[Redis] ❌ Connection error:', err);
});
export default redisConnection;
