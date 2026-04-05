import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { version } from '../../package.json';
import { corsMiddleware } from './http/middleware/cors.middleware';
import { errorHandlerMiddleware } from './http/middleware/error-handler.middleware';
import taskRoutes from './http/routes/task.routes';
import userRoutes from './http/routes/user.routes';
import { swaggerSpec } from './http/swagger/swagger.config';

const app = express();

app.use(helmet());
app.use(corsMiddleware);
app.use(express.json());

app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', version, date: new Date().toISOString() });
});

// API docs — only available outside production
if (process.env['NODE_ENV'] !== 'production') {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

app.use(errorHandlerMiddleware);

export default app;
