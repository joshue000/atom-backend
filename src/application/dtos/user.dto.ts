export interface CreateUserDto {
  email: string;
}

export interface UserResponseDto {
  id: string;
  email: string;
  createdAt: string;
}
