import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TalentOpsCenter from '../pages/TalentOpsCenter';
import { useAdmin } from '../hooks/useAdmin';
import { RoleProvider, useRole } from '../context/RoleContext';
import { useEffect } from 'react';

vi.mock('../hooks/useAdmin', () => ({
  useAdmin: vi.fn()
}));

// Helper component to force a specific role in tests
const TestRoleWrapper = ({ children, role }: { children: React.ReactNode, role: any }) => {
  const TestRenderer = ({ children }: { children: React.ReactNode }) => {
    const { setRole } = useRole();
    useEffect(() => {
      setRole(role);
    }, [role, setRole]);
    return <>{children}</>;
  };

  return (
    <RoleProvider>
      <TestRenderer>{children}</TestRenderer>
    </RoleProvider>
  );
};

describe('TalentOpsCenter Component', () => {
  it('should render and present sync history state correctly for Admin', () => {
    vi.mocked(useAdmin).mockReturnValue({
      runs: [{ id: 1, status: 'SUCCESS', jobs_processed: 5, start_time: new Date().toISOString() }],
      loadingRuns: false,
      syncing: false,
      error: null,
      fetchRuns: vi.fn(),
      triggerSync: vi.fn()
    });

    render(
      <TestRoleWrapper role="ADMIN">
        <TalentOpsCenter />
      </TestRoleWrapper>
    );

    expect(screen.getByText('Job Sync Hub')).toBeInTheDocument();
    expect(screen.getByText('Force Sync Greenhouse')).toBeInTheDocument();
    expect(screen.getByText('Healthy')).toBeInTheDocument();
  });
});
