// controllers/projectController.js → النسخة النهائية والمضمونة 100%

const Project = require('../models/projects.m');
const { cloudinary } = require('../config/cloudinary');

// عرض صفحة إضافة مشروع
exports.getAddProject = (req, res) => {
  res.render('admin/projects/add', { pageTitle: 'إضافة مشروع جديد' });
};

// حفظ مشروع جديد
exports.postAddProject = async (req, res) => {
  try {
    // مهم جدًا: نأخذ القيم كده بالترتيب الصحيح
    const title = req.body.title?.trim();
    const description = req.body.description?.trim();
    const category = req.body.category; // ← ده اللي كان بيضيع
    const stageNames = req.body.stageName 
      ? (Array.isArray(req.body.stageName) ? req.body.stageName : [req.body.stageName])
      : [];

    // تحقق من البيانات الأساسية
    if (!title || !description || !req.files?.images?.length) {
      return res.status(400).json({ success: false, error: "البيانات ناقصة أو الصور مفقودة" });
    }

    // صور المشروع
    const projectImages = req.files['images'].map(f => f.path);
    const mainImage = projectImages[0];

    // المراحل
    const stages = [];
    const stageFiles = req.files['stageImage'] || [];

    stageNames.forEach((name, i) => {
      if (name?.trim() && stageFiles[i]) {
        stages.push({
          name: name.trim(),
          image: stageFiles[i].path
        });
      }
    });

    // حفظ المشروع مع التأكد من حفظ التصنيف
    const newProject = await Project.create({
      title,
      description,
      category: category || "غير محدد",  // ← مهم جدًا
      mainImage,
      images: projectImages,
      stages
    });

    console.log("تم حفظ المشروع:", {
      title: newProject.title,
      category: newProject.category,      // هتظهر في الكونسول دلوقتي
      stagesCount: newProject.stages.length
    });

    res.json({ success: true, message: "تم إضافة المشروع بنجاح" });

  } catch (err) {
    console.error('خطأ في إضافة المشروع:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// عرض كل المشاريع في الداشبورد
exports.getProjectsList = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.render('admin/projects/list', {
      pageTitle: 'جميع المشاريع',
      projects,
      success: req.query.success,
      error: req.query.error
    });
  } catch (err) {
    console.error('خطأ في جلب المشاريع:', err);
    res.render('admin/projects/list', {
      pageTitle: 'جميع المشاريع',
      projects: [],
      error: 'حدث خطأ في جلب المشاريع'
    });
  }
};

// حذف مشروع
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, error: "المشروع غير موجود" });
    }

    // رد JSON للـ AJAX (الداشبورد)
    res.json({ success: true, message: "تم الحذف بنجاح" });

  } catch (err) {
    console.error('خطأ في الحذف:', err);
    res.status(500).json({ success: false, error: "فشل الحذف: " + err.message });
  }
};