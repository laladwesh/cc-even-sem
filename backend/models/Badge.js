const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['course', 'project', 'custom'],
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  associatedId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'typeRef',
  },
  typeRef: {
    type: String,
    enum: ['Course', 'Project'], // Refers to the model name for associatedId
  },
  iconUrl: {
    type: String,
    default: '', // Can be used with Cloudinary for custom icons
  },
  points: {
    type: Number,
    default: 50, // Default reward points per badge
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Badge', badgeSchema);
