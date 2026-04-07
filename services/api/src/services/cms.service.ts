import { createClient } from 'contentful';
import type { ContentfulClientApi } from 'contentful';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';
import { AppError } from '../middlewares/error.middleware.js';

export class CmsService {
  private client: ContentfulClientApi<any> | null = null;

  constructor() {
    if (config.nodeEnv !== 'test' && config.contentful.spaceId && config.contentful.accessToken) {
      this.client = createClient({
        space: config.contentful.spaceId,
        accessToken: config.contentful.accessToken,
      });
    }
  }

  async getPageBySlug(slug: string) {
    if (!this.client) {
      if (config.nodeEnv === 'test') return { title: 'Mock Page', slug };
      throw new AppError(500, 'CMS integration is misconfigured');
    }

    try {
      const entries = await this.client.getEntries({
        content_type: 'page',
        'fields.slug': slug
      });
      return entries.items.length > 0 ? entries.items[0] : null;
    } catch (error) {
      logger.error('Failed to fetch from sequence', { error });
      throw new AppError(500, 'Failed to fetch content from CMS');
    }
  }
}

export const cmsService = new CmsService();
