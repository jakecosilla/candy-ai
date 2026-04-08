import { Layers, Search, Filter } from 'lucide-react';

export default function Pipeline() {
  const stages = ['New', 'Screening', 'Interview', 'Offer'];
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Live Pipeline</h1>
          <p className="text-slate-500 text-sm">Visualize candidate progression across all active roles.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input className="input-base pl-10 py-2 w-64" placeholder="Filter by candidate..." />
          </div>
          <button className="btn btn-secondary !py-2 !px-4"><Filter size={16} /> Filters</button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 h-[calc(100vh-300px)]">
        {stages.map((stage) => (
          <div key={stage} className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">{stage}</h3>
              <span className="text-xs bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-full">0</span>
            </div>
            <div className="flex-1 bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-3xl p-4 flex items-center justify-center text-center">
              <div>
                <Layers className="mx-auto text-slate-200 mb-2" size={32} />
                <p className="text-xs text-slate-400 font-medium">No candidates in this stage</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
