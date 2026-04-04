import request from 'supertest';
import app from '../../src/infrastructure/app';
import * as useCaseFactory from '../../src/infrastructure/factories/use-case.factory';
import { UserResponseDto } from '../../src/application/dtos/user.dto';
import { UserAlreadyExistsError } from '../../src/domain/errors/domain.errors';

jest.mock('../../src/infrastructure/factories/use-case.factory');

const mockUser: UserResponseDto = {
  id: 'user-1',
  email: 'test@example.com',
  createdAt: new Date().toISOString(),
};

describe('Users API', () => {
  afterEach(() => jest.clearAllMocks());

  describe('GET /api/users/:email', () => {
    it('should return 200 with user when found', async () => {
      const execute = jest.fn().mockResolvedValue(mockUser);
      jest.spyOn(useCaseFactory, 'makeGetUserByEmailUseCase').mockReturnValue({ execute } as never);

      const res = await request(app).get('/api/users/test%40example.com');

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ id: 'user-1', email: 'test@example.com' });
      expect(execute).toHaveBeenCalledWith('test@example.com');
    });

    it('should return 404 when user is not found', async () => {
      const execute = jest.fn().mockResolvedValue(null);
      jest.spyOn(useCaseFactory, 'makeGetUserByEmailUseCase').mockReturnValue({ execute } as never);

      const res = await request(app).get('/api/users/unknown%40example.com');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/users', () => {
    it('should return 201 with created user', async () => {
      const execute = jest.fn().mockResolvedValue(mockUser);
      jest.spyOn(useCaseFactory, 'makeCreateUserUseCase').mockReturnValue({ execute } as never);

      const res = await request(app)
        .post('/api/users')
        .send({ email: 'test@example.com' });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({ id: 'user-1', email: 'test@example.com' });
      expect(execute).toHaveBeenCalledWith({ email: 'test@example.com' });
    });

    it('should return 400 when email is missing', async () => {
      const res = await request(app).post('/api/users').send({});

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 when email format is invalid', async () => {
      const res = await request(app).post('/api/users').send({ email: 'not-an-email' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 409 when user already exists', async () => {
      const execute = jest.fn().mockRejectedValue(new UserAlreadyExistsError('test@example.com'));
      jest.spyOn(useCaseFactory, 'makeCreateUserUseCase').mockReturnValue({ execute } as never);

      const res = await request(app)
        .post('/api/users')
        .send({ email: 'test@example.com' });

      expect(res.status).toBe(409);
      expect(res.body).toHaveProperty('error');
    });
  });
});
