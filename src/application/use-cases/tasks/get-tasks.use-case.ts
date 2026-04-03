import { ITaskRepository } from '@domain/repositories/task.repository.interface';
import { TaskResponseDto } from '../../dtos/task.dto';

export class GetTasksUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(userId: string): Promise<TaskResponseDto[]> {
    const tasks = await this.taskRepository.findByUserId(userId);

    return tasks
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map((task) => ({
        id: task.id,
        userId: task.userId,
        title: task.title,
        description: task.description,
        completed: task.completed,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
      }));
  }
}
