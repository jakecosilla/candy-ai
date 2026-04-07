import { jest, describe, it, expect } from '@jest/globals';
import { errorMiddleware, AppError } from '../middlewares/error.middleware.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import { z } from 'zod';

describe('Middlewares', () => {
  describe('errorMiddleware', () => {
    it('should format AppError correctly', () => {
      const err = new AppError(404, 'Not found');
      const req = { path: '/test' } as any;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
      const next = jest.fn();

      errorMiddleware(err, req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Not found' });
    });
  });

  describe('validateRequest', () => {
    it('should trigger next if strictly valid', async () => {
      const schema = z.object({ body: z.object({ name: z.string() }) });
      const req = { body: { name: 'test' }, query: {}, params: {} } as any;
      const res = {} as any;
      const next = jest.fn();

      const middleware = validateRequest(schema as any);
      await middleware(req, res, next);
      expect(next).toHaveBeenCalledWith();
    });

    it('should return 400 on invalid body', async () => {
      const schema = z.object({ body: z.object({ name: z.string() }) });
      const req = { body: {}, query: {}, params: {} } as any;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
      const next = jest.fn();

      const middleware = validateRequest(schema as any);
      await middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
    });
  });
});
