const express = require("express");
const router = express.Router();
const Project = require("../models/projects.m");

// جلب كل المشاريع (للصفحة الرئيسية)
router.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find()
      .sort({ createdAt: -1 })
      // نجيب كل حاجة (أو نحدد اللي عايزينه بالظبط)
      .select("title description mainImage images stages"); // نجيب الحاجات الخفيفة بس

    res.json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// جلب آخر N مشاريع (مثلاً آخر 6)
router.get("/latest/:count", async (req, res) => {
  try {
    const count = parseInt(req.params.count) || 6;
    const projects = await Project.find()
      .sort({ createdAt: -1 })
      .limit(count)
      .select("title mainImage");

    res.json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// جلب مشروع واحد بالتفاصيل الكاملة (لصفحة التفاصيل)
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "المشروع غير موجود" });
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
