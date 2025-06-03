const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    unique: true,
    required: true,
  },

  password: {
    type: String,
    required: true,
    select: false,
  },

  phone: {
    type: String,
  },

  role: {
    type: String,
    enum: ["admin", "manager", "employee"],
    default: "employee",
  },

  skills: [String], 

  experience: {
    type: Number,
    default: 0, // in years
  },

  badges: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Badge",
    },
  ],

  enrolledCourses: [
    {
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
      progress: {
        type: Number,
        default: 0,
      },
      completedSections: [ Number ]
    },
  ],
  favouriteCourses: [
    {
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    },
  ],

  assignedProjects: [
    {
      projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
      progress: {
        type: Number,
        default: 0,
      },
    },
  ],

  imageUrl: {
    type: String,
    default: "",
  },
  clerkId: { type: String, required: true, unique: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.add({
  badges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }],
  tokenBalance: { type: Number, default: 0 },  
  stripeAccountId: { type: String },        
});


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔑 Compare password for login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);

