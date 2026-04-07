import * as admin from 'firebase-admin';

let app: admin.app.App | null = null;

export function getFirebaseApp(): admin.app.App {
  if (!app) {
    const isEmulator = !!process.env['FIRESTORE_EMULATOR_HOST'];
    const projectId = process.env['GOOGLE_CLOUD_PROJECT'];
    app = admin.apps.length
      ? admin.app()
      : admin.initializeApp(isEmulator && projectId ? { projectId } : undefined);
  }
  return app;
}
