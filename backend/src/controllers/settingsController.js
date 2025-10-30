const { query } = require('../config/database');

const getSettings = async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM user_settings WHERE user_id = $1', [req.user.id]);
    res.json({ success: true, data: { settings: result.rows[0] } });
  } catch (error) {
    next(error);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    const { currency, budget_limit, theme } = req.body;
    const updates = [];
    const values = [];
    let idx = 1;

    if (currency) { updates.push(`currency = $${idx++}`); values.push(currency); }
    if (budget_limit !== undefined) { updates.push(`budget_limit = $${idx++}`); values.push(budget_limit); }
    if (theme) { updates.push(`theme = $${idx++}`); values.push(theme); }

    if (updates.length === 0) return res.status(400).json({ success: false, message: 'No updates' });

    values.push(req.user.id);
    const result = await query(
      `UPDATE user_settings SET ${updates.join(', ')}, updated_at = NOW() WHERE user_id = $${idx} RETURNING *`,
      values
    );
    res.json({ success: true, data: { settings: result.rows[0] } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSettings, updateSettings };
