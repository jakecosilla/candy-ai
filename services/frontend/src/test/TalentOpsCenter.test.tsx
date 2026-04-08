import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TalentOpsCenter from '../pages/TalentOpsCenter';
import { useAdmin } from '../hooks/useAdmin';

vi.mock('../hooks/useAdmin', () => ({
  useAdmin: vi.fn()
}));

describe('TalentOpsCenter Component', () => {
  it('should render and present sync history state correctly', () => {
    vi.mocked(useAdmin).mockReturnValue({
      runs: [{ id: 1, status: 'SUCCESS', jobs_processed: 5, start_time: new Date().toISOString() }],
      loadingRuns: false,
      syncing: false,
      error: null,
      fetchRuns: vi.fn(),
      triggerSync: vi.fn()
    });

    render(<TalentOpsCenter />);

    // Updated expectations for redesigned IA
    expect(screen.getByText('Job Sync Hub')).toBeInTheDocument();
    expect(screen.getByText('Force Sync Greenhouse')).toBeInTheDocument();
    expect(screen.getByText('Healthy')).toBeInTheDocument();
  });
});
