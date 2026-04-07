import { jest, describe, it, expect } from '@jest/globals';
import { JobsService } from '../services/jobs.service.js';

// Mock DB
jest.mock('../db/index.js', () => ({
  // @ts-ignore
  pool: { query: jest.fn().mockResolvedValue({ rows: [{ id: '1', title: 'Developer' }] }) }
}));

describe('JobsService', () => {
  it('should fetch jobs', async () => {
    const service = new JobsService();
    const jobs = await service.getJobs('Engineering');
    expect(jobs).toHaveLength(1);
    expect(jobs[0].title).toBe('Developer');
  });
});
