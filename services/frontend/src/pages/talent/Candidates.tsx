import { Search, UserPlus } from 'lucide-react';

export default function Candidates() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Candidate Base</h1>
          <p className="text-slate-500 text-sm">Manage your internal talent pool and candidate profiles.</p>
        </div>
        <button className="btn btn-primary"><UserPlus size={18} /> Add Candidate</button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input className="input-base pl-10 h-12" placeholder="Search by name, email, or skill..." disabled />
        </div>
        <div className="mt-8 text-slate-400 text-sm italic">
          Candidate profiles will be indexed here once synchronization with Greenhouse is complete.
        </div>
      </div>
    </div>
  );
}
