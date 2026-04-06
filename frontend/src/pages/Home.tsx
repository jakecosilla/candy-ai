import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Search } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
}

interface Filters {
  departments: string[];
  locations: string[];
}

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filters, setFilters] = useState<Filters>({ departments: [], locations: [] });
  const [loading, setLoading] = useState(true);
  
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedLoc, setSelectedLoc] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/api/jobs/filters')
      .then(res => res.json())
      .then(data => setFilters(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedDept) params.append('department', selectedDept);
    if (selectedLoc) params.append('location', selectedLoc);

    fetch(`http://localhost:4000/api/jobs?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setJobs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [selectedDept, selectedLoc]);

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Do the best work of your life.</h1>
        <p className="page-subtitle">Join AntiGravity and help us shape the future of AI-powered workflows. We're looking for extraordinary people to solve hard problems.</p>
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
                <p className="description" style={{ marginTop: '1.25rem' }}>{job.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
