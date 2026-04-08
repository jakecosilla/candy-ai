import { useEffect } from 'react';
import { Activity, RefreshCw } from 'lucide-react';
import { useAdmin } from '../hooks/useAdmin';


export default function AdminDashboard() {
  const { runs, loadingRuns, syncing, error, fetchRuns, triggerSync } = useAdmin();

  useEffect(() => {
    fetchRuns();
  }, [fetchRuns]);

  return (
    <>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="page-title" style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: 0 }}>
          <Activity color="var(--accent-color)" size={32} /> System Admin
        </h1>
        <button
          onClick={triggerSync}
          disabled={syncing}
          className="btn btn-primary"
          style={{ opacity: syncing ? 0.7 : 1 }}
        >
          {syncing ? 'Triggering Sync...' : <><RefreshCw size={18} /> Force Sync Greenhouse</>}
        </button>
      </div>

      {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #ef4444', marginBottom: '1.5rem' }}>{error}</div>}

      <div className="glass-card">
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'white' }}>Recent Integrations</h2>
        {loadingRuns ? (
          <div className="loader"></div>
        ) : runs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No active runs logged in database.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '1rem 0' }}>Run ID</th>
                  <th style={{ padding: '1rem 0' }}>Status</th>
                  <th style={{ padding: '1rem 0' }}>Processed</th>
                  <th style={{ padding: '1rem 0', textAlign: 'right' }}>Start Time</th>
                </tr>
              </thead>
              <tbody>
                {runs.map((run: any) => (
                  <tr key={run.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem 0', fontFamily: 'monospace', opacity: 0.7 }}>{run.id}</td>
                    <td style={{ padding: '1rem 0' }}>
                      <span className={`badge ${run.status === 'SUCCESS' ? 'badge-primary' : ''}`}>
                        {run.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 0', fontFamily: 'monospace' }}>{run.jobs_processed || 0}</td>
                    <td style={{ padding: '1rem 0', textAlign: 'right', color: 'var(--text-secondary)' }}>{new Date(run.start_time).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
