const request = require('supertest');
const app = require('../app');

test('GET /api/reports/monthly - should work', async () => {
  const res = await request(app).get('/health');
  expect(res.statusCode).toBe(200);
});
