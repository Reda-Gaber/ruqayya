// models/user.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // أو bcrypt، الاثنين شغالين

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true });

// أهم حاجة: تشفير الباسورد قبل الحفظ
userSchema.pre('save', async function (next) {
  // لو الباسورد متغيرش (يعني update مش create) خلاص متشفرش تاني
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('Password hashed successfully for user:', this.username);
    next();
  } catch (error) {
    console.error('Error hashing password:', error);
    next(error);
  }
});

// دالة مقارنة كلمة المرور
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// لو حصل خطأ في الـ unique username
userSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('اسم المستخدم موجود مسبقًا'));
  } else {
    next(error);
  }
});

module.exports = mongoose.model('User', userSchema);