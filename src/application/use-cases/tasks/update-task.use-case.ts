import { ITaskRepository } from '@domain/repositories/task.repository.interface';
import { TaskNotFoundError } from '@domain/errors/domain.errors';
import { UpdateTaskDto, TaskResponseDto } from '../../dtos/task.dto';

export class UpdateTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(id: string, dto: UpdateTaskDto): Promise<TaskResponseDto> {
    let task = await this.taskRepository.findById(id);
    if (!task) throw new TaskNotFoundError(id);

    if (dto.title !== undefined || dto.description !== undefined) {
      task = task.updateDetails(
        dto.title ?? task.title,
        dto.description ?? task.description
      );
    }

    if (dto.completed !== undefined) {
      task = dto.completed ? task.complete() : task.reopen();
    }

    await this.taskRepository.update(task);

    return {
      id: task.id,
      userId: task.userId,
      title: task.title,
      description: task.description,
      completed: task.completed,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    };
  }
}
