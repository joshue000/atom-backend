import { onRequest } from 'firebase-functions/v2/https';
import app from './infrastructure/app';

export const api = onRequest(
  {
    region: 'southamerica-east1',
    memory: '256MiB',
    timeoutSeconds: 60,
  },
  app,
);
