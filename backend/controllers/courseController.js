const Course = require('../models/Course');
const User = require('../models/User');
const cloudinary = require('../utils/cloudinary');

// @desc    Create a new course (Admin only)
// @route   POST /api/courses
// @access  Admin
const createCourse = async (req, res) => {
  try {
    const { title, description, skillLevel } = req.body;

    let thumbnailUrl = '';
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: 'image',
        folder: 'companygrow/courses/thumbnails'
      });
      thumbnailUrl = result.secure_url;
    }

    const course = new Course({
      title,
      description,
      skillLevel,
      createdBy: req.user._id,
      thumbnail: thumbnailUrl, // Ensure Course schema has 'thumbnail'
    });

    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error creating course', error: error.message });
  }
};


// @desc    Get all courses
// @route   GET /api/courses
// @access  Private
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
};

// @desc    Enroll user in a course
// @route   POST /api/courses/enroll/:id
// @access  Private
const enrollInCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const user = await User.findById(req.user._id);

    if (!user.enrolledCourses.includes(courseId)) {
      user.enrolledCourses.push(courseId);
      await user.save();
    }

    res.status(200).json({ message: 'Enrolled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error enrolling in course', error: error.message });
  }
};

// @desc    Update course progress for a user and award badge if completed
// @route   PUT /api/courses/progress/:id
// @access  Private
const updateProgress = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { progress } = req.body;

    const user = await User.findById(req.user._id).populate('badges');
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    let courseProgress = user.courseProgress.find(cp => cp.course.toString() === courseId);

    if (courseProgress) {
      courseProgress.progress = progress;
    } else {
      user.courseProgress.push({ course: courseId, progress });
    }

    // 🧠 Award badge if course completed and not already awarded
    if (
      progress >= 100 &&
      !user.badges.some(b => b.title === `Completed: ${course.title}`)
    ) {
      const Badge = require('../models/Badge');
      const newBadge = new Badge({
        title: `Completed: ${course.title}`,
        description: `Successfully completed ${course.title}`,
        points: 50,
        user: user._id,
      });
      await newBadge.save();

      user.badges.push(newBadge._id);
      user.performanceScore += 50;
    }

    await user.save();
    res.status(200).json({ message: 'Progress updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating progress', error: error.message });
  }
};


// @desc    Upload a file for a course (PDF/video/etc)
// @route   POST /api/courses/upload/:id
// @access  Admin
const uploadCourseFile = async (req, res) => {
  try {
    const courseId = req.params.id;
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'auto',
      folder: 'companygrow/courses'
    });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.materials.push({ url: result.secure_url, type: req.file.mimetype });
    await course.save();

    res.status(200).json({ message: 'File uploaded', url: result.secure_url });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
};
const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Optional: Check if the user has permission to delete (admin or creator)
    if (
      req.user.role !== 'admin' &&
      String(course.createdBy) !== String(req.user._id)
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    await course.remove();

    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting course', error: err.message });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  enrollInCourse,
  updateProgress,
  uploadCourseFile,
  deleteCourse
};
