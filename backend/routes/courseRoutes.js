const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { isAdmin } = require('../middleware/authMiddleware');
router.get('/', protect, courseController.getAllCourses);
router.post('/', protect, upload.single('thumbnail'), courseController.createCourse);
router.put('/:id', protect, upload.single('thumbnail'), courseController.uploadCourseFile);
router.delete('/:id', protect, courseController.deleteCourse);

router.post('/:id/enroll', protect, courseController.enrollInCourse);
router.put('/:id/progress', protect, courseController.updateProgress);

module.exports = router;
