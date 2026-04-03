import * as admin from 'firebase-admin';

let app: admin.app.App | null = null;

export function getFirebaseApp(): admin.app.App {
  if (!app) {
    app = admin.apps.length ? admin.app() : admin.initializeApp();
  }
  return app;
}
