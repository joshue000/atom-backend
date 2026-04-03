import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { User } from '@domain/entities/user.entity';
import { getFirestore } from '../firebase/firestore.client';

export class FirestoreUserRepository implements IUserRepository {
  private readonly collection = 'users';

  async findByEmail(email: string): Promise<User | null> {
    const db = getFirestore();
    const snapshot = await db
      .collection(this.collection)
      .where('email', '==', email.toLowerCase().trim())
      .limit(1)
      .get();

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    const data = doc.data();
    return User.reconstitute({
      id: doc.id,
      email: data['email'],
      createdAt: data['createdAt'].toDate(),
    });
  }

  async findById(id: string): Promise<User | null> {
    const db = getFirestore();
    const doc = await db.collection(this.collection).doc(id).get();
    if (!doc.exists) return null;

    const data = doc.data()!;
    return User.reconstitute({
      id: doc.id,
      email: data['email'],
      createdAt: data['createdAt'].toDate(),
    });
  }

  async save(user: User): Promise<void> {
    const db = getFirestore();
    await db.collection(this.collection).doc(user.id).set({
      email: user.email,
      createdAt: user.createdAt,
    });
  }
}
