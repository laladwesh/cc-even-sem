const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
// This code configures the Cloudinary SDK with your credentials.
// It allows you to upload, manage, and manipulate images and videos in your application.
// The `cloudinary` object can be used to perform various operations like uploading images, transforming them, etc.