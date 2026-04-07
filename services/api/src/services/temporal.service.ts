import { Client, Connection } from '@temporalio/client';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';
import { pool } from '../db/index.js';
import { AppError } from '../middlewares/error.middleware.js';

export class TemporalService {
  public client: Client | null = null;
  
  public async init() {
    if (this.client) return this.client;
    if (config.nodeEnv === 'test') {
      return { workflow: { start: async () => ({ workflowId: 'mock-workflow-id' }) } } as any;
    }
    const connection = await Connection.connect({
      address: config.temporalHost,
    });
    this.client = new Client({ connection });
    return this.client;
  }

  public async startGreenhouseSync() {
    try {
      const c = await this.init();
      const handle = await c.workflow.start('GreenhouseSyncWorkflow', {
        taskQueue: 'greenhouse-sync-queue',
        workflowId: `greenhouse-sync-${Date.now()}`,
      });
      logger.info(`Started Greenhouse Sync Workflow: ${handle.workflowId}`);
      return handle.workflowId;
    } catch (error) {
      logger.error('Failed to hook into Temporal', { error });
      throw new AppError(500, 'Failed to start sync workflow');
    }
  }

  public async fetchSyncRuns() {
    try {
      const result = await pool.query('SELECT * FROM sync_runs ORDER BY start_time DESC LIMIT 20');
      return result.rows;
    } catch (error) {
      logger.error('Failed to load sync runs from DB', { error });
      throw new AppError(500, 'Failed to fetch sync runs');
    }
  }
}

export const temporalService = new TemporalService();
