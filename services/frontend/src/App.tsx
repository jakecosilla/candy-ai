import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import JobDetails from './pages/JobDetails';
import AdminDashboard from './pages/AdminDashboard';
import Chatbot from './components/Chatbot';
import { Sparkles, Activity } from 'lucide-react';

function App() {
  return (
    <BrowserRouter>
      <div className="bg-glow-1"></div>
      <div className="bg-glow-2"></div>
      
      <nav className="navbar">
        <Link to="/" className="nav-brand">
          <Sparkles className="text-accent" size={24} color="#a855f7" />
          <span>Candy AI Careers</span>
        </Link>
        <Link to="/admin" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, fontSize: '0.95rem' }}>
          <Activity size={16} /> Admin
        </Link>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>

      <Chatbot />
    </BrowserRouter>
  );
}

export default App;
