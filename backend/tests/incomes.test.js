const request = require('supertest');
const app = require('../app');
const { query } = require('../src/config/database');

let token;
let userId;
let incomeId;

describe('Income Endpoints', () => {

  beforeAll(async () => {
    await query("DELETE FROM user_settings WHERE user_id IN (SELECT id FROM users WHERE email = 'income-test@example.com')");
    await query("DELETE FROM users WHERE email = 'income-test@example.com'");

    const signupRes = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Income Test',
        email: 'income-test@example.com',
        password: 'Test123'
      });

    token = signupRes.body.data.token;
    userId = signupRes.body.data.user.id;
  });

  test('POST /api/incomes - should create income', async () => {
    const res = await request(app)
      .post('/api/incomes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        category_id: 1,
        amount: 50.00,
        description: 'Test lunch',
        payment_mode: 'Cash',
        transaction_date: '2025-10-22'
      });

    expect(res.statusCode).toBe(201);
    incomeId = res.body.data.transaction.id;
  });

  test('GET /api/incomes - should list incomes', async () => {
    const res = await request(app)
      .get('/api/incomes')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.incomes).toBeInstanceOf(Array);
  });

  test('PUT /api/incomes/:id - should update income', async () => {
    const res = await request(app)
      .put(`/api/incomes/${incomeId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        amount: 55.00
      });

    expect(res.statusCode).toBe(200);
  });

  test('DELETE /api/incomes/:id - should delete income', async () => {
    const res = await request(app)
      .delete(`/api/incomes/${incomeId}`)
      .set('Authorization', `Bearer ${token}`);

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
