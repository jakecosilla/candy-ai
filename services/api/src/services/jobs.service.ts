import { pool } from '../db/index.js';
import { logger } from '../utils/logger.js';
import { AppError } from '../middlewares/error.middleware.js';

export class JobsService {
  async getJobs(department?: string, location?: string) {
    try {
      let query = 'SELECT * FROM jobs WHERE is_active = TRUE';
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
      return result.rows;
    } catch (error) {
      logger.error('Failed to fetch jobs from DB', { error });
      throw new AppError(500, 'Database error while fetching jobs');
    }
  }

  async getJobById(id: string) {
    try {
      const result = await pool.query('SELECT * FROM jobs WHERE id = $1', [id]);
      return result.rows.length ? result.rows[0] : null;
    } catch (error) {
      logger.error('Failed to fetch job by id', { id, error });
      throw new AppError(500, 'Database error while fetching job details');
    }
  }

  async getFilters() {
    try {
      const depRes = await pool.query('SELECT DISTINCT department FROM jobs WHERE is_active = TRUE AND department IS NOT NULL');
      const locRes = await pool.query('SELECT DISTINCT location FROM jobs WHERE is_active = TRUE AND location IS NOT NULL');
      return {
        departments: depRes.rows.map((r: any) => r.department),
        locations: locRes.rows.map((r: any) => r.location),
      };
    } catch (error) {
      logger.error('Failed to fetch filters from DB', { error });
      throw new AppError(500, 'Database error while fetching filters');
    }
  }
}

export const jobsService = new JobsService();
