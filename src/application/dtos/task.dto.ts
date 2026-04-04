export interface PaginationQueryDto {
  limit: number;
  offset: number;
}

export interface PaginationMetadataDto {
  page: number;
  numberOfPages: number;
  limit: number;
  offset: number;
  total: number;
}

export interface PaginatedResponseDto<T> {
  metadata: PaginationMetadataDto;
  data: T[];
}

export interface CreateTaskDto {
  userId: string;
  title: string;
  description: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface TaskResponseDto {
  id: string;
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}
