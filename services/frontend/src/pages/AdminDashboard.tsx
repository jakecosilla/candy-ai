import { useEffect } from 'react';
import { Activity, RefreshCw, CheckCircle2, AlertCircle, Database } from 'lucide-react';
import { useAdmin } from '../hooks/useAdmin';

export default function AdminDashboard() {
  const { runs, loadingRuns, syncing, error, fetchRuns, triggerSync } = useAdmin();

  useEffect(() => {
    fetchRuns();
  }, [fetchRuns]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center text-sky-600">
              <Activity size={24} />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Talent Operations Center</h1>
          </div>
          <p className="text-slate-500 text-sm">Monitor and orchestrate your Greenhouse ATS integrations.</p>
        </div>
        
        <button
          onClick={triggerSync}
          disabled={syncing}
          className="btn btn-primary"
        >
          {syncing ? (
            <span className="flex items-center gap-2">
              <RefreshCw className="animate-spin" size={18} /> Triggering Sync...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <RefreshCw size={18} /> Force Sync Greenhouse
            </span>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-800 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} className="text-red-500" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-2">
          <p className="text-slate-500 font-medium text-xs uppercase tracking-wider">Total Integrations</p>
          <p className="text-3xl font-bold text-slate-900">{runs.length}</p>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-2">
          <p className="text-slate-500 font-medium text-xs uppercase tracking-wider">Jobs Synced</p>
          <p className="text-3xl font-bold text-slate-900">
            {runs.reduce((acc: number, curr: any) => acc + (curr.jobs_processed || 0), 0)}
          </p>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-2">
          <p className="text-slate-500 font-medium text-xs uppercase tracking-wider">System Status</p>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <p className="text-xl font-bold text-slate-900">Operational</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Database size={18} className="text-slate-400" /> Recruitment Activity
          </h2>
          <button 
            onClick={fetchRuns}
            className="text-xs font-semibold text-sky-600 hover:text-sky-700"
          >
            Refresh Logs
          </button>
        </div>

        {loadingRuns ? (
          <div className="py-24 text-center">
            <div className="loader !my-0"></div>
            <p className="text-slate-400 text-sm mt-4">Retrieving integration history...</p>
          </div>
        ) : runs.length === 0 ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
              <Database size={24} />
            </div>
            <div>
              <p className="text-slate-900 font-bold">No history available</p>
              <p className="text-slate-500 text-sm">Force a sync to see integration activity here.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                  <th className="px-6 py-4">Integration ID</th>
                  <th className="px-6 py-4">Health Status</th>
                  <th className="px-6 py-4">Records</th>
                  <th className="px-6 py-4 text-right">Execution Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {runs.map((run: any) => (
                  <tr key={run.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <code className="text-[11px] bg-slate-100 text-slate-600 px-2 py-1 rounded">#{run.id}</code>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {run.status === 'SUCCESS' ? (
                          <>
                            <CheckCircle2 size={16} className="text-emerald-500" />
                            <span className="text-sm font-semibold text-emerald-700">Healthy</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle size={16} className="text-red-500" />
                            <span className="text-sm font-semibold text-red-700">Failed</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-700">{run.jobs_processed || 0}</span>
                      <span className="text-slate-400 text-xs ml-1">jobs</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm text-slate-700 font-medium">
                        {new Date(run.start_time).toLocaleDateString()}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {new Date(run.start_time).toLocaleTimeString()}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
