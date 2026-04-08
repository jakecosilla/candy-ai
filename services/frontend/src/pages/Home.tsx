import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Search, ChevronRight } from 'lucide-react';
import { apiClient } from '../api/client';
import { useJobs } from '../hooks/useJobs';

export default function Home() {
  const { jobs, loading, error, fetchJobs } = useJobs();
  const [filters, setFilters] = useState<{ departments: string[]; locations: string[] }>({ departments: [], locations: [] });
  const [pageContent, setPageContent] = useState<any>(null);
  
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedLoc, setSelectedLoc] = useState('');

  useEffect(() => {
    fetchJobs({ department: selectedDept, location: selectedLoc });
  }, [selectedDept, selectedLoc, fetchJobs]);

  useEffect(() => {
    apiClient.get('/api/pages/home')
      .then(data => setPageContent(data?.fields))
      .catch(err => console.error('Failed to parse CMS data', err));

    apiClient.get('/api/jobs/filters')
      .then(data => setFilters(data))
      .catch(err => console.error('Failed to parse filters', err));
  }, []);

  return (
    <div className="space-y-12">
      <section className="text-center space-y-4 py-8">
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
          {pageContent ? pageContent.title : <span className="text-gradient">Do the best work of your life.</span>}
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
          {pageContent ? pageContent.subtitle : 'Join our mission to build the most helpful AI recruiting assistant in the world.'}
        </p>
      </section>

      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search or filter roles..." 
              className="input-base pl-10"
              disabled
            />
          </div>
          
          <div className="flex gap-4 flex-1 md:flex-none">
            <select 
              className="input-base min-w-[200px]"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              <option value="">All Departments</option>
              {filters.departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            
            <select 
              className="input-base min-w-[200px]"
              value={selectedLoc}
              onChange={(e) => setSelectedLoc(e.target.value)}
            >
              <option value="">All Locations</option>
              {filters.locations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="loader"></div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-12 text-center">
          <h3 className="text-red-800 font-bold text-lg">Infrastructure Error</h3>
          <p className="text-red-600 mt-2">{error}</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Briefcase size={32} />
          </div>
          <div>
            <h3 className="text-slate-900 font-bold text-xl">No matching roles</h3>
            <p className="text-slate-500 mt-1">We couldn't find any positions matching your current search criteria.</p>
          </div>
          <button 
            className="btn btn-secondary" 
            onClick={() => { setSelectedDept(''); setSelectedLoc(''); }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map(job => (
            <Link to={`/jobs/${job.id}`} key={job.id} className="glass-card group flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">{job.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="badge badge-primary">{job.department}</span>
                    <span className="badge flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                  </div>
                </div>
                <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">{job.description}</p>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between text-sky-600 font-semibold text-sm">
                <span>View Position</span>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
