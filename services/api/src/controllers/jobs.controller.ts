import type { Request, Response } from 'express';
import { jobsService } from '../services/jobs.service.js';

export const getJobs = async (req: Request, res: Response) => {
  const department = req.query.department as string;
  const location = req.query.location as string;
  const jobs = await jobsService.getJobs(department, location);
  res.json(jobs);
};

export const getJobById = async (req: Request, res: Response) => {
  const job = await jobsService.getJobById(req.params.id as string);
  if (!job) {
    res.status(404).json({ error: 'Job not found' });
    return;
  }
  res.json(job);
};

export const getFilters = async (req: Request, res: Response) => {
  const filters = await jobsService.getFilters();
  res.json(filters);
};
