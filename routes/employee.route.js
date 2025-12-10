// routes/employee.route.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });
const Employee = require('../models/employee.model');

// جلب كل الموظفين
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json({ success: true, employees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// إضافة موظف
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, jobTitle, phone } = req.body;
    if (!req.file) return res.status(400).json({ success: false, message: 'الصورة مطلوبة' });

    const employee = await Employee.create({
      name, jobTitle, phone: phone || '',
      image: req.file.path
    });

    res.json({ success: true, employee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// حذف موظف
router.delete('/:id', async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;