import { GetUserByEmailUseCase } from '../../../../src/application/use-cases/users/get-user-by-email.use-case';
import { IUserRepository } from '../../../../src/domain/repositories/user.repository.interface';
import { User } from '../../../../src/domain/entities/user.entity';

describe('GetUserByEmailUseCase', () => {
  let repository: jest.Mocked<IUserRepository>;
  let useCase: GetUserByEmailUseCase;

  beforeEach(() => {
    repository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
    };
    useCase = new GetUserByEmailUseCase(repository);
  });

  it('should return user DTO when user exists', async () => {
    const user = User.reconstitute({
      id: 'user-1',
      email: 'test@example.com',
      createdAt: new Date('2024-01-01'),
    });
    repository.findByEmail.mockResolvedValue(user);

    const result = await useCase.execute('test@example.com');

    expect(result).not.toBeNull();
    expect(result!.id).toBe('user-1');
    expect(result!.email).toBe('test@example.com');
    expect(typeof result!.createdAt).toBe('string');
  });

  it('should normalize email to lowercase before searching', async () => {
    repository.findByEmail.mockResolvedValue(null);

    await useCase.execute('TEST@EXAMPLE.COM');

    expect(repository.findByEmail).toHaveBeenCalledWith('test@example.com');
  });

  it('should return null when user does not exist', async () => {
    repository.findByEmail.mockResolvedValue(null);

    const result = await useCase.execute('unknown@example.com');

    expect(result).toBeNull();
  });
});
