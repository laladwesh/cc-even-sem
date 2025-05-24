const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// GET logged-in user profile
router.get('/me', protect, userController.getMyProfile);

// PUT update profile
router.put('/me', protect, userController.updateProfile);

// PUT add skills
router.put('/add-skills', protect, userController.addSkills);

// Admin routes (optional: use adminOnly middleware if implemented)
// router.get('/', protect, adminOnly, userController.getAllUsers);
// router.delete('/:id', protect, adminOnly, userController.deleteUser);

module.exports = router;
