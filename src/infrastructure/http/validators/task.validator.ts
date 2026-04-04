import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '@domain/errors/domain.errors';

export function validateCreateTask(req: Request, _res: Response, next: NextFunction): void {
  const { userId, title, description } = req.body as Record<string, unknown>;

  if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    return next(new ValidationError('userId is required'));
  }
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return next(new ValidationError('title is required'));
  }
  if (description === undefined || description === null || typeof description !== 'string') {
    return next(new ValidationError('description is required'));
  }

  next();
}

export function validateUpdateTask(req: Request, _res: Response, next: NextFunction): void {
  const { title, description, completed } = req.body as Record<string, unknown>;
  const hasAnyField = title !== undefined || description !== undefined || completed !== undefined;

  if (!hasAnyField) {
    return next(
      new ValidationError('At least one field (title, description, completed) must be provided'),
    );
  }
  if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
    return next(new ValidationError('title must be a non-empty string'));
  }
  if (description !== undefined && typeof description !== 'string') {
    return next(new ValidationError('description must be a string'));
  }
  if (completed !== undefined && typeof completed !== 'boolean') {
    return next(new ValidationError('completed must be a boolean'));
  }

  next();
}
