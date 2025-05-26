const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const path = require('path');
const { clerkMiddleware } = require( "@clerk/express");
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const { clerkClient } = require('@clerk/clerk-sdk-node');
require('dotenv').config();
const { ensureSignedIn, ensureAdmin } = require('./middleware/auth');
clerkClient.apiKey = process.env.CLERK_API_KEY;
// Load env
dotenv.config();

// Connect to DB
connectDB();

const app = express();

const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, try again later.',
});
app.use(limiter);
app.use(clerkMiddleware({
  secretKey: process.env.CLERK_SECRET_KEY,   // <-- your secret key
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
}));
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const helmet = require('helmet');

app.use(helmet()); // Sets secure HTTP headers
// app.use(mongoSanitize()); // Prevents NoSQL injection
// app.use(xss()); // Prevents XSS
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

// Stripe webhook must come before bodyParser
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

// Middlewares
app.use(cors());
app.use(express.json()); // Parse JSON
app.use(morgan('dev'));

// Route files
app.get("/api/admin-only", ClerkExpressRequireAuth() ,ensureAdmin, (req, res) => {
  res.json({ secret: "this is for admins only" });
});

app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/badges', require('./routes/badgeRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/pdf', require('./routes/pdfRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/stripe', require('./routes/stripeRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Root route
app.get('/', (req, res) => {
  res.send('CompanyGrow API is running...');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
