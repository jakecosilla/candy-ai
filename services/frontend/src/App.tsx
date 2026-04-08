import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import JobDetails from './pages/JobDetails';
import TalentOpsCenter from './pages/TalentOpsCenter';
import TalentLayout from './components/TalentLayout';
import Pipeline from './pages/talent/Pipeline';
import Applications from './pages/talent/Applications';
import Candidates from './pages/talent/Candidates';
import Chatbot from './components/Chatbot';
import { RoleProvider } from './context/RoleContext';
import { Sparkles, Briefcase, UserCircle } from 'lucide-react';

function App() {
  return (
    <RoleProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
          {/* Main Navbar */}
          <header className="nav-blur">
            <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between w-full">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center text-white font-bold group-hover:scale-105 transition-transform shadow-lg shadow-sky-600/20">
                  <Sparkles size={18} />
                </div>
                <span className="text-xl font-bold text-slate-900 tracking-tight">Candy<span className="text-sky-600">AI</span></span>
              </Link>
              
              <div className="flex items-center gap-1">
                <Link to="/" className="text-sm font-bold text-slate-600 hover:text-sky-600 px-4 py-2 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2">
                  <Briefcase size={16} /> Career Site
                </Link>
                <Link to="/admin" className="text-sm font-bold text-slate-600 hover:text-sky-600 px-4 py-2 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" /> Talent Ops Hub
                </Link>
                <div className="w-px h-6 bg-slate-200 mx-2" />
                <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                  <UserCircle size={20} />
                </button>
              </div>
            </nav>
          </header>

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-12">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              
              {/* Talent Operations Hub Routes */}
              <Route path="/admin" element={<TalentLayout children={<Navigate to="/admin/pipeline" replace />} />} />
              <Route path="/admin/pipeline" element={<TalentLayout children={<Pipeline />} />} />
              <Route path="/admin/applications" element={<TalentLayout children={<Applications />} />} />
              <Route path="/admin/candidates" element={<TalentLayout children={<Candidates />} />} />
              <Route path="/admin/integrations" element={<TalentLayout children={<TalentOpsCenter />} />} />
            </Routes>
          </main>

          <Chatbot />
        </div>
      </BrowserRouter>
    </RoleProvider>
  );
}

export default App;
