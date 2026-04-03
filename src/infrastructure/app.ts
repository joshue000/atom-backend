import express from 'express';
import helmet from 'helmet';
import { corsMiddleware } from './http/middleware/cors.middleware';
import { errorHandlerMiddleware } from './http/middleware/error-handler.middleware';
import taskRoutes from './http/routes/task.routes';
import userRoutes from './http/routes/user.routes';

const app = express();

app.use(helmet());
app.use(corsMiddleware);
app.use(express.json());

app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use(errorHandlerMiddleware);

export default app;
