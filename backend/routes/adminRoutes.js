const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, checkRole } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

// Admin-only user management
router.get('/users', protect,checkRole(['admin']), adminController.getAllUsers);
router.delete('/users/:id', protect, checkRole(['admin' , 'manager']), adminController.deleteUser);

module.exports = router;
