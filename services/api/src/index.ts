import app from './app.js';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';
import { pool } from './db/index.js';

const server = app.listen(config.port, () => {
  logger.info(`Production API BFF running on port ${config.port} in ${config.nodeEnv} mode`);
});

const gracefulShutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  
  server.close(async () => {
    logger.info('HTTP server closed.');
    try {
      await pool.end();
      logger.info('Database pool closed.');
      process.exit(0);
    } catch (err) {
      logger.error('Error during database teardown', { error: err });
      process.exit(1);
    }
  });

  setTimeout(() => {
    logger.error('Forcing shutdown due to timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
