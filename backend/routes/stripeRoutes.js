const express = require('express');
const router = express.Router();
const stripeController = require('../controllers/stripeController');
const { protect } = require('../middleware/authMiddleware');

// router.post('/create-checkout-session', protect, stripeController.createCheckoutSession);
// router.post('/webhook', express.raw({ type: 'application/json' }), stripeController.stripeWebhook);

module.exports = router;
