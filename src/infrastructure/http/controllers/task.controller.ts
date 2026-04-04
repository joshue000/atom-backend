import { Request, Response, NextFunction } from 'express';
import {
  makeGetTasksUseCase,
  makeCreateTaskUseCase,
  makeUpdateTaskUseCase,
  makeDeleteTaskUseCase,
} from '../../factories/use-case.factory';
import { CreateTaskDto, UpdateTaskDto } from '@application/dtos/task.dto';

export async function getTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.query['userId'] as string;
    if (!userId) {
      res.status(400).json({ error: 'userId query parameter is required' });
      return;
    }
    const tasks = await makeGetTasksUseCase().execute(userId);
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
}

export async function createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dto = req.body as CreateTaskDto;
    const task = await makeCreateTaskUseCase().execute(dto);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

export async function updateTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const dto = req.body as UpdateTaskDto;
    const task = await makeUpdateTaskUseCase().execute(id, dto);
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    await makeDeleteTaskUseCase().execute(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
