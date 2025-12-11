// models/Project.js
const mongoose = require('mongoose');

const stageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true }
});

// models/Project.js → عدّل السكيما كده:

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    default: "غير محدد",
    enum: [
      "مشاريع إنشائية",
      "ديكورات داخلية", 
      "مبيعات وتأجير",
      "ترميم وصيانة",
      "تصميم حدائق",
      "غير محدد"
    ]
  },
  mainImage: { type: String, required: true },
  images: [{ type: String }],
  stages: [stageSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);