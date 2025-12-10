// routes/adminRoutes.js → النسخة النهائية والنظيفة 100%

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const projectController = require('../controllers/projects.controller');

// إعداد Multer مع Cloudinary
const upload = multer({ storage });

// ==================== لوحة التحكم - المشاريع ====================

// عرض قائمة المشاريع في الداشبورد
router.get('/projects', projectController.getProjectsList);

// صفحة إضافة مشروع جديد
router.get('/projects/new', projectController.getAddProject);

// إضافة مشروع جديد (مع الصور والمراحل)
// مهم جدًا: هنستخدم stageImage (بدون []) لأن الـ frontend بيبعت كده
router.post('/projects/new',
  upload.fields([
    { name: 'images', maxCount: 20 },     // صور المشروع الرئيسية
    { name: 'stageImage', maxCount: 30 }  // صور المراحل (كل مرحلة صورة واحدة)
  ]),
  projectController.postAddProject
);

// حذف مشروع
router.post('/projects/delete/:id', projectController.deleteProject);

module.exports = router;