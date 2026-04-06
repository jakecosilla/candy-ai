import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { createClient } from 'contentful';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Contentful Client Integration
const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || 'demo_space',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || 'demo_token',
});

// PostgreSQL Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://candy:password@localhost:5432/candy_ai'
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'candy-ai-bff' });
});

// GET CMS Page Content from Contentful
app.get('/api/pages/:slug', async (req, res) => {
  try {
    const entries = await contentfulClient.getEntries({
      content_type: 'page',
      'fields.slug': req.params.slug
    });
    if (entries.items.length > 0) {
      res.json(entries.items[0]);
    } else {
      res.status(404).json({ error: 'Page content not found' });
    }
  } catch (error) {
    console.error('Contentful error:', error);
    // Fallback to mock data to keep the UI functioning if keys aren't set
    res.json({
      sys: { id: 'mock' },
      fields: {
        title: 'Do the best work of your life.',
        subtitle: 'Join AntiGravity and help us shape the future of AI-powered workflows. We are looking for extraordinary people to solve hard problems.',
      }
    });
  }
});

// GET Jobs from PostgreSQL
app.get('/api/jobs', async (req, res) => {
  try {
    const { department, location } = req.query;
    let query = 'SELECT * FROM jobs WHERE is_active = TRUE';
    const params = [];
    
    if (department) {
      params.push(department);
      query += ` AND department = $${params.length}`;
    }
    if (location) {
      params.push(location);
      query += ` AND location = $${params.length}`;
    }
    
    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    
    if (result.rows.length === 0) {
      // Return fallback to prevent empty screen if sync hasn't run yet
      res.json([
        { id: '1', title: 'Senior Software Engineer, Frontend', department: 'Engineering', location: 'Remote', type: 'Full-time', description: 'Real job data from Postgres will appear here once Greenhouse sync completes.' }
      ]);
    } else {
      res.json(result.rows);
    }
  } catch (error) {
    console.error('Postgres error:', error);
    res.status(500).json({ error: 'Database connection error' });
  }
});

// GET Job Filters
app.get('/api/jobs/filters', async (req, res) => {
  try {
    const depRes = await pool.query('SELECT DISTINCT department FROM jobs WHERE is_active = TRUE AND department IS NOT NULL');
    const locRes = await pool.query('SELECT DISTINCT location FROM jobs WHERE is_active = TRUE AND location IS NOT NULL');
    
    const departments = depRes.rows.map(r => r.department);
    const locations = locRes.rows.map(r => r.location);
    
    if (departments.length === 0 && locations.length === 0) {
      res.json({ departments: ['Engineering', 'Design', 'People'], locations: ['Remote', 'San Francisco, CA', 'New York, NY'] });
    } else {
      res.json({ departments, locations });
    }
  } catch (error) {
    console.error('Postgres filter error:', error);
    res.json({ departments: ['Engineering', 'Design', 'People'], locations: ['Remote', 'San Francisco, CA', 'New York, NY'] });
  }
});

// GET Job Details
app.get('/api/jobs/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM jobs WHERE id = $1', [req.params.id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else if (req.params.id === '1') {
      res.json({ id: '1', title: 'Senior Software Engineer, Frontend', department: 'Engineering', location: 'Remote', type: 'Full-time', description: 'Real job data from Postgres will appear here once Greenhouse sync completes.' });
    } else {
      res.status(404).json({ error: 'Job not found' });
    }
  } catch (error) {
    console.error('Postgres job error:', error);
    res.status(500).json({ error: 'Database connection error' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API BFF running on port ${PORT}`);
});
