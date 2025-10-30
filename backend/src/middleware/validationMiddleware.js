const { body, param, query, validationResult } = require('express-validator');

// Validation error handler
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path || err.param,
        message: err.msg
      }))
    });
  }
  next();
};

// Auth validation rules
const signupValidation = [
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email').trim().isEmail().withMessage('Invalid email address')
    .normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase, and number'),
  validate
];

const loginValidation = [
  body('email').trim().isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

const forgotPasswordValidation = [
  body('email').trim().isEmail().withMessage('Invalid email address').normalizeEmail(),
  validate
];

const resetPasswordValidation = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate
];

// Transaction validation rules
const transactionValidation = [
  body('category_id').optional({ nullable: true }).isInt({ min: 1 }).withMessage('Valid category is required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description too long'),
  body('payment_mode').optional().trim().isLength({ max: 50 }),
  body('transaction_date').isISO8601().withMessage('Valid date required (YYYY-MM-DD)'),
  validate
];

// Settings validation
const settingsValidation = [
  body('currency').optional().isLength({ min: 3, max: 10 }).withMessage('Invalid currency code'),
  body('budget_limit').optional().isFloat({ min: 0 }).withMessage('Budget limit must be positive'),
  body('theme').optional().isIn(['light', 'dark']).withMessage('Theme must be light or dark'),
  validate
];

// Profile validation
const profileValidation = [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email').optional().trim().isEmail().withMessage('Invalid email address').normalizeEmail(),
  validate
];

// Query validation
const paginationValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be >= 1'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
  validate
];

module.exports = {
  validate,
  signupValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  transactionValidation,
  settingsValidation,
  profileValidation,
  paginationValidation,
};
