// backend/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { getAuth } = require('@clerk/express');
const { clerkClient } = require('@clerk/clerk-sdk-node');
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};
exports.syncClerkUser = async (req, res) => {
  try {
    // 1. getAuth(req) → { userId, sessionId, ... }
    const { userId } = getAuth(req);

    // 2. fetch the “full” user from Clerk
    const clerkUser = await clerkClient.users.getUser(userId);
    const { emailAddresses, firstName, lastName, imageUrl, createdAt } = clerkUser;
    const email = emailAddresses[0]?.emailAddress || "";

    // 3. upsert in your Mongo
    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      {
        clerkId:  userId,
        email,
        name:     `${firstName || ""} ${lastName || ""}`.trim(),
        imageUrl: imageUrl,
        joinedAt: createdAt,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({ synced: true, user });
  } catch (err) {
    console.error("Failed to sync Clerk user:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};



exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch profile', error: err.message });
  }
};
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'User already exists' });

    const user = await User.create({ name, email, password, role });

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token: generateToken(user)
    });
  } catch (err) {
    res.status(500).json({ msg: 'Registration failed', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ msg: 'Invalid email or password' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token: generateToken(user)
    });
  } catch (err) {
    res.status(500).json({ msg: 'Login failed', error: err.message });
  }
};
