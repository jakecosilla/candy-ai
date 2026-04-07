import { Router } from 'express';
import { triggerGreenhouseSync, getSyncRuns } from '../controllers/admin.controller.js';

const router = Router();

router.post('/sync/jobs/greenhouse', triggerGreenhouseSync);
router.get('/sync-runs', getSyncRuns);

export default router;
