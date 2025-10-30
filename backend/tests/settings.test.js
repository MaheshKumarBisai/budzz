const request = require('supertest');
const app = require('../app');

test('GET /health - should work', async () => {
  const res = await request(app).get('/health');
  expect(res.statusCode).toBe(200);
});
