const { query } = require('../config/database');

const createExpense = async (req, res, next) => {
  try {
    const { category_id, amount, description, payment_mode, transaction_date } = req.body;
    const result = await query(
      `INSERT INTO transactions (user_id, category_id, type, amount, description, payment_mode, transaction_date)
       VALUES ($1, $2, 'expense', $3, $4, $5, $6) RETURNING *`,
      [req.user.id, category_id, amount, description, payment_mode, transaction_date]
    );
    res.status(201).json({ success: true, data: { transaction: result.rows[0] } });
  } catch (error) {
    next(error);
  }
};

const getExpenses = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category_id, start_date, end_date, search } = req.query;
    const offset = (page - 1) * limit;
    let sql = `SELECT t.*, c.name as category_name FROM transactions t JOIN categories c ON t.category_id = c.id 
               WHERE t.user_id = $1 AND t.type = 'expense' AND t.deleted_at IS NULL`;
    const params = [req.user.id];
    let idx = 2;

    if (category_id) { sql += ` AND t.category_id = $${idx++}`; params.push(category_id); }
    if (start_date) { sql += ` AND t.transaction_date >= $${idx++}`; params.push(start_date); }
    if (end_date) { sql += ` AND t.transaction_date <= $${idx++}`; params.push(end_date); }
    if (search) { sql += ` AND t.description ILIKE $${idx++}`; params.push(`%${search}%`); }

    const countResult = await query(sql.replace('SELECT t.*, c.name as category_name', 'SELECT COUNT(*)'), params);
    sql += ` ORDER BY t.transaction_date DESC LIMIT $${idx++} OFFSET $${idx}`;
    params.push(limit, offset);

    const result = await query(sql, params);
    res.json({ success: true, data: { expenses: result.rows, pagination: { page: +page, limit: +limit, total: +countResult.rows[0].count } } });
  } catch (error) {
    next(error);
  }
};

const getExpenseById = async (req, res, next) => {
  try {
    const result = await query(
      'SELECT * FROM transactions WHERE id = $1 AND user_id = $2 AND type = \'expense\' AND deleted_at IS NULL',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: { expense: result.rows[0] } });
  } catch (error) {
    next(error);
  }
};

const updateExpense = async (req, res, next) => {
  try {
    const { category_id, amount, description, payment_mode, transaction_date } = req.body;
    const updates = [];
    const values = [];
    let idx = 1;

    if (category_id !== undefined) { updates.push(`category_id = $${idx++}`); values.push(category_id); }
    if (amount !== undefined) { updates.push(`amount = $${idx++}`); values.push(amount); }
    if (description !== undefined) { updates.push(`description = $${idx++}`); values.push(description); }
    if (payment_mode !== undefined) { updates.push(`payment_mode = $${idx++}`); values.push(payment_mode); }
    if (transaction_date !== undefined) { updates.push(`transaction_date = $${idx++}`); values.push(transaction_date); }

    values.push(req.params.id, req.user.id);
    const result = await query(
      `UPDATE transactions SET ${updates.join(', ')}, updated_at = NOW() 
       WHERE id = $${idx++} AND user_id = $${idx} AND type = 'expense' RETURNING *`,
      values
    );

    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: { expense: result.rows[0] } });
  } catch (error) {
    next(error);
  }
};

const deleteExpense = async (req, res, next) => {
  try {
    const result = await query(
      'UPDATE transactions SET deleted_at = NOW() WHERE id = $1 AND user_id = $2 AND type = \'expense\' RETURNING id',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createExpense, getExpenses, getExpenseById, updateExpense, deleteExpense };
