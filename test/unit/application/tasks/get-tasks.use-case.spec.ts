import { GetTasksUseCase } from '../../../../src/application/use-cases/tasks/get-tasks.use-case';
import { ITaskRepository } from '../../../../src/domain/repositories/task.repository.interface';
import { Task } from '../../../../src/domain/entities/task.entity';

const makeTask = (id: string, createdAt: Date): Task =>
  Task.reconstitute({
    id,
    userId: 'user-1',
    title: `Task ${id}`,
    description: 'desc',
    completed: false,
    createdAt,
    updatedAt: new Date(),
  });

describe('GetTasksUseCase', () => {
  let repository: jest.Mocked<ITaskRepository>;
  let useCase: GetTasksUseCase;

  beforeEach(() => {
    repository = {
      findByUserId: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new GetTasksUseCase(repository);
  });

  it('should return tasks sorted by createdAt descending', async () => {
    const older = makeTask('task-1', new Date('2024-01-01'));
    const newer = makeTask('task-2', new Date('2024-01-02'));
    repository.findByUserId.mockResolvedValue([older, newer]);

    const result = await useCase.execute('user-1');

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('task-2'); // newest first
    expect(result[1].id).toBe('task-1');
  });

  it('should map tasks to DTOs with ISO date strings', async () => {
    const task = makeTask('task-1', new Date('2024-01-01'));
    repository.findByUserId.mockResolvedValue([task]);

    const result = await useCase.execute('user-1');

    expect(typeof result[0].createdAt).toBe('string');
    expect(result[0].createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('should return empty array when user has no tasks', async () => {
    repository.findByUserId.mockResolvedValue([]);

    const result = await useCase.execute('user-1');

    expect(result).toEqual([]);
  });
});
