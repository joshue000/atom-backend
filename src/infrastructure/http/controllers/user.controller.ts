import { Request, Response, NextFunction } from 'express';
import { makeGetUserByEmailUseCase, makeCreateUserUseCase } from '../../factories/use-case.factory';
import { CreateUserDto } from '@application/dtos/user.dto';

export async function getUserByEmail(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { email } = req.params;
    const user = await makeGetUserByEmailUseCase().execute(decodeURIComponent(email));
    if (!user) {
      res.status(404).json({ error: `User "${email}" not found` });
      return;
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

export async function createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dto = req.body as CreateUserDto;
    const user = await makeCreateUserUseCase().execute(dto);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}
