import { Inbox, Sparkles, Filter, MoreHorizontal } from 'lucide-react';
import { useRole } from '../../context/RoleContext';

export default function Applications() {
  const { role } = useRole();
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Application Inbox</h1>
          <p className="text-slate-500 text-sm">
            {role === 'RECRUITER' 
              ? 'Screen new submissions and triage to pipeline stages.' 
              : 'View recent applicants for your assigned job pods.'}
          </p>
        </div>
        <div className="flex gap-2">
           <button className="btn btn-secondary !py-2 !px-4 text-xs font-bold"><Filter size={14} /> Triage Filters</button>
           <button className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 transition-colors">
             <MoreHorizontal size={18} />
           </button>
        </div>
      </div>

      {/* Stats row for Recruiter */}
      {role === 'RECRUITER' && (
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">New Today</p>
            <p className="text-2xl font-black text-slate-900">0</p>
          </div>
          <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">AI Fast Tracked</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-black text-sky-600">0</p>
              <Sparkles className="text-sky-300" size={16} />
            </div>
          </div>
          <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Unprocessed</p>
            <p className="text-2xl font-black text-slate-900">0</p>
          </div>
          <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Avg. Screening Time</p>
            <p className="text-2xl font-black text-slate-900">--</p>
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-[2rem] p-24 text-center space-y-4 shadow-sm border-dashed">
        <div className="relative mx-auto w-16 h-16">
          <div className="absolute inset-0 bg-sky-100 rounded-2xl rotate-6 animate-pulse" />
          <div className="relative bg-white border border-slate-100 rounded-2xl w-full h-full flex items-center justify-center text-sky-500 shadow-sm">
            <Inbox size={32} />
          </div>
        </div>
        <div>
          <h3 className="text-slate-900 font-bold text-xl">Inbox is zero</h3>
          <p className="text-slate-500 mt-1 max-w-sm mx-auto text-sm leading-relaxed">
            {role === 'RECRUITER' 
              ? 'Great work! All new applicants have been reviewed or triaged to the live pipeline.' 
              : 'No new applicants require your direct oversight at this time.'}
          </p>
        </div>
        <button className="btn btn-secondary text-xs font-bold px-6">Refresh Submissions</button>
      </div>
    </div>
  );
}
