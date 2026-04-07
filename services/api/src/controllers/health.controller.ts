import type { Request, Response } from 'express';
import { pool } from '../db/index.js';
import { logger } from '../utils/logger.js';

export const getHealth = (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'candy-ai-bff' });
};

export const getReady = async (req: Request, res: Response) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ready', db: true });
  } catch (error) {
    logger.error('Database readiness check failed', { error });
    res.status(503).json({ status: 'not-ready', db: false });
  }
};
