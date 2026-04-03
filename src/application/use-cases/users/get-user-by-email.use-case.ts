import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { UserResponseDto } from '../../dtos/user.dto';

export class GetUserByEmailUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(email: string): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findByEmail(email.toLowerCase().trim());
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
