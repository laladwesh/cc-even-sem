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
    type: [String],  
    required: true
  }
}, { _id: false }); 
const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  requiredSkills: [String],

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
    default: 0, 
  },
  resources : [resourceSchema],
  badge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Badge',
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
