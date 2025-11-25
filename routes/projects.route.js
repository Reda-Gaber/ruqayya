// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const projectController = require('../controllers/projects.controller');

const upload = multer({ storage });

// مشاريع
router.get('/projects', projectController.getProjectsList);
router.get('/projects/new', projectController.getAddProject);
router.post('/projects/new',
  upload.fields([
    { name: 'images', maxCount: 20 },
    { name: 'stageImage', maxCount: 30 },
    { name: 'stageImage[]', maxCount: 30 }
  ]),
  projectController.postAddProject
);
router.post('/projects/delete/:id', projectController.deleteProject);

module.exports = router;