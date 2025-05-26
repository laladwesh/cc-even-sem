const express = require("express");
// const router = express.Router();
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const streamifier = require("streamifier");
const router = express.Router();
const upload = multer(); // memory storage

// configure from env
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
const courseController = require("../controllers/courseController");
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");
const { ensureAdmin } = require("../middleware/auth");

router.get('/admin', ClerkExpressRequireAuth(), ensureAdmin , courseController.getAllCoursesAdmin);
router.patch('/:id', ClerkExpressRequireAuth(), ensureAdmin ,  courseController.editCourseAdmin);
router.get("/", ClerkExpressRequireAuth(), courseController.getAllCourses);
router.post(
  "/:id/enroll",
  ClerkExpressRequireAuth(),
  courseController.enrollInCourse
);
router.post(
  "/:id/enroll/fav",
  ClerkExpressRequireAuth(),
  courseController.addFavCourse
);
router.get("/:id", ClerkExpressRequireAuth(), courseController.getCourseById);
router.delete(
  "/:id/rm/fav",
  ClerkExpressRequireAuth(),
  courseController.removeFavCourse
);
router.patch(
  "/:id/sections/:sectionIdx",
  ClerkExpressRequireAuth(),
  courseController.toggleSection
);

router.post("/upload", upload.single("file"), courseController.uploadResource);
router.post("/", ClerkExpressRequireAuth(), courseController.createCourse);
module.exports = router;
