// const Stripe = require('stripe');
// const User = require('../models/User');
// const Badge = require('../models/Badge');

// // ⚠ Replace with your actual Stripe secret key or use process.env.STRIPE_SECRET
// const stripe = Stripe(process.env.STRIPE_SECRET);

// // @desc Create Stripe payment for badge reward
// // @route POST /api/stripe/bonus
// // @access Private
// exports.createBonusPayment = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).populate('badges');
//     if (!user) return res.status(404).json({ msg: 'User not found' });

//     const totalPoints = user.badges.length * 50; // Assuming 50 points = ₹50 per badge
//     const amount = totalPoints * 100; // Stripe accepts in paise (₹1 = 100)

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency: 'inr',
//       metadata: { integration_check: 'badge_reward', userId: user._id.toString() },
//       receipt_email: user.email,
//     });

//     res.status(200).json({
//       clientSecret: paymentIntent.client_secret,
//       amount,
//       message: `Bonus reward initiated for ₹${amount / 100}`,
//     });
//   } catch (error) {
//     res.status(500).json({ msg: 'Payment initiation failed', error: error.message });
//   }
// };

// // @desc Webhook for payment success (Stripe)
// // @route POST /api/stripe/webhook
// // @access Public (no auth middleware here!)
// exports.stripeWebhook = async (req, res) => {
//   const sig = req.headers['stripe-signature'];

//   try {
//     const event = stripe.webhooks.constructEvent(
//       req.rawBody,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );

//     if (event.type === 'payment_intent.succeeded') {
//       const intent = event.data.object;
//       const userId = intent.metadata.userId;

//       // Log or update your DB
//       console.log(`💰 Bonus Payment Received for user ${userId}: ₹${intent.amount / 100}`);
//       // You can also store transactions in a "Transaction" model if needed.
//     }

//     res.json({ received: true });
//   } catch (err) {
//     console.error('Webhook error:', err.message);
//     res.status(400).send(`Webhook Error: ${err.message}`);
//   }
// };
