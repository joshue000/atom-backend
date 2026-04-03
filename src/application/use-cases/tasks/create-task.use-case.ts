import { ITaskRepository } from '@domain/repositories/task.repository.interface';
import { Task } from '@domain/entities/task.entity';
import { CreateTaskDto, TaskResponseDto } from '../../dtos/task.dto';

export class CreateTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(dto: CreateTaskDto): Promise<TaskResponseDto> {
    const task = Task.create({
      id: crypto.randomUUID(),
      userId: dto.userId,
      title: dto.title.trim(),
      description: dto.description.trim(),
      completed: false,
    });

    await this.taskRepository.save(task);

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
