const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

router.get('/performance', protect, adminOnly, analyticsController.getPerformanceStats);
router.get('/badges', protect, adminOnly, analyticsController.getBadgeStats);

module.exports = router;
