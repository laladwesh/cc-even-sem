// routes/adminRoutes.js
const express = require('express');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const { ensureAdmin } = require('../middleware/auth');
const { getAnalytics, getBadgeAllocations } = require('../controllers/adminController');
const router = express.Router();

router.get(
  '/analytics',
  ClerkExpressRequireAuth(),
  ensureAdmin,
  getAnalytics
);

router.get(
  '/badges/allocations',
  ClerkExpressRequireAuth(),
  ensureAdmin,
  getBadgeAllocations
);


module.exports = router;
