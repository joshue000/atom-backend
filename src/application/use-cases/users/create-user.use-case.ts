import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { User } from '@domain/entities/user.entity';
import { UserAlreadyExistsError } from '@domain/errors/domain.errors';
import { CreateUserDto, UserResponseDto } from '../../dtos/user.dto';

export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    const existing = await this.userRepository.findByEmail(dto.email.toLowerCase().trim());
    if (existing) throw new UserAlreadyExistsError(dto.email);

    const user = User.create(dto.email, crypto.randomUUID());
    await this.userRepository.save(user);

    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
