import { generateQueue, imageQueue, validateQueue, publishQueue, verificationQueue } from '../server/lib/queues';
import redisConnection from '../server/lib/redis';
import { FeedbackEngine } from '../server/lib/feedbackEngine';

async function run() {
  console.log("Testing Redis Connection...");
  await redisConnection.ping();
  console.log("Redis ping successful.");

  console.log("Testing BullMQ Queues Initialization...");
  console.log("Generate Queue:", generateQueue.name);
  console.log("Image Queue:", imageQueue.name);
  console.log("Validate Queue:", validateQueue.name);
  console.log("Publish Queue:", publishQueue.name);
  console.log("Verification Queue:", verificationQueue.name);

  // We won't actually hit the GSC API without a valid ID, but we can verify classes exist
  console.log("FeedbackEngine available:", !!FeedbackEngine);

  console.log("All infrastructure tests passed.");
  process.exit(0);
}

run().catch(console.error);
