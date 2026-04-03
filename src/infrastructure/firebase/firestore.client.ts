import type { Firestore } from 'firebase-admin/firestore';
import { getFirebaseApp } from './firebase-app';

let firestoreInstance: Firestore | null = null;

export function getFirestore(): Firestore {
  if (!firestoreInstance) {
    const app = getFirebaseApp();
    firestoreInstance = app.firestore();
  }
  return firestoreInstance;
}
