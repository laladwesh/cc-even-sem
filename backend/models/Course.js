const mongoose = require('mongoose');


const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  duration: {
    type: Number,    // duration in minutes
    required: true
  }
}, { _id: false });  // no separate ObjectId for each section


const courseSchema = new mongoose.Schema({
  thumbnail: { type: String },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    default: 'General',
  },
  skillTags: [String], // Used for filtering/matching with user skills

  mediaUrl: {
    type: String,
    default: '', // e.g., Cloudinary link for course image or video
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Usually an Admin or Manager
  },

  duration: {
    type: Number, // in hours
    default: 1,
  },

  badge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Badge',
  },
sections: [sectionSchema], // Array of sections with title, link, and duration
  enrolledUsers: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      progress: { type: Number, default: 0 }, // 0 to 100%
      enrolledAt: { type: Date, default: Date.now },
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Course', courseSchema);