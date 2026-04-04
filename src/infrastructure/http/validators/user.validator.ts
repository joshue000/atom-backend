import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '@domain/errors/domain.errors';

export function validateCreateUser(req: Request, _res: Response, next: NextFunction): void {
  const { email } = req.body as Record<string, unknown>;

  if (!email || typeof email !== 'string' || email.trim() === '') {
    return next(new ValidationError('email is required'));
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return next(new ValidationError('email format is invalid'));
  }

  next();
}
