// routes/api/settings.route.js ← النسخة اللي هتشتغل حتى لو الدنيا مقلوبة

const express = require('express');
const router = express.Router();
const Settings = require('../models/settings.model');

router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        siteName: "مؤسسة رقية اليامي",
        phones: ["0503119104", "0560864811"],
        address: "نجران رجلاء حي فواز"
      });
    }
    res.json({ success: true, settings });
  } catch (err) {
    console.error("GET Error:", err.message);
    res.status(500).json({ success: false, message: "خطأ في جلب البيانات" });
  }
});

router.post('/', async (req, res) => {
  try {
    let data = {};

    // نأخذ كل الحقول اللي ممكن تيجي
    data.siteName = req.body.siteName || "مؤسسة رقية اليامي";
    data.address  = req.body.address  || "";
    data.email    = req.body.email    || "";
    
    // السوشيال
    data.social = {
      facebook:  req.body.facebook  || "",
      instagram: req.body.instagram || "",
      whatsapp:  req.body.whatsapp  || "",
      twitter:   req.body.twitter   || "",
      tiktok:    req.body.tiktok   || ""
    };

    // الأرقام - أهم حاجة
    if (req.body.phones) {
      if (typeof req.body.phones === 'string') {
        try {
          const parsed = JSON.parse(req.body.phones);
          data.phones = Array.isArray(parsed) ? parsed.filter(p => p.trim() !== "") : [];
        } catch (e) {
          data.phones = [];
        }
      } else if (Array.isArray(req.body.phones)) {
        data.phones = req.body.phones.filter(p => p.trim() !== "");
      } else {
        data.phones = [];
      }
    } else {
      data.phones = [];
    }

    // نحفظ
    const settings = await Settings.findOneAndUpdate(
      {},
      data,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ success: true, settings });
  } catch (err) {
    console.error("POST Error:", err.message);
    res.status(500).json({ success: false, message: "فشل حفظ البيانات" });
  }
});

module.exports = router;