import { UpdateTaskUseCase } from '../../../../src/application/use-cases/tasks/update-task.use-case';
import { ITaskRepository } from '../../../../src/domain/repositories/task.repository.interface';
import { Task } from '../../../../src/domain/entities/task.entity';
import { TaskNotFoundError } from '../../../../src/domain/errors/domain.errors';

const makeTask = (overrides: Partial<Parameters<typeof Task.reconstitute>[0]> = {}): Task =>
  Task.reconstitute({
    id: 'task-1',
    userId: 'user-1',
    title: 'Original',
    description: 'Original desc',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

describe('UpdateTaskUseCase', () => {
  let repository: jest.Mocked<ITaskRepository>;
  let useCase: UpdateTaskUseCase;

  beforeEach(() => {
    repository = {
      findByUserId: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new UpdateTaskUseCase(repository);
  });

  it('should update title and description', async () => {
    repository.findById.mockResolvedValue(makeTask());
    repository.update.mockResolvedValue(undefined);

    const result = await useCase.execute('task-1', {
      title: 'New title',
      description: 'New desc',
    });

    expect(result.title).toBe('New title');
    expect(result.description).toBe('New desc');
    expect(repository.update).toHaveBeenCalledTimes(1);
  });

  it('should mark task as completed', async () => {
    repository.findById.mockResolvedValue(makeTask());
    repository.update.mockResolvedValue(undefined);

    const result = await useCase.execute('task-1', { completed: true });

    expect(result.completed).toBe(true);
  });

  it('should reopen a completed task', async () => {
    repository.findById.mockResolvedValue(makeTask({ completed: true }));
    repository.update.mockResolvedValue(undefined);

    const result = await useCase.execute('task-1', { completed: false });

    expect(result.completed).toBe(false);
  });

  it('should throw TaskNotFoundError when task does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(useCase.execute('nonexistent', { title: 'x' })).rejects.toThrow(TaskNotFoundError);
  });
});
