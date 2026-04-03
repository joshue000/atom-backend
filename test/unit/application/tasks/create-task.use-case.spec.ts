import { CreateTaskUseCase } from '../../../../src/application/use-cases/tasks/create-task.use-case';
import { ITaskRepository } from '../../../../src/domain/repositories/task.repository.interface';

describe('CreateTaskUseCase', () => {
  let repository: jest.Mocked<ITaskRepository>;
  let useCase: CreateTaskUseCase;

  beforeEach(() => {
    repository = {
      findByUserId: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new CreateTaskUseCase(repository);
  });

  it('should create a task and persist it', async () => {
    repository.save.mockResolvedValue(undefined);

    const result = await useCase.execute({
      userId: 'user-1',
      title: '  Buy groceries  ',
      description: 'Milk, bread',
    });

    expect(repository.save).toHaveBeenCalledTimes(1);
    expect(result.title).toBe('Buy groceries'); // trimmed
    expect(result.description).toBe('Milk, bread');
    expect(result.completed).toBe(false);
    expect(result.userId).toBe('user-1');
    expect(typeof result.id).toBe('string');
  });

  it('should return DTO with ISO date strings', async () => {
    repository.save.mockResolvedValue(undefined);

    const result = await useCase.execute({
      userId: 'user-1',
      title: 'Task',
      description: 'Desc',
    });

    expect(result.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(result.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});
