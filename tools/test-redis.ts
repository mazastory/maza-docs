import dotenv from 'dotenv';
import Redis from 'ioredis';

// Load .env
dotenv.config();

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

console.log("Loaded REDIS_URL:", REDIS_URL.replace(/:[^:@]+@/, ':***@')); // Hide password for security

const redis = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null,
  retryStrategy: (times) => {
    if (times > 3) {
      console.error("Failed to connect after 3 attempts.");
      process.exit(1);
    }
    return 1000;
  }
});

redis.on('connect', () => {
  console.log('✅ Successfully connected to Redis Cloud!');
  redis.quit();
});

redis.on('error', (err) => {
  console.error('❌ Redis Connection Error:', err.message);
});
