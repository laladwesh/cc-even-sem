const express = require('express');
const router = express.Router();
const badgeController = require('../controllers/badgeController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, badgeController.getMyBadges);
router.post('/', protect, badgeController.createBadge); // Admin/Manager use
router.get('/all', protect, badgeController.getAllBadges); // Admin overview

module.exports = router;
