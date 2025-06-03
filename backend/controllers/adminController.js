// controllers/adminController.js
const Project = require('../models/Project');
const Course  = require('../models/Course');
const User    = require('../models/User');

exports.getAnalytics = async (req, res) => {
  try {

    const totalEmployees = await User.countDocuments({ role: 'employee' });

    const activeProjects = await Project.countDocuments({
      status: { $in: ['Pending', 'In Progress'] },
    });

    const enrollAgg = await User.aggregate([
      { $unwind: '$enrolledCourses' },
      { $group: {
          _id: null,
          total:     { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ['$enrolledCourses.progress', 100] }, 1, 0] } },
        }
      }
    ]);
    const trainingCompletePct = enrollAgg.length
      ? Math.round((enrollAgg[0].completed / enrollAgg[0].total) * 100)
      : 0;

    const skillAgg = await User.aggregate([
      {
        $project: {
          avgCourse: { $avg: '$enrolledCourses.progress' },
          avgProj:   { $avg: '$assignedProjects.progress' },
        }
      },
      {
        $project: {
          score: { $avg: ['$$ROOT.avgCourse', '$$ROOT.avgProj'] }
        }
      },
      { $group: { _id: null, avgSkill: { $avg: '$score' } } }
    ]);
    const avgSkillScore = skillAgg.length
      ? Math.round(skillAgg[0].avgSkill)
      : 0;

    const rawProjects = await Project.find()
      .populate('createdBy', 'name')
      .lean();

    const projectOverview = rawProjects.map(p => ({
      name:      p.title,
      status:    p.status,
      deadline:  p.deadline,
      manager:   p.createdBy?.name || '—',
      employees: (p.assignedTo || []).length,
    }));

    const trainingProgress = { pctComplete: trainingCompletePct };


    const skillProfile = await User.aggregate([
      { $unwind: '$skills' },
      { $group: { _id: '$skills', count: { $sum: 1 } } },
      { $project: { skill: '$_id', value: '$count', _id: 0 } }
    ]);

    const projectsCompleted = await Project.aggregate([
      { $match: { status: 'Completed' } },
      { $group: {
          _id: { $dateToString: { format: '%b', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);
    const performanceTrend = projectsCompleted.map(p => ({
      month: p._id,
      value: p.count
    }));


    const badgeCounts = await User.aggregate([
      { $unwind: '$badges' },
      { $group: { _id: '$badges', count: { $sum: 1 } } },
    ]);


    const topEmp = await User.aggregate([
      {
        $project: {
          name: 1,
          avgCourse: { $avg: '$enrolledCourses.progress' },
          avgProj:   { $avg: '$assignedProjects.progress' },
        }
      },
      {
        $project: {
          name: 1,
          score: { $avg: ['$$ROOT.avgCourse', '$$ROOT.avgProj'] }
        }
      },
      { $sort: { score: -1 } },
      { $limit: 5 }
    ]);
    const topEmployees = topEmp.map(u => ({
      name:  u.name,
      score: Math.round(u.score || 0)
    }));

    res.json({
      summary: {
        totalEmployees,
        activeProjects,
        trainingCompletePct,
        avgSkillScore
      },
      projectOverview,
      trainingProgress,
      skillProfile,
      performanceTrend,
      badgeCounts,
      topEmployees,
      courseEnrollments: await Course.aggregate([
        { $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id': 1 } }
      ])
    });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({
      message: 'Failed to load analytics',
      error: err.message
    });
  }
};


const Badge = require('../models/Badge');


exports.getBadgeAllocations = async (req, res) => {
  try {
    // 1️⃣ load all badges
    const allBadges = await Badge.find().lean();

    // 2️⃣ count awards per badge:
    const rawCounts = await User.aggregate([
      { $unwind: '$badges' },
      { $group: { _id: '$badges', count: { $sum: 1 } } }
    ]);

    // 3️⃣ merge into one array
    const badgeMap = rawCounts.reduce((m, r) => {
      m[r._id.toString()] = r.count;
      return m;
    }, {});

    const allocations = allBadges.map(b => ({
      id:          b._id.toString(),
      name:        b.name,
      description: b.description,
      tokenValue:  b.tokenValue,
      count:       badgeMap[b._id.toString()] || 0
    }));

    res.json({ badges: allocations });
  } catch (err) {
    console.error('getBadgeAllocations error:', err);
    res.status(500).json({ message: 'Error fetching badge data', error: err.message });
  }
};
