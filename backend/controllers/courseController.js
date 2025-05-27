const { default: mongoose } = require("mongoose");
const Course = require("../models/Course");
const User = require("../models/User");
const cloudinary = require("../utils/cloudinary");


const streamifier = require('streamifier');
const { awardBadge } = require("./stripeController");

// ── 1) Upload a chapter resource to Cloudinary ───────────────────────────
const uploadResource = async (req, res) => {
  try {
    // multer has put the file buffer on req.file
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'courses' },
      (error, result) => {
        if (error) return res.status(500).json({ error });
        console.log(result.secure_url);
        res.json({ url: result.secure_url });
      }
    );
    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (err) {
    console.error('uploadResource error:', err);
    res.status(500).json({ error: err.message });
  }
};

// ── 2) Create a new course with sections ────────────────────────────────
const createCourse = async (req, res) => {
  try {
    // 1️⃣ identify your creator
    const clerkId = req.auth.userId;
    const user    = await User.findOne({ clerkId }).exec();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 2️⃣ pull fields off the body
    const {
      title,
      thumbnail,
      description,
      category,
      skillTags = [],
      duration,
      sections = []
    } = req.body;

    // 3️⃣ build and save
    const course = new Course({
      title,
      thumbnail,
      description,
      category,
      skillTags,
      duration,
      sections,       // each section = { title, duration, link }
      createdBy: user._id,
      createdAt: Date.now()
    });

    await course.save();

    // 4️⃣ respond with the new doc
    res.status(201).json({ course });
  } catch (err) {
    console.error('createCourse error:', err);
    res
      .status(500)
      .json({ message: 'Error creating course', error: err.message });
  }
};








// @desc    Get all courses
// @route   GET /api/courses
// @access  Private
const getAllCourses = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const user = await User.findOne({ clerkId: userId });
    const courses = await Course.find().sort({ createdAt: -1 });
    res.status(200).json({ courses, user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching courses", error: error.message });
  }
};

// @desc    Enroll user in a course
// @route   POST /api/courses/enroll/:id
// @access  Private

const enrollInCourse = async (req, res) => {
  try {
    const courseObjId = new mongoose.Types.ObjectId(req.params.id);
    const course = await Course.findById(courseObjId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const user = await User.findOne({ clerkId: req.auth.userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    course.enrolledUsers.push({
      userId: user._id,
      enrolledAt: new Date(),
      progress: 0, // Default progress
    });
    await course.save();
    const already = user.enrolledCourses.some((c) => c._id.equals(courseObjId));
    if (already) {
      return res
        .status(400)
        .json({ message: "Already enrolled in this course" });
    }
    user.enrolledCourses.push({ _id: courseObjId, progress: 0 });
    await user.save();

    return res.status(200).json({ message: "Enrolled successfully" });
  } catch (error) {
    console.error("Error enrolling in course:", error);
    return res
      .status(500)
      .json({ message: "Error enrolling in course", error: error.message });
  }
};

// @desc    Add a course to user's favourites
// @route   POST /api/courses/enroll/fav/:id
// @access  Private
const addFavCourse = async (req, res) => {
  try {
    // 1. Convert to ObjectId
    const courseObjId = new mongoose.Types.ObjectId(req.params.id);

    // 2. Find user
    const user = await User.findOne({ clerkId: req.auth.userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3. Check for existing favourite
    const alreadyFav = user.favouriteCourses.some((fc) =>
      fc.courseId.equals(courseObjId)
    );
    if (alreadyFav) {
      return res.status(400).json({ message: "Course already in favourites" });
    }

    // 4. Add to favourites & save
    user.favouriteCourses.push({ courseId: courseObjId });
    await user.save();

    return res.status(200).json({ message: "Added to favourites" });
  } catch (error) {
    console.error("Error adding favourite course:", error);
    return res
      .status(500)
      .json({ message: "Error adding to favourites", error: error.message });
  }
};

const removeFavCourse = async (req, res) => {
  try {
    const courseObjId = new mongoose.Types.ObjectId(req.params.id);
    const user = await User.findOne({ clerkId: req.auth.userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // not in favourites?
    const idx = user.favouriteCourses.findIndex((fc) =>
      fc.courseId.equals(courseObjId)
    );
    if (idx === -1) {
      return res.status(400).json({ message: "Course not in favourites" });
    }

    // remove it
    user.favouriteCourses.splice(idx, 1);
    await user.save();

    return res.status(200).json({ message: "Removed from favourites" });
  } catch (error) {
    console.error("Error removing favourite course:", error);
    return res
      .status(500)
      .json({
        message: "Error removing from favourites",
        error: error.message,
      });
  }
};


//getcoursebyid
const getCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.auth.userId;
const courseObjId = new mongoose.Types.ObjectId(req.params.id);
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const course = await Course.findById(courseId , 'thumbnail title sections category skillTags description duration');
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
     const ec = user.enrolledCourses.find(ec => ec._id?.equals(courseId)) || {};
    const already = user.enrolledCourses.some((c) => c._id.equals(courseObjId));
console.log("enrolled " , already)
    res.status(200).json({course, already ,  completedSections: ec.completedSections || [],
    progress: ec.progress || 0});
  } catch (error) {
    res.status(500).json({ message: "Error fetching course", error: error.message });
  }
};


// @desc    Toggle section completion for a user
// @route   PATCH /api/courses/:id/sections/:sectionIdx
// @access  Private
const toggleSection = async (req, res) => {
  try {
    const courseId     = req.params.id;
    const secIdx       = parseInt(req.params.sectionIdx, 10);
    const clerkUserId  = req.auth.userId;

    const user = await User.findOne({ clerkId: clerkUserId });
    if (!user) return res.status(404).json({ message: 'User not found' });
console.log("user", user)
    const uc = user.enrolledCourses.find(ec =>
      ec?._id?.equals(courseId)
    );
    if (!uc) return res.status(400).json({ message: 'Not enrolled in course' });

    const idx = uc.completedSections.indexOf(secIdx);
    if (idx > -1) {
      uc.completedSections.splice(idx, 1);
    } else {
      uc.completedSections.push(secIdx);
    }
    const course = await Course.findById(courseId).select('sections').lean();
    const totalSecs = course.sections.length;
    uc.progress = Math.round((uc.completedSections.length / totalSecs) * 100);

    await user.save();

    return res.json({
      completedSections: uc.completedSections,
      progress: uc.progress
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error toggling section', error: err.message });
  }
};


const getAllCoursesAdmin = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json({ courses });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching courses", error: error.message });
  }
};



const editCourseAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      thumbnail,
      description,
      category,
      skillTags,
      duration,
      sections
    } = req.body;

    // Build an update object only with provided fields
    const updates = {};
    if (title !== undefined)       updates.title       = title;
    if (thumbnail !== undefined)   updates.thumbnail   = thumbnail;
    if (description !== undefined) updates.description = description;
    if (category !== undefined)    updates.category    = category;
    if (skillTags !== undefined)   updates.skillTags   = Array.isArray(skillTags)
                                            ? skillTags
                                            : skillTags.split(',').map(s => s.trim()).filter(Boolean);
    if (duration !== undefined)    updates.duration    = duration;
    if (sections !== undefined)    updates.sections    = Array.isArray(sections)
                                            ? sections
                                            : [];

    // Find by ID and apply updates
    const course = await Course.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).exec();

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({ course });
  } catch (err) {
    console.error('editCourseAdmin error:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid course ID', error: err.message });
    }
    res.status(500).json({ message: 'Error updating course', error: err.message });
  }
};

const completeCourse = async (req, res) => {
  const userId   = req.auth.userId;
  const user = await User.findOne({ clerkId: userId });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const courseId = req.params.id;

  // mark in the User.enrolledCourses
  await User.updateOne(
    { _id: user._id, 'enrolledCourses.courseId': courseId },
    { $set: { 'enrolledCourses.$.progress': 100, 'enrolledCourses.$.completedSections': [] } }
  );

  // award badge
  await awardBadge(userId, 'course-completion');

  res.json({ success: true });
};







module.exports = {
  createCourse,
  getAllCourses,
  enrollInCourse,
  addFavCourse,
  removeFavCourse,
  getCourseById,
  toggleSection,
  uploadResource,
  getAllCoursesAdmin,
  editCourseAdmin,
  completeCourse
};
