const User = require('../models/User');
const Course = require('../models/Course');
const Project = require('../models/Project');

// @desc Get logged-in user profile
// @route GET /api/users/me
// @access Private
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('badges')
      .populate('assignedProjects.projectId')
      .populate('enrolledCourses.courseId')
      .select('-password');

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch user profile', error: err.message });
  }
};

// @desc Update user profile (skills, name, etc.)
// @route PUT /api/users/me
// @access Private
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select(
      '-password'
    );
    res.json({ msg: 'Profile updated', user });
  } catch (err) {
    res.status(500).json({ msg: 'Update failed', error: err.message });
  }
};

// @desc Add skills to user
// @route PUT /api/users/add-skills
// @access Private
exports.addSkills = async (req, res) => {
  try {
    const { skills } = req.body;
    const user = await User.findById(req.user._id);

    skills.forEach(skill => {
      if (!user.skills.includes(skill)) {
        user.skills.push(skill);
      }
    });

    await user.save();
    res.json({ msg: 'Skills added', skills: user.skills });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to add skills', error: err.message });
  }
};

// @desc Get all users (Admin only)
// @route GET /api/users
// @access Admin
exports.getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.role) filter.role = req.query.role;

  const users = await User.find(filter).skip(skip).limit(limit).select('-password');
  const total = await User.countDocuments(filter);

  res.json({
    total,
    page,
    pages: Math.ceil(total / limit),
    users,
  });
};

// @desc Delete a user (Admin)
// @route DELETE /api/users/:id
// @access Admin
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete user', error: err.message });
  }
};
