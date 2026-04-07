import { Router } from 'express';
import { getJobs, getJobById, getFilters } from '../controllers/jobs.controller.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import { z } from 'zod';

const router = Router();

const getJobsSchema = z.object({
  query: z.object({
    department: z.string().optional(),
    location: z.string().optional(),
  }),
});

router.get('/', validateRequest(getJobsSchema), getJobs);
router.get('/filters', getFilters);
router.get('/:id', getJobById);

export default router;
