import swaggerJsdoc from 'swagger-jsdoc';
import { version } from '../../../../package.json';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ATOM Task Manager API',
      version,
      description: 'REST API for the ATOM Task Manager application',
    },
    components: {
      schemas: {
        UserResponse: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
            email: { type: 'string', example: 'user@example.com' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateUserRequest: {
          type: 'object',
          required: ['email'],
          properties: {
            email: { type: 'string', example: 'user@example.com' },
          },
        },
        TaskResponse: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
            userId: { type: 'string', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
            title: { type: 'string', example: 'Buy groceries' },
            description: { type: 'string', example: 'Milk, eggs, bread' },
            completed: { type: 'boolean', example: false },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateTaskRequest: {
          type: 'object',
          required: ['userId', 'title', 'description'],
          properties: {
            userId: { type: 'string', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
            title: { type: 'string', example: 'Buy groceries' },
            description: { type: 'string', example: 'Milk, eggs, bread' },
          },
        },
        UpdateTaskRequest: {
          type: 'object',
          properties: {
            title: { type: 'string', example: 'Buy groceries' },
            description: { type: 'string', example: 'Milk, eggs, bread' },
            completed: { type: 'boolean', example: true },
          },
        },
        PaginationMetadata: {
          type: 'object',
          properties: {
            page: { type: 'integer', example: 1 },
            numberOfPages: { type: 'integer', example: 5 },
            limit: { type: 'integer', example: 5 },
            offset: { type: 'integer', example: 0 },
            total: { type: 'integer', example: 23 },
          },
        },
        PaginatedTasksResponse: {
          type: 'object',
          properties: {
            metadata: { $ref: '#/components/schemas/PaginationMetadata' },
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/TaskResponse' },
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Something went wrong' },
          },
        },
      },
    },
  },
  apis: [`${__dirname}/../routes/*.ts`, `${__dirname}/../routes/*.js`],
};

export const swaggerSpec = swaggerJsdoc(options);
