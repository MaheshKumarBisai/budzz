const express = require('express');
const router = express.Router();
const { getMonthlyReport, getComparison, exportReport } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.get('/monthly', protect, getMonthlyReport);
router.get('/comparison', protect, getComparison);
router.get('/export', protect, exportReport);

module.exports = router;
