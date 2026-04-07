import type { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import { config } from '../config/index.js';

export class AppError extends Error {
  constructor(public statusCode: number, public message: string) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled error:', { message: err.message, stack: err.stack, path: req.path });
  
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  const status = err.status || err.statusCode || 500;
  res.status(status).json({ error: config.nodeEnv === 'production' ? 'Internal server error' : err.message });
};
