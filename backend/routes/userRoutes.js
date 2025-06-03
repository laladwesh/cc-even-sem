const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/me', protect, userController.getMyProfile);


router.put('/me', protect, userController.updateProfile);

// PUT add skills
router.put('/add-skills', protect, userController.addSkills);

module.exports = router;
