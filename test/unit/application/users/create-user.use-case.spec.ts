import { CreateUserUseCase } from '../../../../src/application/use-cases/users/create-user.use-case';
import { IUserRepository } from '../../../../src/domain/repositories/user.repository.interface';
import { User } from '../../../../src/domain/entities/user.entity';
import { UserAlreadyExistsError } from '../../../../src/domain/errors/domain.errors';

describe('CreateUserUseCase', () => {
  let repository: jest.Mocked<IUserRepository>;
  let useCase: CreateUserUseCase;

  beforeEach(() => {
    repository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
    };
    useCase = new CreateUserUseCase(repository);
  });

  it('should create and return a new user', async () => {
    repository.findByEmail.mockResolvedValue(null);
    repository.save.mockResolvedValue(undefined);

    const result = await useCase.execute({ email: 'new@example.com' });

    expect(repository.save).toHaveBeenCalledTimes(1);
    expect(result.email).toBe('new@example.com');
    expect(typeof result.id).toBe('string');
    expect(typeof result.createdAt).toBe('string');
  });

  it('should throw UserAlreadyExistsError when user already exists', async () => {
    const existing = User.reconstitute({
      id: 'existing-id',
      email: 'exists@example.com',
      createdAt: new Date(),
    });
    repository.findByEmail.mockResolvedValue(existing);

    await expect(useCase.execute({ email: 'exists@example.com' })).rejects.toThrow(
      UserAlreadyExistsError
    );
    expect(repository.save).not.toHaveBeenCalled();
  });
});
