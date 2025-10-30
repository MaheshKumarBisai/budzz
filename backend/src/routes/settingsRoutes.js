const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');
const { settingsValidation } = require('../middleware/validationMiddleware');

router.get('/', protect, getSettings);
router.put('/', protect, settingsValidation, updateSettings);

module.exports = router;
