const { query } = require('../config/database');

const getProfile = async (req, res, next) => {
  try {
    const result = await query('SELECT id, name, email, created_at FROM users WHERE id = $1', [req.user.id]);
    res.json({ success: true, data: { user: result.rows[0] } });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const updates = [];
    const values = [];
    let idx = 1;

    if (name) { updates.push(`name = $${idx++}`); values.push(name); }
    if (email) { updates.push(`email = $${idx++}`); values.push(email); }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No updates provided' });
    }

    values.push(req.user.id);
    const result = await query(
      `UPDATE users SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${idx} RETURNING id, name, email`,
      values
    );

    res.json({ success: true, data: { user: result.rows[0] } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile };
