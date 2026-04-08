import { Inbox } from 'lucide-react';

export default function Applications() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Applications</h1>
        <p className="text-slate-500 text-sm">Review incoming candidate submissions from the career site.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-24 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
          <Inbox size={32} />
        </div>
        <div>
          <h3 className="text-slate-900 font-bold text-xl">Inbox clean</h3>
          <p className="text-slate-500 mt-1">New applications will appear here once candidates apply.</p>
        </div>
      </div>
    </div>
  );
}
