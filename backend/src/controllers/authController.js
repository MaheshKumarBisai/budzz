const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { query } = require('../config/database');
const { generateToken } = require('../config/jwt');

// Signup
const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );

    const user = result.rows[0];
    await query('INSERT INTO user_settings (user_id) VALUES ($1)', [user.id]);

    const token = generateToken({ userId: user.id, email: user.email });
    res.status(201).json({ success: true, data: { user, token } });
  } catch (error) {
    next(error);
  }
};

// Login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await query(
      'SELECT id, name, email, password FROM users WHERE email = $1 AND deleted_at IS NULL',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken({ userId: user.id, email: user.email });
    res.json({ success: true, data: { user: { id: user.id, name: user.name, email: user.email }, token } });
  } catch (error) {
    next(error);
  }
};

// Forgot Password
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await query('SELECT id FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expiry = new Date(Date.now() + 3600000);

    await query('UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE id = $3',
      [hashedToken, expiry, result.rows[0].id]);

    res.json({ success: true, message: 'Reset token sent', data: { resetToken } });
  } catch (error) {
    next(error);
  }
};

// Reset Password
const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const result = await query(
      'SELECT id FROM users WHERE reset_token = $1 AND reset_token_expiry > NOW()',
      [hashedToken]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await query('UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2',
      [hashedPassword, result.rows[0].id]);

    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};

module.exports = { signup, login, forgotPassword, resetPassword, logout };
