// backend/controllers/analyticsController.js
const User = require('../models/User');
const Project = require('../models/Project');
const Course = require('../models/Course');

exports.getPerformanceStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('enrolledCourses.courseId assignedProjects.projectId');

    const courseStats = user.enrolledCourses.map(course => ({
      title: course.courseId?.title || 'Unknown',
      progress: course.progress,
    }));

    const projectStats = user.assignedProjects.map(project => ({
      title: project.projectId?.title || 'Unknown',
      progress: project.progress,
    }));

    const totalBadges = user.badges.length;

    res.json({ courseStats, projectStats, totalBadges });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to load analytics', error: err.message });
  }
};
exports.getBadgeStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ badgeCount: user.badges.length });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to load badge stats', error: err.message });
  }
};
