// config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dqu7geevt',
  api_key: process.env.CLOUDINARY_API_KEY || '948753347448127',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'ER_WBKXkcfDMswFmkn3cKbABmtg'
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ruqayya-projects',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

module.exports = { cloudinary, storage };