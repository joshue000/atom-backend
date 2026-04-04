import { Request, Response, NextFunction } from 'express';
import {
  TaskNotFoundError,
  UserNotFoundError,
  UserAlreadyExistsError,
  ValidationError,
} from '@domain/errors/domain.errors';

export function errorHandlerMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ValidationError) {
    res.status(400).json({ error: err.message });
    return;
  }
  if (err instanceof TaskNotFoundError || err instanceof UserNotFoundError) {
    res.status(404).json({ error: err.message });
    return;
  }
  if (err instanceof UserAlreadyExistsError) {
    res.status(409).json({ error: err.message });
    return;
  }

  console.error('[Unhandled Error]', err);
  res.status(500).json({ error: 'Internal server error' });
}
