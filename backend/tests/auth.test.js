const request = require('supertest');
const app = require('../app');
const { query } = require('../src/config/database');

describe('Auth Endpoints', () => {
  let userId;
  let resetToken;

  beforeAll(async () => {
    await query("DELETE FROM user_settings WHERE user_id IN (SELECT id FROM users WHERE email = 'test@example.com')");
    await query("DELETE FROM users WHERE email = 'test@example.com'");
  });

  test('POST /api/auth/signup - should create user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Test123'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
    userId = res.body.data.user.id;
  });

  test('POST /api/auth/login - should login user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'Test123'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('POST /api/auth/forgot - should send reset token', async () => {
    const res = await request(app)
      .post('/api/auth/forgot')
      .send({
        email: 'test@example.com'
      });

    expect(res.statusCode).toBe(200);
    resetToken = res.body.data.resetToken;
  });

  test('POST /api/auth/reset - should reset password', async () => {
    const res = await request(app)
      .post('/api/auth/reset')
      .send({
        token: resetToken,
        password: 'NewTest123'
      });

    expect(res.statusCode).toBe(200);
  });

  afterAll(async () => {
    if (userId) {
      await query('DELETE FROM transactions WHERE user_id = $1', [userId]);
      await query('DELETE FROM user_settings WHERE user_id = $1', [userId]);
      await query('DELETE FROM users WHERE id = $1', [userId]);
    }
  });
});
