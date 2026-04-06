import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const MOCK_JOBS = [
  { id: '1', title: 'Senior Software Engineer, Frontend', department: 'Engineering', location: 'Remote', type: 'Full-time', description: 'We are looking for an experienced frontend engineer to lead our product experiences.' },
  { id: '2', title: 'Machine Learning Engineer', department: 'AI Data', location: 'San Francisco, CA', type: 'Full-time', description: 'Join our applied AI team to build and evaluate intelligent workflows.' },
  { id: '3', title: 'Product Designer', department: 'Design', location: 'New York, NY', type: 'Full-time', description: 'Shape the future of enterprise software with stunning, dynamic user interfaces.' },
  { id: '4', title: 'Recruiting Coordinator', department: 'People', location: 'Remote', type: 'Contract', description: 'Help manage our growing talent pipeline and provide a top-tier candidate experience.' },
];

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'candy-ai-bff' });
});

app.get('/api/jobs', (req, res) => {
  const { department, location } = req.query;
  let results = MOCK_JOBS;
  if (department) results = results.filter(j => j.department === department);
  if (location) results = results.filter(j => j.location === location);
  res.json(results);
});

app.get('/api/jobs/filters', (req, res) => {
  const departments = [...new Set(MOCK_JOBS.map(j => j.department))];
  const locations = [...new Set(MOCK_JOBS.map(j => j.location))];
  res.json({ departments, locations });
});

app.get('/api/jobs/:id', (req, res) => {
  const job = MOCK_JOBS.find(j => j.id === req.params.id);
  if (job) res.json(job);
  else res.status(404).json({ error: 'Job not found' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API BFF running on port ${PORT}`);
});
