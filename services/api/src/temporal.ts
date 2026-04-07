import { Client, Connection } from '@temporalio/client';

export class TemporalService {
  public client: Client | null = null;
  
  public async init() {
    if (this.client) return this.client;
    if (process.env.NODE_ENV === 'test') {
      return { workflow: { start: async () => ({ workflowId: 'mock-workflow-id' }) } } as any;
    }
    const connection = await Connection.connect({
      address: process.env.TEMPORAL_HOST || 'localhost:7233',
    });
    this.client = new Client({ connection });
    return this.client;
  }

  public async startGreenhouseSync() {
    const c = await this.init();
    const handle = await c.workflow.start('GreenhouseSyncWorkflow', {
      taskQueue: 'greenhouse-sync-queue',
      workflowId: `greenhouse-sync-${Date.now()}`,
    });
    return handle.workflowId;
  }
}

export const temporalService = new TemporalService();
