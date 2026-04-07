import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';
import { ZodError } from 'zod';
import { AppError } from './error.middleware.js';

export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error: any) {
      if (error && (error as any).name === 'ZodError') {
        const issues = (error as any).issues || (error as any).errors || [];
        return res.status(400).json({
          error: 'Validation Error',
          details: issues.map((e: any) => e.message),
        });
      }
      return next(error);
    }
  };
};
