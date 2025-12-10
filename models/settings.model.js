// models/settings.model.js
const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  siteName: { type: String, default: "مؤسسة رقية اليامي" },
  phones: [{ type: String }],
  address: { type: String, default: "نجران رجلاء حي فواز" },
  email: { type: String },
  social: {
    facebook: String,
    instagram: String,
    whatsapp: String,
    twitter: String,
    tiktok: String
  }
}, { timestamps: true });

// الدالة السحرية اللي كنا بنستناها من ساعة
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);