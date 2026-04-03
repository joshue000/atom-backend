import { Task } from '../entities/task.entity';

export interface ITaskRepository {
  findByUserId(userId: string): Promise<Task[]>;
  findById(id: string): Promise<Task | null>;
  save(task: Task): Promise<void>;
  update(task: Task): Promise<void>;
  delete(id: string): Promise<void>;
}
