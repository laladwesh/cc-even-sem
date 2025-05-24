// backend/controllers/adminController.js
const User = require('../models/User');
const Course = require('../models/Course');
const Project = require('../models/Project');

// Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'employee' });
    const totalCourses = await Course.countDocuments();
    const totalProjects = await Project.countDocuments();

    const completedCourses = await User.aggregate([
      { $unwind: '$enrolledCourses' },
      { $match: { 'enrolledCourses.progress': 100 } },
      { $count: 'count' }
    ]);

    const completedProjects = await User.aggregate([
      { $unwind: '$assignedProjects' },
      { $match: { 'assignedProjects.progress': 100 } },
      { $count: 'count' }
    ]);

    const totalBadges = await User.aggregate([
      { $project: { badgeCount: { $size: '$badges' } } },
      { $group: { _id: null, total: { $sum: '$badgeCount' } } }
    ]);

    res.json({
      totalUsers,
      totalCourses,
      totalProjects,
      completedCourses: completedCourses[0]?.count || 0,
      completedProjects: completedProjects[0]?.count || 0,
      totalBadges: totalBadges[0]?.total || 0
    });
  } catch (err) {
    res.status(500).json({ msg: 'Dashboard stats failed', error: err.message });
  }
};

// Admin: Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Fetching users failed', error: err.message });
  }
};

// Admin: Delete a user
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Deleting user failed', error: err.message });
  }
};
