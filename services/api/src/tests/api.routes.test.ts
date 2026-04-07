import { jest, describe, it, expect } from '@jest/globals';
import request from 'supertest';

jest.mock('../db/index.js', () => ({
  // @ts-ignore
  pool: { query: jest.fn().mockResolvedValue({ rows: [{ id: 1, status: 'SUCCESS' }] }) }
}));

jest.mock('../services/temporal.service.js', () => ({
  temporalService: {
    // @ts-ignore
    startGreenhouseSync: jest.fn().mockResolvedValue('mock-workflow-id'),
    // @ts-ignore
    fetchSyncRuns: jest.fn().mockResolvedValue([{ id: 1, status: 'SUCCESS' }])
  }
}));

import app from '../app.js';

describe('Production API Controllers', () => {
  it('should hit health endpoint', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
  });

  it('should hit sync execution endpoint', async () => {
    const res = await request(app).post('/admin/sync/jobs/greenhouse');
    expect(res.status).toBe(200);
    expect(res.body.workflowId).toBe('mock-workflow-id');
  });
});
