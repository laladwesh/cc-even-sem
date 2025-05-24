const Badge = require('../models/Badge');
const User = require('../models/User');

// Get badges for the logged-in user
exports.getMyBadges = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('badges');
    res.json(user.badges || []);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to get badges', error: err.message });
  }
};

// Admin/Manager - Create a new badge
exports.createBadge = async (req, res) => {
  try {
    const { title, description, icon } = req.body;

    if (!title || !description || !icon) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    const badge = await Badge.create({ title, description, icon });
    res.status(201).json(badge);
  } catch (err) {
    res.status(500).json({ msg: 'Badge creation failed', error: err.message });
  }
};

// Admin/Manager - Get all badges
exports.getAllBadges = async (req, res) => {
  try {
    const badges = await Badge.find();
    res.json(badges);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch badges', error: err.message });
  }
};
