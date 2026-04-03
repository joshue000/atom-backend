import { ITaskRepository } from '@domain/repositories/task.repository.interface';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { FirestoreTaskRepository } from '../repositories/firestore-task.repository';
import { FirestoreUserRepository } from '../repositories/firestore-user.repository';

// Singleton instances — created once per Cloud Function warm instance
let taskRepository: ITaskRepository | null = null;
let userRepository: IUserRepository | null = null;

export function getTaskRepository(): ITaskRepository {
  if (!taskRepository) {
    taskRepository = new FirestoreTaskRepository();
  }
  return taskRepository;
}

export function getUserRepository(): IUserRepository {
  if (!userRepository) {
    userRepository = new FirestoreUserRepository();
  }
  return userRepository;
}
