import request from 'supertest';
import app from '../../src/infrastructure/app';

describe('Health & Error Handling', () => {
  describe('GET /api/health', () => {
    it('should return 200 with status, version and date', async () => {
      const res = await request(app).get('/api/health');

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ status: 'ok' });
      expect(res.body).toHaveProperty('version');
      expect(res.body).toHaveProperty('date');
      expect(new Date(res.body.date as string).toISOString()).toBe(res.body.date);
    });
  });

  describe('Unknown routes', () => {
    it('should return 404 for undefined GET route', async () => {
      const res = await request(app).get('/api/undefined-route');

      expect(res.status).toBe(404);
    });
  });
});
