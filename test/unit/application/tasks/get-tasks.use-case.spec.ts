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

const DEFAULT_QUERY = { userId: 'user-1', limit: 10, offset: 0 };

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

    const result = await useCase.execute(DEFAULT_QUERY);

    expect(result.data).toHaveLength(2);
    expect(result.data[0].id).toBe('task-2');
    expect(result.data[1].id).toBe('task-1');
  });

  it('should map tasks to DTOs with ISO date strings', async () => {
    const task = makeTask('task-1', new Date('2024-01-01'));
    repository.findByUserId.mockResolvedValue([task]);

    const result = await useCase.execute(DEFAULT_QUERY);

    expect(typeof result.data[0].createdAt).toBe('string');
    expect(result.data[0].createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('should return correct metadata for a single page', async () => {
    const tasks = [makeTask('task-1', new Date())];
    repository.findByUserId.mockResolvedValue(tasks);

    const result = await useCase.execute({ userId: 'user-1', limit: 10, offset: 0 });

    expect(result.metadata).toMatchObject({
      page: 1,
      numberOfPages: 1,
      limit: 10,
      offset: 0,
      total: 1,
    });
  });

  it('should return correct metadata when paginating', async () => {
    const tasks = Array.from({ length: 25 }, (_, i) =>
      makeTask(`task-${i}`, new Date(2024, 0, i + 1)),
    );
    repository.findByUserId.mockResolvedValue(tasks);

    const result = await useCase.execute({ userId: 'user-1', limit: 10, offset: 10 });

    expect(result.metadata).toMatchObject({
      page: 2,
      numberOfPages: 3,
      limit: 10,
      offset: 10,
      total: 25,
    });
    expect(result.data).toHaveLength(10);
  });

  it('should return only remaining tasks on the last page', async () => {
    const tasks = Array.from({ length: 25 }, (_, i) =>
      makeTask(`task-${i}`, new Date(2024, 0, i + 1)),
    );
    repository.findByUserId.mockResolvedValue(tasks);

    const result = await useCase.execute({ userId: 'user-1', limit: 10, offset: 20 });

    expect(result.data).toHaveLength(5);
    expect(result.metadata.page).toBe(3);
    expect(result.metadata.numberOfPages).toBe(3);
  });

  it('should return empty data and 1 page when user has no tasks', async () => {
    repository.findByUserId.mockResolvedValue([]);

    const result = await useCase.execute(DEFAULT_QUERY);

    expect(result.data).toEqual([]);
    expect(result.metadata).toMatchObject({
      page: 1,
      numberOfPages: 1,
      total: 0,
    });
  });
});
