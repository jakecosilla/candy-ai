import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useJobs } from '../hooks/useJobs';
import { apiClient } from '../api/client';

vi.mock('../api/client', () => ({
  apiClient: { get: vi.fn(), post: vi.fn(), apiUrl: '', adminUrl: '' }
}));

describe('useJobs Hook', () => {
  it('should format URL appropriately and fetch', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce([{ id: 1, title: 'Engineer' }]);
    
    const { result } = renderHook(() => useJobs());
    expect(result.current.loading).toBe(false);

    await act(async () => {
      await result.current.fetchJobs({ department: 'Engineering' });
    });

    expect(apiClient.get).toHaveBeenCalledWith('/api/jobs?department=Engineering');
    expect(result.current.jobs[0].title).toEqual('Engineer');
    expect(result.current.loading).toBe(false);
  });
});
