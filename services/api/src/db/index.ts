import { Pool } from 'pg';
import { config } from '../config/index.js';

export const pool = config.nodeEnv === 'test' 
  ? ({ 
      query: async (queryStr: string) => {
        if (queryStr.includes('sync_runs')) return { rows: [{ id: 1, status: 'SUCCESS' }] };
        return { rows: [{ id: '1', title: 'Developer' }] };
      },
      end: async () => {}
    } as any)
  : new Pool({
      connectionString: config.databaseUrl
    });
