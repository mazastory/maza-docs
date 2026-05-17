import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { errorHandler } from '../middleware/errorHandler.js';
import { validate } from '../middleware/validate.js';
import { z } from 'zod';

describe('API Infrastructure Tests', () => {
  const app = express();
  app.use(express.json());

  // Test Route for Validation
  const testSchema = z.object({
    body: z.object({
      name: z.string().min(3)
    })
  });

  app.post('/test-validate', validate(testSchema), (req, res) => {
    res.json({ success: true });
  });

  // Test Route for Error Handling
  app.get('/test-error', (req, res) => {
    throw new Error('Test Exception');
  });

  app.use(errorHandler);

  it('should return 400 for invalid input', async () => {
    const response = await request(app)
      .post('/test-validate')
      .send({ name: 'ab' }); // Too short
    
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.details).toBeDefined();
  });

  it('should return 200 for valid input', async () => {
    const response = await request(app)
      .post('/test-validate')
      .send({ name: 'MazaStudio' });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('should handle unhandled exceptions globally', async () => {
    const response = await request(app).get('/test-error');
    
    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('Test Exception');
  });
});
