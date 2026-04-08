import { useState, useCallback } from 'react';
import { apiClient } from '../api/client';

export const useJobs = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async (filters?: { department?: string, location?: string }) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters?.department) queryParams.append('department', filters.department);
      if (filters?.location) queryParams.append('location', filters.location);
      
      const res = await apiClient.get(`/api/jobs?${queryParams}`);
      setJobs(res);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { jobs, loading, error, fetchJobs };
}
