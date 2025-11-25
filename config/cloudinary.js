// config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: 'dqu7geevt', // من الـ CLOUDINARY_URL اللي عندك
  api_key: '948753347448127',
  api_secret: 'ER_WBKXkcfDMswFmkn3cKbABmtg' // حط السر بتاعك كامل هنا أو في .env
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ruqayya-projects',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

module.exports = { cloudinary, storage };