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
    type: Number,  
    required: true
  }
}, { _id: false }); 


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
  skillTags: [String], 

  mediaUrl: {
    type: String,
    default: '',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  duration: {
    type: Number,
    default: 1,
  },

  badge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Badge',
  },
sections: [sectionSchema], 
  enrolledUsers: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      progress: { type: Number, default: 0 }, 
      enrolledAt: { type: Date, default: Date.now },
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Course', courseSchema);