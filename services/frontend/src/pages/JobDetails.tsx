import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Building, Send, Share2, BookmarkPlus } from 'lucide-react';
import { apiClient } from '../api/client';

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
    apiClient.get(`/api/jobs/${id}`)
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
    <div className="bg-white border border-slate-200 rounded-2xl p-24 text-center max-w-2xl mx-auto mt-12 shadow-sm">
      <h1 className="text-3xl font-bold text-slate-900 mb-4">Position not found</h1>
      <p className="text-slate-500 mb-8">This role might have been filled or the link may have expired.</p>
      <Link to="/" className="btn btn-primary">Return to Career Site</Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-sky-600 transition-colors">
          <ArrowLeft size={16} /> All Positions
        </Link>
        <div className="flex gap-2">
          <button className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all">
            <Share2 size={18} />
          </button>
          <button className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all">
            <BookmarkPlus size={18} />
          </button>
        </div>
      </div>

      <header className="space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">{job.title}</h1>
        <div className="flex flex-wrap gap-3">
          <span className="badge badge-primary text-sm py-1.5 px-4 flex items-center gap-2">
            <Building size={16} /> {job.department}
          </span>
          <span className="badge text-sm py-1.5 px-4 flex items-center gap-2">
            <MapPin size={16} /> {job.location}
          </span>
          <span className="badge text-sm py-1.5 px-4 flex items-center gap-2">
            <Clock size={16} /> {job.type}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8 border-t border-slate-200">
        <div className="lg:col-span-2 space-y-12">
          <article className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Overview</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-12">{job.description}</p>
            
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Responsibilities</h2>
            <ul className="space-y-4 text-slate-600 text-lg list-none p-0">
              {[
                "Architect and implement scalable, data-driven frontend experiences.",
                "Collaborate with AI researchers to design intuitive agentic interfaces.",
                "Maintain and evolve our design system across all touchpoints.",
                "Optimize application performance for millions of global users."
              ].map((item, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6">Qualifications</h2>
            <ul className="space-y-4 text-slate-600 text-lg list-none p-0">
              {[
                "At least 5 years of professional frontend engineering experience.",
                "Deep expertise in React, TypeScript, and modern styling libraries.",
                "Strong understanding of visual design principles and UX best practices.",
                "Experience shipping complex product features at scale."
              ].map((item, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>

        <aside className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex flex-col gap-6 sticky top-24">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Apply Now</h3>
              <p className="text-slate-500 text-sm">Join our mission to reshape the recruitment landscape.</p>
            </div>
            <button className="btn btn-primary w-full py-4 text-base tracking-wide">
              <Send size={18} /> Submit Application
            </button>
            <div className="pt-6 border-t border-slate-100">
              <p className="text-xs text-center text-slate-400 italic">
                Typical response time: 2-3 business days.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
