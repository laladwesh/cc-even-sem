// routes/adminRoutes.js
const express = require('express');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const { ensureAdmin } = require('../middleware/auth');
const { getAnalytics } = require('../controllers/adminController');
const router = express.Router();

router.get(
  '/analytics',
  ClerkExpressRequireAuth(),
  ensureAdmin,
  getAnalytics
);

module.exports = router;
