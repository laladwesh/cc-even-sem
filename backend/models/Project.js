const mongoose = require('mongoose');


const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  topics: {
    type: [String],    // duration in minutes
    required: true
  }
}, { _id: false });  // no separate ObjectId for each section
const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  requiredSkills: [String], // Used for matching with user profiles

  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending',
  },

  assignedTo: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: null,
  },

  progress: {
    type: Number,
    default: 0, // Admin-level or system-wide progress
  },
  resources : [resourceSchema],
  badge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Badge',
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Admin or Manager
  },

  deadline: {
    type: Date,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Project', projectSchema);
