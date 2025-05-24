const Project = require('../models/Project');
const User = require('../models/User');
const Badge = require('../models/Badge');

// @desc Create a new project (Admin/Manager)
exports.createProject = async (req, res) => {
  try {
    const project = await Project.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ msg: 'Project creation failed', error: err.message });
  }
};

// @desc Update project (Admin/Manager)
exports.updateProject = async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: 'Update failed', error: err.message });
  }
};

// @desc Delete project (Admin/Manager)
exports.deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Delete failed', error: err.message });
  }
};

// @desc Assign project to a user (Admin/Manager)
exports.assignProject = async (req, res) => {
  try {
    const { userId } = req.body;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { assignedTo: userId },
      { new: true }
    );

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const alreadyAssigned = user.assignedProjects.find(
      p => p.projectId.toString() === project._id.toString()
    );

    if (!alreadyAssigned) {
      user.assignedProjects.push({ projectId: project._id });
      await user.save();
    }

    res.json({ msg: 'Project assigned successfully', project });
  } catch (err) {
    res.status(500).json({ msg: 'Assignment failed', error: err.message });
  }
};

// @desc Get logged-in user's projects
exports.getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ assignedTo: req.user._id });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch projects', error: err.message });
  }
};

// @desc Update progress for user's assigned project and award badge if completed
exports.updateProgress = async (req, res) => {
  try {
    const { progress } = req.body;
    const user = await User.findById(req.user._id).populate('badges');

    const project = user.assignedProjects.find(
      p => p.projectId.toString() === req.params.id
    );
    if (!project) return res.status(404).json({ msg: 'Project not assigned to user' });

    project.progress = progress;

    // 🧠 Award badge if progress reaches 100%
    if (
      progress >= 100 &&
      !user.badges.some(b => b.title === `Completed Project: ${req.params.id}`)
    ) {
      const dbProject = await Project.findById(req.params.id);
      const badge = new Badge({
        title: `Completed Project: ${dbProject.title}`,
        description: `Successfully completed project ${dbProject.title}`,
        points: 50,
        user: user._id,
      });

      await badge.save();
      user.badges.push(badge._id);
      user.performanceScore += 50;
    }

    await user.save();

    const status = progress >= 100 ? 'Completed' : 'In Progress';
    await Project.findByIdAndUpdate(req.params.id, { status });

    res.json({ msg: 'Progress updated' });
  } catch (err) {
    res.status(500).json({ msg: 'Progress update failed', error: err.message });
  }
};
