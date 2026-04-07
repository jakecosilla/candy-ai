import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import JobDetails from './pages/JobDetails';
import Chatbot from './components/Chatbot';
import { Sparkles } from 'lucide-react';

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
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
        </Routes>
      </main>

      <Chatbot />
    </BrowserRouter>
  );
}

export default App;
