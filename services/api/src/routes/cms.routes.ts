import { Router } from 'express';
import { getPage } from '../controllers/cms.controller.js';

const router = Router();

router.get('/:slug', getPage);

export default router;
