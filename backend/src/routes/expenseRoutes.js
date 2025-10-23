const express = require('express');
const router = express.Router();
const { createExpense, getExpenses, getExpenseById, updateExpense, deleteExpense } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');
const { transactionValidation, paginationValidation } = require('../middleware/validationMiddleware');

router.post('/', protect, transactionValidation, createExpense);
router.get('/', protect, paginationValidation, getExpenses);
router.get('/:id', protect, getExpenseById);
router.put('/:id', protect, updateExpense);
router.delete('/:id', protect, deleteExpense);

module.exports = router;
