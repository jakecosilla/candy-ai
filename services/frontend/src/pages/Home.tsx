import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Search } from 'lucide-react';
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
    <>
      <div className="page-header">
        <h1 className="page-title">{pageContent ? pageContent.title : 'Do the best work of your life.'}</h1>
        <p className="page-subtitle">{pageContent ? pageContent.subtitle : 'Join us and help shape the future of AI.'}</p>
      </div>

      <div className="input-group">
        <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Search roles..." 
            className="select-base" 
            style={{ width: '100%', paddingLeft: '2.75rem', backgroundImage: 'none' }}
            disabled
          />
        </div>
        <select 
          className="select-base"
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
        >
          <option value="">All Departments</option>
          {filters.departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        
        <select 
          className="select-base"
          value={selectedLoc}
          onChange={(e) => setSelectedLoc(e.target.value)}
        >
          <option value="">All Locations</option>
          {filters.locations.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="loader"></div>
      ) : error ? (
           <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <h3 style={{ color: '#ef4444' }}>Server Sync Failed</h3>
              <p className="description" style={{ marginTop: '0.5rem' }}>{error}</p>
           </div>
      ) : jobs.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Briefcase size={48} color="var(--text-secondary)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <h3>No positions found</h3>
          <p className="description" style={{ marginTop: '0.5rem' }}>We couldn't find any roles matching your criteria.</p>
          <button className="btn btn-secondary" style={{ marginTop: '1.5rem' }} onClick={() => { setSelectedDept(''); setSelectedLoc(''); }}>Clear Filters</button>
        </div>
      ) : (
        <div className="grid-cards">
          {jobs.map(job => (
            <Link to={`/jobs/${job.id}`} key={job.id} className="glass-card job-card">
              <div style={{ zIndex: 1 }}>
                <h3 className="job-title">{job.title}</h3>
                <div className="job-meta">
                  <span className="badge badge-primary">{job.department}</span>
                  <span className="badge" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <MapPin size={12} /> {job.location}
                  </span>
                  <span className="badge">{job.type}</span>
                </div>
                <p className="description" style={{ marginTop: '1.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{job.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
