import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import JobDetails from './pages/JobDetails';
import AdminDashboard from './pages/AdminDashboard';
import Chatbot from './components/Chatbot';
import { Sparkles, Activity } from 'lucide-react';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <header className="nav-blur">
          <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between w-full">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center text-white font-bold group-hover:scale-105 transition-transform">
                <Sparkles size={18} />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">Candy<span className="text-sky-600">AI</span></span>
            </Link>
            <div className="flex gap-4">
              <Link to="/" className="text-sm font-medium text-slate-600 hover:text-sky-600 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors">Career Site</Link>
              <Link to="/admin" className="text-sm font-medium text-slate-600 hover:text-sky-600 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
                <Activity size={16} /> Talent Ops
              </Link>
            </div>
          </nav>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>

        <Chatbot />
      </div>
    </BrowserRouter>
  );
}

export default App;
