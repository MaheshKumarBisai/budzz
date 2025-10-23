const express = require('express');
const router = express.Router();
const { signup, login, forgotPassword, resetPassword, logout } = require('../controllers/authController');
const { signupValidation, loginValidation, forgotPasswordValidation, resetPasswordValidation } = require('../middleware/validationMiddleware');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);
router.post('/forgot', forgotPasswordValidation, forgotPassword);
router.post('/reset', resetPasswordValidation, resetPassword);
router.post('/logout', protect, logout);

module.exports = router;
