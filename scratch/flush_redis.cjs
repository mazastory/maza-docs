const Redis = require('ioredis');
const dotenv = require('dotenv');
const path = require('path');

// Load .env from project root
dotenv.config({ path: path.join(__dirname, '../.env') });

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

console.log(`Connecting to Redis at: ${REDIS_URL}`);
const redis = new Redis(REDIS_URL);

redis.on('connect', async () => {
  console.log('Connected! Flushing all data...');
  try {
    await redis.flushall();
    console.log('✅ Success: Redis flushed completely.');
  } catch (err) {
    console.error('❌ Error flushing Redis:', err);
  } finally {
    redis.quit();
    process.exit(0);
  }
});

redis.on('error', (err) => {
  console.error('Connection error:', err);
  process.exit(1);
});
