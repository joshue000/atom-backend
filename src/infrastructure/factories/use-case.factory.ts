import { GetTasksUseCase } from '@application/use-cases/tasks/get-tasks.use-case';
import { CreateTaskUseCase } from '@application/use-cases/tasks/create-task.use-case';
import { UpdateTaskUseCase } from '@application/use-cases/tasks/update-task.use-case';
import { DeleteTaskUseCase } from '@application/use-cases/tasks/delete-task.use-case';
import { GetUserByEmailUseCase } from '@application/use-cases/users/get-user-by-email.use-case';
import { CreateUserUseCase } from '@application/use-cases/users/create-user.use-case';
import { getTaskRepository, getUserRepository } from './repository.factory';

export function makeGetTasksUseCase(): GetTasksUseCase {
  return new GetTasksUseCase(getTaskRepository());
}

export function makeCreateTaskUseCase(): CreateTaskUseCase {
  return new CreateTaskUseCase(getTaskRepository());
}

export function makeUpdateTaskUseCase(): UpdateTaskUseCase {
  return new UpdateTaskUseCase(getTaskRepository());
}

export function makeDeleteTaskUseCase(): DeleteTaskUseCase {
  return new DeleteTaskUseCase(getTaskRepository());
}

export function makeGetUserByEmailUseCase(): GetUserByEmailUseCase {
  return new GetUserByEmailUseCase(getUserRepository());
}

export function makeCreateUserUseCase(): CreateUserUseCase {
  return new CreateUserUseCase(getUserRepository());
}
