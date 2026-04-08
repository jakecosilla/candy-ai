import { Link, useLocation } from 'react-router-dom';
import { 
  Users,
  FileText,
  Layers, 
  RefreshCw, 
  BarChart3, 
  UserCheck
} from 'lucide-react';

export default function TalentLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const menuItems = [
    { label: 'Live Pipeline', icon: Layers, path: '/admin/pipeline' },
    { label: 'Applications', icon: FileText, path: '/admin/applications' },
    { label: 'Candidate Base', icon: Users, path: '/admin/candidates' },
    { label: 'Hiring Insights', icon: BarChart3, path: '/admin/insights' },
    { label: 'Job Sync Hub', icon: RefreshCw, path: '/admin/integrations' },
  ];

  return (
    <div className="flex gap-8">
      {/* Sidebar Navigation */}
      <aside className="w-64 shrink-0 space-y-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path === '/admin/pipeline' && location.pathname === '/admin');
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between group px-3 py-2.5 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-sky-50 text-sky-600 font-bold' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} className={isActive ? 'text-sky-600' : 'text-slate-400 group-hover:text-slate-600'} />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-sky-600" />}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="bg-sky-600 rounded-2xl p-6 text-white shadow-lg shadow-sky-600/20 space-y-4">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <UserCheck size={20} />
          </div>
          <div>
            <h4 className="font-bold text-sm">Need Help?</h4>
            <p className="text-[11px] text-sky-100 mt-1 leading-relaxed">Access recruitment playbooks and hiring guidelines in our internal wiki.</p>
          </div>
          <button className="w-full py-2 bg-white text-sky-600 rounded-xl text-xs font-bold hover:bg-sky-50 transition-colors">
            View Docs
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}
