import { useState, useCallback } from 'react';
import { apiClient } from '../api/client';

export const useAdmin = () => {
  const [runs, setRuns] = useState<any[]>([]);
  const [loadingRuns, setLoadingRuns] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRuns = useCallback(async () => {
    setLoadingRuns(true);
    try {
      const data = await apiClient.get('/admin/sync-runs');
      setRuns(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingRuns(false);
    }
  }, []);

  const triggerSync = async () => {
    setSyncing(true);
    try {
      await apiClient.post('/admin/sync/jobs/greenhouse', {});
      setTimeout(fetchRuns, 1500);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSyncing(false);
    }
  };

  return { runs, loadingRuns, syncing, error, fetchRuns, triggerSync };
};
