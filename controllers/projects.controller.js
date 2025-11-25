// controllers/projectController.js
const Project = require('../models/projects.model');
const { cloudinary } = require('../config/cloudinary');

// عرض صفحة إضافة مشروع
exports.getAddProject = (req, res) => {
  res.render('admin/projects/add', { pageTitle: 'إضافة مشروع جديد' });
};

// حفظ مشروع جديد
exports.postAddProject = async (req, res) => {
  try {
    console.log("========================================");
    console.log("البيانات اللي وصلت للسيرفر:");
    console.log("العنوان:", req.body.title);
    console.log("الوصف:", req.body.description);
    console.log("أسماء المراحل:", req.body.stageName);
    console.log("كل الملفات اللي رفعتها:", Object.keys(req.files || {}));
    console.log("req.files['images']:", req.files['images']?.map(f => f.originalname));
    console.log("req.files['stageImage[]']:", req.files['stageImage[]']?.map(f => f.originalname));
    console.log("req.files['stageImage']:", req.files['stageImage']?.map(f => f.originalname));
    console.log("========================================");

    const { title, description, stageName } = req.body;

    // صور المشروع
    const projectImages = req.files['images'] ? req.files['images'].map(f => f.path) : [];
    if (projectImages.length === 0) {
      return res.redirect('/admin/projects/new?error=يجب رفع صورة واحدة على الأقل');
    }

    // المراحل (مع طباعة تفصيلية)
    const stages = [];
    if (stageName && Array.isArray(stageName)) {
      for (let i = 0; i < stageName.length; i++) {
        if (stageName[i]?.trim()) {
          const file = req.files['stageImage[]']?.[i] || req.files['stageImage']?.[i];
          if (file) {
            console.log(`المرحلة ${i + 1}: ${stageName[i]} → الصورة: ${file.originalname} (رابط: ${file.path})`);
            stages.push({
              name: stageName[i].trim(),
              image: file.path
            });
          } else {
            console.log(`المرحلة ${i + 1}: ${stageName[i]} → مفيش صورة!`);
          }
        }
      }
    }

    console.log("المراحل اللي هتتحفظ فعليًا:", stages);
    console.log("========================================");

    await Project.create({
      title,
      description,
      mainImage: projectImages[0],
      images: projectImages,
      stages
    });

    console.log("تم حفظ المشروع بنجاح!");
    res.redirect('/admin/projects?success=تم إضافة المشروع بنجاح');
  } catch (err) {
    console.error('خطأ كبير:', err);
    res.redirect('/admin/projects/new?error=حدث خطأ');
  }
};

// عرض كل المشاريع
exports.getProjectsList = async (req, res) => {
  const projects = await Project.find().sort({ createdAt: -1 });
  res.render('admin/projects/list', {
    pageTitle: 'جميع المشاريع',
    projects,
    success: req.query.success,
    error: req.query.error
  });
};

// حذف مشروع
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project) {
      // حذف الصور من كلاوديناري (اختياري)
      const deletePromises = [
        ...project.images,
        ...project.stages.map(s => s.image)
      ].map(url => {
        const publicId = url.split('/').pop().split('.')[0];
        return cloudinary.uploader.destroy(`ruqayya-projects/${publicId}`);
      });
      await Promise.all(deletePromises);
      
      await Project.findByIdAndDelete(req.params.id);
    }
    res.redirect('/admin/projects?success=تم الحذف بنجاح');
  } catch (err) {
    res.redirect('/admin/projects?error=فشل الحذف');
  }
};