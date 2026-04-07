import express from 'express';
import cors from 'cors';
import { errorMiddleware } from './middlewares/error.middleware.js';
import jobsRoutes from './routes/jobs.routes.js';
import adminRoutes from './routes/admin.routes.js';
import cmsRoutes from './routes/cms.routes.js';
import { getHealth, getReady } from './controllers/health.controller.js';
import { logger } from './utils/logger.js';

const app = express();

app.use(cors());
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  logger.info(`Incoming ${req.method} request to ${req.originalUrl}`);
  next();
});

// App Base Endpoints
app.get('/health', getHealth);
app.get('/ready', getReady);

app.use('/api/jobs', jobsRoutes);
app.use('/jobs', jobsRoutes); // alias mappings
app.use('/admin', adminRoutes);
app.use('/api/pages', cmsRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use(errorMiddleware);

export default app;
