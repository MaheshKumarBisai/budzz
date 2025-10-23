const request = require('supertest');
const app = require('../app');
const { query } = require('../src/config/database');

let token;
let userId;
let expenseId;

describe('Expense Endpoints', () => {

  beforeAll(async () => {
    await query("DELETE FROM user_settings WHERE user_id IN (SELECT id FROM users WHERE email = 'expense-test@example.com')");
    await query("DELETE FROM users WHERE email = 'expense-test@example.com'");

    const signupRes = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Expense Test',
        email: 'expense-test@example.com',
        password: 'Test123'
      });

    token = signupRes.body.data.token;
    userId = signupRes.body.data.user.id;
  });

  test('POST /api/expenses - should create expense', async () => {
    const res = await request(app)
      .post('/api/expenses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        category_id: 4,
        amount: 50.00,
        description: 'Test lunch',
        payment_mode: 'Cash',
        transaction_date: '2025-10-22'
      });

    expect(res.statusCode).toBe(201);
    expenseId = res.body.data.transaction.id;
  });

  test('GET /api/expenses - should list expenses', async () => {
    const res = await request(app)
      .get('/api/expenses')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.expenses).toBeInstanceOf(Array);
  });

  test('PUT /api/expenses/:id - should update expense', async () => {
    const res = await request(app)
      .put(`/api/expenses/${expenseId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        amount: 55.00
      });

    expect(res.statusCode).toBe(200);
  });

  test('DELETE /api/expenses/:id - should delete expense', async () => {
    const res = await request(app)
      .delete(`/api/expenses/${expenseId}`)
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
