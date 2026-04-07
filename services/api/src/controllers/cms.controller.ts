import type { Request, Response } from 'express';
import { cmsService } from '../services/cms.service.js';

export const getPage = async (req: Request, res: Response) => {
  const page = await cmsService.getPageBySlug(req.params.slug as string);
  if (!page) {
    res.status(404).json({ error: 'Page content not found' });
    return;
  }
  res.json(page);
};
