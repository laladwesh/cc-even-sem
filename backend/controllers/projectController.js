const Project = require('../models/Project');
const User = require('../models/User');
const Badge = require('../models/Badge');



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
     const user = await User.findOne({ clerkId: req.auth.userId });
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
    const projects = await Project.find({ assignedTo: user._id });
    console.log('send user:', user._id);
    if (!projects || projects.length === 0) {
      return res.status(404).json({ msg: 'No projects found for this user' });
    }
    res.json(projects);
    console.log('Fetched projects for user:', user._id);
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


// controllers/projectController.js
// const Project = require('../models/Project');
// const User    = require('../models/User');

exports.createProject = async (req, res) => {
  try {
    // 1️⃣ identify your creator from Clerk session
    const clerkId = req.auth.userId;
    const user    = await User.findOne({ clerkId }).exec();
    if (!user) {
      return res.status(404).json({ message: 'Creator user not found' });
    }

    // 2️⃣ pull fields off the body
    const {
      title,
      description = '',
      requiredSkills = [],
      status = 'Pending',
      assignedTo = [],
      deadline,
      resources = [],   // each = { title, link, topics: [] }
    } = req.body;

    // 3️⃣ build and save
    const project = new Project({
      title,
      description,
      requiredSkills,
      status,
      assignedTo,
      deadline,
      resources,
      createdBy: user._id,
      // createdAt & progress default automatically
    });

    await project.save();

    // 4️⃣ respond with the new doc
    res.status(201).json({ project });
  } catch (err) {
    console.error('createProject error:', err);
    res
      .status(500)
      .json({ message: 'Error creating project', error: err.message });
  }
};


exports.getAllProjectsAdmin = async (req, res) => {
  try {
    const projects = await Project.find().populate('createdBy', 'name email');
    if (!projects || projects.length === 0) {
      return res.status(404).json({ msg: 'No projects found' });
    }
    res.json(projects);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch projects', error: err.message });
  }
}


exports.editProjectAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      requiredSkills,
      status,
      assignedTo,
      deadline,
      resources
    } = req.body;

    // Build up an updates object only including fields that were sent
    const updates = {};
    if (title !== undefined)          updates.title          = title;
    if (description !== undefined)    updates.description    = description;
    if (requiredSkills !== undefined) {
      // allow either array or comma-string
      updates.requiredSkills = Array.isArray(requiredSkills)
        ? requiredSkills
        : requiredSkills.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (status !== undefined)         updates.status         = status;
    if (assignedTo !== undefined)     updates.assignedTo     = assignedTo;
    if (deadline !== undefined)       updates.deadline       = deadline;
    if (resources !== undefined) {
      // resources should be array of { title, link, topics: [] }
      updates.resources = Array.isArray(resources)
        ? resources.map(r => ({
            title: r.title,
            link:  r.link,
            topics: Array.isArray(r.topics)
              ? r.topics
              : (r.topics || '').split(',').map(t => t.trim()).filter(Boolean)
          }))
        : [];
    }

    // Find and update
    const project = await Project.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ project });
  } catch (err) {
    console.error('editProjectAdmin error:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid project ID', error: err.message });
    }
    res.status(500).json({ message: 'Error updating project', error: err.message });
  }
};
