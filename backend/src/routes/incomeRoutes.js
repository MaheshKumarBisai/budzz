const express = require('express');
const router = express.Router();
const { createIncome, getIncomes, getIncomeById, updateIncome, deleteIncome } = require('../controllers/incomeController');
const { protect } = require('../middleware/authMiddleware');
const { transactionValidation, paginationValidation } = require('../middleware/validationMiddleware');

router.post('/', protect, transactionValidation, createIncome);
router.get('/', protect, paginationValidation, getIncomes);
router.get('/:id', protect, getIncomeById);
router.put('/:id', protect, updateIncome);
router.delete('/:id', protect, deleteIncome);

module.exports = router;
