import request from 'supertest';
import app from '../../src/infrastructure/app';
import * as useCaseFactory from '../../src/infrastructure/factories/use-case.factory';
import { TaskResponseDto } from '../../src/application/dtos/task.dto';
import { TaskNotFoundError } from '../../src/domain/errors/domain.errors';

jest.mock('../../src/infrastructure/factories/use-case.factory');

const mockTask: TaskResponseDto = {
  id: 'task-1',
  userId: 'user-1',
  title: 'Test task',
  description: 'Test description',
  completed: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('Tasks API', () => {
  afterEach(() => jest.clearAllMocks());

  describe('GET /api/tasks', () => {
    it('should return 200 with tasks array', async () => {
      const execute = jest.fn().mockResolvedValue([mockTask]);
      jest.spyOn(useCaseFactory, 'makeGetTasksUseCase').mockReturnValue({ execute } as never);

      const res = await request(app).get('/api/tasks').query({ userId: 'user-1' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0]).toMatchObject({ id: 'task-1', userId: 'user-1' });
      expect(execute).toHaveBeenCalledWith('user-1');
    });

    it('should return 200 with empty array when no tasks', async () => {
      const execute = jest.fn().mockResolvedValue([]);
      jest.spyOn(useCaseFactory, 'makeGetTasksUseCase').mockReturnValue({ execute } as never);

      const res = await request(app).get('/api/tasks').query({ userId: 'user-1' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('should return 400 when userId is missing', async () => {
      const res = await request(app).get('/api/tasks');

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/tasks', () => {
    it('should return 201 with created task', async () => {
      const execute = jest.fn().mockResolvedValue(mockTask);
      jest.spyOn(useCaseFactory, 'makeCreateTaskUseCase').mockReturnValue({ execute } as never);

      const res = await request(app)
        .post('/api/tasks')
        .send({ userId: 'user-1', title: 'Test task', description: 'Test description' });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({ id: 'task-1', title: 'Test task', completed: false });
      expect(execute).toHaveBeenCalledWith({
        userId: 'user-1',
        title: 'Test task',
        description: 'Test description',
      });
    });

    it('should return 400 when userId is missing', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'Test task', description: 'desc' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 when title is missing', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ userId: 'user-1', description: 'desc' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 when title is empty', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ userId: 'user-1', title: '', description: 'desc' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should return 200 with updated task', async () => {
      const updated = { ...mockTask, title: 'Updated title' };
      const execute = jest.fn().mockResolvedValue(updated);
      jest.spyOn(useCaseFactory, 'makeUpdateTaskUseCase').mockReturnValue({ execute } as never);

      const res = await request(app)
        .put('/api/tasks/task-1')
        .send({ title: 'Updated title' });

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ title: 'Updated title' });
      expect(execute).toHaveBeenCalledWith('task-1', { title: 'Updated title' });
    });

    it('should return 200 when marking task as completed', async () => {
      const updated = { ...mockTask, completed: true };
      const execute = jest.fn().mockResolvedValue(updated);
      jest.spyOn(useCaseFactory, 'makeUpdateTaskUseCase').mockReturnValue({ execute } as never);

      const res = await request(app)
        .put('/api/tasks/task-1')
        .send({ completed: true });

      expect(res.status).toBe(200);
      expect(res.body.completed).toBe(true);
    });

    it('should return 404 when task does not exist', async () => {
      const execute = jest.fn().mockRejectedValue(new TaskNotFoundError('task-99'));
      jest.spyOn(useCaseFactory, 'makeUpdateTaskUseCase').mockReturnValue({ execute } as never);

      const res = await request(app)
        .put('/api/tasks/task-99')
        .send({ title: 'Updated' });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 when body has no valid fields', async () => {
      const res = await request(app).put('/api/tasks/task-1').send({});

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 when completed is not boolean', async () => {
      const res = await request(app)
        .put('/api/tasks/task-1')
        .send({ completed: 'yes' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should return 204 when task is deleted', async () => {
      const execute = jest.fn().mockResolvedValue(undefined);
      jest.spyOn(useCaseFactory, 'makeDeleteTaskUseCase').mockReturnValue({ execute } as never);

      const res = await request(app).delete('/api/tasks/task-1');

      expect(res.status).toBe(204);
      expect(execute).toHaveBeenCalledWith('task-1');
    });

    it('should return 404 when task does not exist', async () => {
      const execute = jest.fn().mockRejectedValue(new TaskNotFoundError('task-99'));
      jest.spyOn(useCaseFactory, 'makeDeleteTaskUseCase').mockReturnValue({ execute } as never);

      const res = await request(app).delete('/api/tasks/task-99');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });
});
