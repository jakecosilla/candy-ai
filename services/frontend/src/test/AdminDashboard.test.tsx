import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AdminDashboard from '../pages/AdminDashboard';
import { useAdmin } from '../hooks/useAdmin';


vi.mock('../hooks/useAdmin', () => ({
  useAdmin: vi.fn()
}));

describe('AdminDashboard Component', () => {
  it('should render and present sync history state correctly', () => {
    vi.mocked(useAdmin).mockReturnValue({
      runs: [{ id: 1, status: 'SUCCESS', jobs_processed: 5, start_time: new Date().toISOString() }],
      loadingRuns: false,
      syncing: false,
      error: null,
      fetchRuns: vi.fn(),
      triggerSync: vi.fn()
    });

    render(<AdminDashboard />);

    expect(screen.getByText('System Admin')).toBeInTheDocument();
    expect(screen.getByText('Force Sync Greenhouse')).toBeInTheDocument();
    expect(screen.getByText('SUCCESS')).toBeInTheDocument();
  });
});
