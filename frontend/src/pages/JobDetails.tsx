import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Building, Send } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
}

export default function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:4000/api/jobs/${id}`)
      .then(res => res.json())
      .then(data => {
        setJob(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="loader"></div>;

  if (!job) return (
    <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <h1>Job Not Found</h1>
      <Link to="/" className="btn btn-secondary" style={{ marginTop: '1.5rem' }}>View All Openings</Link>
    </div>
  );

  return (
    <div>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '2rem' }}>
        <ArrowLeft size={16} /> Back to careers
      </Link>

      <div className="job-detail-header">
        <h1>{job.title}</h1>
        <div className="job-meta">
          <span className="badge badge-primary" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
            <Building size={14} style={{ marginRight: '0.35rem' }}/> {job.department}
          </span>
          <span className="badge" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
            <MapPin size={14} style={{ marginRight: '0.35rem' }}/> {job.location}
          </span>
          <span className="badge" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
            <Clock size={14} style={{ marginRight: '0.35rem' }}/> {job.type}
          </span>
        </div>
      </div>

      <div className="job-content-container">
        <div className="glass-card job-description-body">
          <h3>About the Role</h3>
          <p>{job.description}</p>
          <p>This is a placeholder for the extended job description which would normally be fetched from Greenhouse and managed via the Contentful integration as described in the architecture.</p>

          <h3>What You'll Do</h3>
          <ul style={{ listStylePosition: 'inside', marginBottom: '1.5rem' }}>
            <li>Architect scalable frontend experiences using React.</li>
            <li>Collaborate with product and AI teams to surface agentic workflows.</li>
            <li>Maintain rigorous standards for UI aesthetics.</li>
          </ul>

          <h3>Who You Are</h3>
          <ul style={{ listStylePosition: 'inside', marginBottom: '1.5rem' }}>
            <li>Deep experience with modern JS/TS frameworks.</li>
            <li>An eye for premium design and glassmorphic / dark mode CSS.</li>
            <li>Passionate about practical AI capabilities.</li>
          </ul>
        </div>

        <div className="glass-card apply-card">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Ready to shape the future?</h3>
          <p className="description" style={{ marginBottom: '1.5rem' }}>Submit your application today. We'll be in touch quickly.</p>
          
          <button className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>
            <Send size={18} /> Apply for this role
          </button>
          
          <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Or applied before? <a href="#" style={{ color: 'var(--accent-color)' }}>Check application status</a>
          </div>
        </div>
      </div>
    </div>
  );
}
