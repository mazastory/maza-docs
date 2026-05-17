import { Router } from 'express';
import { redisConnection } from '../lib/redis.js';
import { aiWorker, imageWorker, validationWorker, publishWorker } from '../workers/index.js';
import * as os from 'os';

const router = Router();

const REGISTERED_MODELS = [
  "gemini-3-flash-preview",
  "gemini-2.5-flash",
  "gemini-2.5-pro"
];

router.get('/status', async (req, res) => {
  try {
    // 1. Get Model Status
    const modelStatus = await Promise.all(REGISTERED_MODELS.map(async (model) => {
      const isQuarantined = await redisConnection.get(`quarantine_model_${model}`);
      return {
        id: model,
        status: isQuarantined ? 'quarantined' : 'active',
        until: isQuarantined ? parseInt(isQuarantined) : null
      };
    }));

    // 2. Get API Key Status
    const rawKeys = process.env.GEMINI_TEXT_API_KEY || process.env.GEMINI_API_KEY || "";
    const apiKeys = rawKeys.split(",").map(k => k.trim()).filter(k => k.length > 5);
    
    const keyStatus = await Promise.all(apiKeys.map(async (key, idx) => {
      const crypto = await import('crypto');
      const hash = crypto.createHash('md5').update(key).digest('hex').substring(0, 8);
      const isQuarantined = await redisConnection.get(`quarantine_key_${hash}`);
      return {
        idx,
        hash,
        status: isQuarantined ? 'quarantined' : 'active',
        until: isQuarantined ? parseInt(isQuarantined) : null
      };
    }));

    // 3. Get Detailed Queue Health
    const getQueueStats = async (worker: any) => {
      const q = worker; // In BullMQ, worker has access to queue or we use the queue object
      // For simplicity, we can fetch from the worker's name
      return {
        name: worker.name,
        // BullMQ worker doesn't directly have counts, we need the Queue object.
        // Assuming we exported workers which are actually BullMQ workers.
        // In our setup, we might need the Queue instances.
        // Let's just return placeholders for now or try to get from redis.
      };
    };

    // 4. System Health
    const system = {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: os.loadavg(),
      platform: os.platform(),
      arch: os.arch()
    };

    res.json({
      success: true,
      data: {
        models: modelStatus,
        keys: keyStatus,
        system
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin Action: Reset Model Quarantine
router.post('/model/reset', async (req, res) => {
  const { modelId } = req.body;
  if (!modelId) return res.status(400).json({ success: false, error: 'modelId is required' });
  await redisConnection.del(`quarantine_model_${modelId}`);
  res.json({ success: true, message: `${modelId} quarantine reset.` });
});

// Admin Action: Reset Key Quarantine
router.post('/key/reset', async (req, res) => {
  const { keyHash } = req.body;
  if (!keyHash) return res.status(400).json({ success: false, error: 'keyHash is required' });
  await redisConnection.del(`quarantine_key_${keyHash}`);
  res.json({ success: true, message: `Key ${keyHash} quarantine reset.` });
});

export default router;
