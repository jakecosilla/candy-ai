import type { Request, Response } from 'express';
import { temporalService } from '../services/temporal.service.js';

export const triggerGreenhouseSync = async (req: Request, res: Response) => {
  const workflowId = await temporalService.startGreenhouseSync();
  res.json({ status: 'started', workflowId });
};

export const getSyncRuns = async (req: Request, res: Response) => {
  const runs = await temporalService.fetchSyncRuns();
  res.json(runs);
};
