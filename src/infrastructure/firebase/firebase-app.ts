import * as admin from 'firebase-admin';

let app: admin.app.App | null = null;

export function getFirebaseApp(): admin.app.App {
  if (!app) {
    const projectId = process.env['GOOGLE_CLOUD_PROJECT'];
    app = admin.apps.length
      ? admin.app()
      : admin.initializeApp(projectId ? { projectId } : undefined);
  }
  return app;
}
