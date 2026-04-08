import { Link, useLocation } from 'react-router-dom';
import { 
  Users,
  FileText,
  Layers, 
  RefreshCw, 
  BarChart3, 
  UserCheck,
  ChevronDown
} from 'lucide-react';
import { useRole } from '../context/RoleContext';
import type { UserRole } from '../context/RoleContext';

export default function TalentLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { role, setRole } = useRole();

  const allItems = [
    { label: 'Live Pipeline', icon: Layers, path: '/admin/pipeline', roles: ['RECRUITER', 'HIRING_MANAGER', 'ADMIN'] },
    { label: 'Applications', icon: FileText, path: '/admin/applications', roles: ['RECRUITER', 'ADMIN', 'HIRING_MANAGER'] },
    { label: 'Candidate Base', icon: Users, path: '/admin/candidates', roles: ['RECRUITER', 'ADMIN'] },
    { label: 'Hiring Insights', icon: BarChart3, path: '/admin/insights', roles: ['RECRUITER', 'ADMIN'] },
    { label: 'Job Sync Hub', icon: RefreshCw, path: '/admin/integrations', roles: ['ADMIN'] },
  ];

  const menuItems = allItems.filter(item => item.roles.includes(role));

  const roleLabels: Record<UserRole, string> = {
    RECRUITER: 'Recruiter',
    ADMIN: 'Talent Ops Admin',
    HIRING_MANAGER: 'Hiring Manager',
    CANDIDATE: 'Candidate',
  };

  return (
    <div className="flex gap-8">
      {/* Sidebar Navigation */}
      <aside className="w-64 shrink-0 space-y-6">
        {/* Role Selector Dashboard Widget */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
            <span>Viewing as</span>
          </div>
          <div className="relative group">
            <div className="flex items-center justify-between bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl text-sm font-bold text-slate-900">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-sky-500" />
                {roleLabels[role]}
              </div>
              <ChevronDown size={14} className="text-slate-400" />
            </div>
            
            {/* Simple Role Switcher Popover for Demo */}
            <div className="absolute top-full left-0 w-full bg-white border border-slate-200 rounded-xl mt-1 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
              {(Object.keys(roleLabels) as UserRole[]).map((r) => r !== 'CANDIDATE' && (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-sky-50 transition-colors ${role === r ? 'text-sky-600' : 'text-slate-600'}`}
                >
                  {roleLabels[r]}
                </button>
              ))}
            </div>
          </div>
        </div>

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
