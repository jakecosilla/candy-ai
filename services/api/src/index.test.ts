import { jest, describe, it, expect } from '@jest/globals';
import request from 'supertest';

// Mock temporal service
jest.mock('./temporal.js', () => ({
  temporalService: {
    // @ts-ignore
    startGreenhouseSync: jest.fn().mockResolvedValue('mock-workflow-id'),
  }
}));

// Mock postgres pool
jest.mock('pg', () => {
  const mPool = {
    // @ts-ignore
    query: jest.fn().mockResolvedValue({ rows: [{ id: 1, status: 'SUCCESS' }] }),
  };
  return { Pool: jest.fn(() => mPool) };
});

// Mock contentful
jest.mock('contentful', () => ({
  createClient: jest.fn().mockReturnValue({}),
}));

import app from './index.js';

describe('Admin API Endpoints', () => {
  it('should start greenhouse sync', async () => {
    const res = await request(app).post('/admin/sync/jobs/greenhouse');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('started');
    expect(res.body.workflowId).toBe('mock-workflow-id');
  });

  it('should fetch sync runs', async () => {
    const res = await request(app).get('/admin/sync-runs');
    expect(res.status).toBe(200);
    expect(res.body[0].status).toBe('SUCCESS');
  });

  it('should be ready', async () => {
    const res = await request(app).get('/ready');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ready');
  });
});
