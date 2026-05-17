
import { Queue } from 'bullmq';
import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

const redisConnection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null
});

async function clearQueues() {
  const queues = ['generate-post', 'image-process', 'validate-post', 'publish-post', 'verify-post'];
  
  for (const qName of queues) {
    const q = new Queue(qName, { connection: redisConnection });
    await q.drain();
    await q.clean(0, 1000, 'active');
    await q.clean(0, 1000, 'wait');
    await q.clean(0, 1000, 'delayed');
    await q.clean(0, 1000, 'failed');
    console.log(`[MAZA] Queue ${qName} cleared.`);
    await q.close();
  }
  
  process.exit(0);
}

clearQueues().catch(console.error);
