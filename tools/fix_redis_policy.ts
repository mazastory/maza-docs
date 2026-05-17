import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

const REDIS_URL = process.env.REDIS_URL;
if (!REDIS_URL) {
  console.error('REDIS_URL not found');
  process.exit(1);
}

const redis = new Redis(REDIS_URL);

async function check() {
  try {
    const info = await redis.info('memory');
    const match = info.match(/maxmemory_policy:(.+)/);
    if (match) {
      console.log('Current maxmemory_policy:', match[1].trim());
    } else {
      console.log('Could not find maxmemory_policy in INFO memory');
    }
  } catch (err) {
    console.error('Failed to get info:', err.message);
  } finally {
    process.exit(0);
  }
}

check();
