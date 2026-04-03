import { ITaskRepository } from '@domain/repositories/task.repository.interface';
import { TaskNotFoundError } from '@domain/errors/domain.errors';

export class DeleteTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(id: string): Promise<void> {
    const task = await this.taskRepository.findById(id);
    if (!task) throw new TaskNotFoundError(id);
    await this.taskRepository.delete(id);
  }
}
