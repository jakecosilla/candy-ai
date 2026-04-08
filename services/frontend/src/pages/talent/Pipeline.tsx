import { Layers, Search, Filter, Sparkles, Star } from 'lucide-react';
import { useRole } from '../../context/RoleContext';

export default function Pipeline() {
  const { role } = useRole();
  const stages = ['New', 'Screening', 'Interview', 'Offer'];

  const getStageInstruction = (stage: string) => {
    if (role === 'RECRUITER') {
      if (stage === 'New') return 'Prioritize candidates with AI scores > 80';
      if (stage === 'Screening') return 'Schedule intro calls this week';
    }
    if (role === 'HIRING_MANAGER') {
      if (stage === 'Interview') return 'Review feedback from initial rounds';
    }
    return 'Manage candidate progression';
  };
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Live Pipeline</h1>
          <p className="text-slate-500 text-sm">
            {role === 'RECRUITER' 
              ? 'Manage sourcing and initial screening for all active pods.' 
              : role === 'HIRING_MANAGER'
                ? 'Review candidates shortlisted for your final interviews.'
                : 'System-wide candidate flow monitoring.'}
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input className="input-base pl-10 py-2 w-64 text-sm" placeholder="Search by name or skill..." />
          </div>
          <button className="btn btn-secondary !py-2 !px-4"><Filter size={16} /> Filters</button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 min-h-[400px]">
        {stages.map((stage) => (
          <div key={stage} className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">{stage}</h3>
                {stage === 'Interview' && role === 'HIRING_MANAGER' && (
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" title="Requires Attention" />
                )}
              </div>
              <span className="text-xs bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-full">0</span>
            </div>
            
            <div className={`flex-1 border-2 border-dashed rounded-3xl p-4 flex flex-col items-center justify-center text-center transition-colors ${
              (stage === 'Interview' && role === 'HIRING_MANAGER') || (stage === 'New' && role === 'RECRUITER')
                ? 'bg-sky-50/50 border-sky-100'
                : 'bg-slate-50/50 border-slate-100'
            }`}>
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center mx-auto">
                  {role === 'RECRUITER' && stage === 'New' ? (
                    <Sparkles className="text-sky-400" size={24} />
                  ) : role === 'HIRING_MANAGER' && stage === 'Interview' ? (
                    <Star className="text-amber-400" size={24} />
                  ) : (
                    <Layers className="text-slate-200" size={24} />
                  )}
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                    {getStageInstruction(stage)}
                  </p>
                  <p className="text-xs text-slate-400">Drag and drop candidates to update status</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Role-Specific Productivity Tip */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white flex items-center justify-between overflow-hidden relative">
        <div className="absolute right-0 top-0 w-64 h-64 bg-sky-500/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-widest mb-3">
             <Sparkles size={14} /> Power Tip for {role.toLowerCase()}s
          </div>
          <h3 className="text-xl font-bold mb-2">
            {role === 'RECRUITER' 
              ? 'Speed up screening with AI Summaries' 
              : 'Prepare for interviews with generated guides'}
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            {role === 'RECRUITER'
              ? 'Candidates are automatically scored on a scale of 1-100 based on their previous experience and technical alignment with the Job Description.'
              : 'Access the Interview Guide generator to get person-specific behavioral questions based on their resume highlights.'}
          </p>
        </div>
        <button className="btn btn-primary relative z-10">Try it out</button>
      </div>
    </div>
  );
}
