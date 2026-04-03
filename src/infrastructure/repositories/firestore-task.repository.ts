import { ITaskRepository } from '@domain/repositories/task.repository.interface';
import { Task } from '@domain/entities/task.entity';
import { getFirestore } from '../firebase/firestore.client';

export class FirestoreTaskRepository implements ITaskRepository {
  private readonly collection = 'tasks';

  async findByUserId(userId: string): Promise<Task[]> {
    const db = getFirestore();
    const snapshot = await db
      .collection(this.collection)
      .where('userId', '==', userId)
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return Task.reconstitute({
        id: doc.id,
        userId: data['userId'],
        title: data['title'],
        description: data['description'],
        completed: data['completed'],
        createdAt: data['createdAt'].toDate(),
        updatedAt: data['updatedAt'].toDate(),
      });
    });
  }

  async findById(id: string): Promise<Task | null> {
    const db = getFirestore();
    const doc = await db.collection(this.collection).doc(id).get();
    if (!doc.exists) return null;

    const data = doc.data()!;
    return Task.reconstitute({
      id: doc.id,
      userId: data['userId'],
      title: data['title'],
      description: data['description'],
      completed: data['completed'],
      createdAt: data['createdAt'].toDate(),
      updatedAt: data['updatedAt'].toDate(),
    });
  }

  async save(task: Task): Promise<void> {
    const db = getFirestore();
    await db.collection(this.collection).doc(task.id).set({
      userId: task.userId,
      title: task.title,
      description: task.description,
      completed: task.completed,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    });
  }

  async update(task: Task): Promise<void> {
    const db = getFirestore();
    await db.collection(this.collection).doc(task.id).update({
      title: task.title,
      description: task.description,
      completed: task.completed,
      updatedAt: task.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    const db = getFirestore();
    await db.collection(this.collection).doc(id).delete();
  }
}
