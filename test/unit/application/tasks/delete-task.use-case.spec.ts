import { DeleteTaskUseCase } from '../../../../src/application/use-cases/tasks/delete-task.use-case';
import { ITaskRepository } from '../../../../src/domain/repositories/task.repository.interface';
import { Task } from '../../../../src/domain/entities/task.entity';
import { TaskNotFoundError } from '../../../../src/domain/errors/domain.errors';

describe('DeleteTaskUseCase', () => {
  let repository: jest.Mocked<ITaskRepository>;
  let useCase: DeleteTaskUseCase;

  beforeEach(() => {
    repository = {
      findByUserId: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new DeleteTaskUseCase(repository);
  });

  it('should delete an existing task', async () => {
    const task = Task.reconstitute({
      id: 'task-1',
      userId: 'user-1',
      title: 'Task',
      description: 'Desc',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    repository.findById.mockResolvedValue(task);
    repository.delete.mockResolvedValue(undefined);

    await expect(useCase.execute('task-1')).resolves.toBeUndefined();
    expect(repository.delete).toHaveBeenCalledWith('task-1');
  });

  it('should throw TaskNotFoundError when task does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(useCase.execute('nonexistent')).rejects.toThrow(TaskNotFoundError);
    expect(repository.delete).not.toHaveBeenCalled();
  });
});
