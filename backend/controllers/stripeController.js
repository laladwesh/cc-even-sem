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


// controllers/performance.js

const User  = require('../models/User');
const Badge = require('../models/Badge');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function awardBadge(userId, badgeSlug) {
  // lookup or create the badge type
  let badge = await Badge.findOne({ slug: badgeSlug });
  if (!badge) {
    badge = await Badge.create({
      slug: badgeSlug,
      name: badgeSlug.replace(/[-_]/g,' '),
      tokenValue: 500,        // e.g. $5.00 bonus
    });
  }

  // add to user if not already awarded
  const user = await User.findById(userId);
  if (!user.badges.includes(badge._id)) {
    user.badges.push(badge._id);
    user.tokenBalance += badge.tokenValue;
    await user.save();
  }
}


exports.cashOut = async (req, res) => {
  const user = await User.findOne({clerkId : req.auth.userId});
  if (!user.stripeAccountId) {
    return res.status(400).json({ message: 'No Stripe account connected' });
  }
  const amount = user.tokenBalance;            // e.g. 500 = $5.00
  if (amount <= 0) {
    return res.status(400).json({ message: 'Nothing to pay out' });
  }

  // create a Transfer to their connected account
  await stripe.transfers.create({
    amount,
    currency: 'usd',
    destination: user.stripeAccountId,
  });

  // zero them out
  user.tokenBalance = 0;
  await user.save();

  res.json({ success: true, paid: amount });
};





module.exports = {
    awardBadge
}