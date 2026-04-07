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
  space: process.env.CONTENTFUL_SPACE_ID as string,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN as string,
});

// PostgreSQL Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const QUERIES = {
  getJobsBase: 'SELECT * FROM jobs WHERE is_active = TRUE',
  getDepartments: 'SELECT DISTINCT department FROM jobs WHERE is_active = TRUE AND department IS NOT NULL',
  getLocations: 'SELECT DISTINCT location FROM jobs WHERE is_active = TRUE AND location IS NOT NULL',
  getJobById: 'SELECT * FROM jobs WHERE id = $1'
};

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
    res.status(500).json({ error: 'Failed to fetch content from CMS' });
  }
});

// GET Jobs from PostgreSQL
app.get('/api/jobs', async (req, res) => {
  try {
    const { department, location } = req.query;
    let query = QUERIES.getJobsBase;
    const params: any[] = [];
    
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
    res.json(result.rows);
  } catch (error) {
    console.error('Postgres error:', error);
    res.status(500).json({ error: 'Database connection error' });
  }
});

// GET Job Filters
app.get('/api/jobs/filters', async (req, res) => {
  try {
    const depRes = await pool.query(QUERIES.getDepartments);
    const locRes = await pool.query(QUERIES.getLocations);
    
    const departments = depRes.rows.map((r: any) => r.department);
    const locations = locRes.rows.map((r: any) => r.location);
    
    res.json({ departments, locations });
  } catch (error) {
    console.error('Postgres filter error:', error);
    res.status(500).json({ error: 'Database connection error' });
  }
});

// GET Job Details
app.get('/api/jobs/:id', async (req, res) => {
  try {
    const result = await pool.query(QUERIES.getJobById, [req.params.id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
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
