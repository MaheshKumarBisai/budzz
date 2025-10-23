const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';
const JWT_EXPIRES_IN = '7d';
const RESET_TOKEN_EXPIRES_IN = '1h';

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Generate password reset token
const generateResetToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: RESET_TOKEN_EXPIRES_IN });
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

module.exports = {
  generateToken,
  generateResetToken,
  verifyToken,
  JWT_SECRET,
};
