import { ITaskRepository } from '@domain/repositories/task.repository.interface';
import { PaginatedResponseDto, PaginationQueryDto, TaskResponseDto } from '../../dtos/task.dto';

export interface GetTasksQuery extends PaginationQueryDto {
  userId: string;
}

export class GetTasksUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(query: GetTasksQuery): Promise<PaginatedResponseDto<TaskResponseDto>> {
    const { userId, limit, offset } = query;

    const allTasks = await this.taskRepository.findByUserId(userId);

    const sorted = allTasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const total = sorted.length;
    const numberOfPages = total === 0 ? 1 : Math.ceil(total / limit);
    const page = Math.floor(offset / limit) + 1;

    const data = sorted.slice(offset, offset + limit).map((task) => ({
      id: task.id,
      userId: task.userId,
      title: task.title,
      description: task.description,
      completed: task.completed,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    }));

    return {
      metadata: { page, numberOfPages, limit, offset, total },
      data,
    };
  }
}
