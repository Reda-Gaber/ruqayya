# حل مشاكل Vercel - Troubleshooting Guide

## المشاكل الشائعة وحلولها

### 1. الموقع لا يعمل على Vercel

#### التحقق من:
- ✅ تأكد من إضافة Environment Variables في Vercel Dashboard:
  - `MONGODB_URI` (مطلوب)
  - `SESSION_SECRET` (مطلوب)
  - `CLOUDINARY_CLOUD_NAME` (اختياري)
  - `CLOUDINARY_API_KEY` (اختياري)
  - `CLOUDINARY_API_SECRET` (اختياري)

#### خطوات الحل:

1. **تحقق من Logs في Vercel:**
   - اذهب إلى Vercel Dashboard
   - اختر المشروع
   - اذهب إلى "Deployments"
   - اضغط على آخر deployment
   - شاهد "Function Logs" لرؤية الأخطاء

2. **تحقق من Build Logs:**
   - في نفس صفحة Deployment
   - شاهد "Build Logs" للتأكد من نجاح البناء

3. **تحقق من Environment Variables:**
   - Settings → Environment Variables
   - تأكد من وجود جميع المتغيرات المطلوبة
   - تأكد من أنها مضافة لـ Production و Preview

### 2. خطأ في الاتصال بقاعدة البيانات

**الأعراض:**
- `MongoServerError` أو `MongooseServerSelectionError`

**الحل:**
1. تحقق من `MONGODB_URI` في Vercel Dashboard
2. في MongoDB Atlas:
   - Network Access → Add IP Address
   - أضف `0.0.0.0/0` للسماح لجميع IPs (للاختبار)
   - أو أضف IPs الخاصة بـ Vercel

### 3. خطأ 500 Internal Server Error

**الأسباب المحتملة:**
- متغيرات البيئة مفقودة
- خطأ في الكود
- مشكلة في الاتصال بقاعدة البيانات

**الحل:**
1. راجع Function Logs في Vercel
2. تحقق من أن جميع dependencies مثبتة في `package.json`
3. تأكد من أن `api/server.js` موجود ويصدر الـ handler بشكل صحيح

### 4. الملفات الثابتة لا تظهر

**الحل:**
- الملفات في `public/` يتم خدمتها عبر Express
- تأكد من أن المسارات في `vercel.json` صحيحة

### 5. Sessions لا تعمل

**الحل:**
1. تأكد من إضافة `SESSION_SECRET` في Vercel
2. تأكد من أن `secure: true` في production (يتم تلقائياً)
3. تحقق من أن MongoDB connection يعمل (Sessions تُخزن في MongoDB)

## اختبار محلي مع Vercel CLI

```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# اختبار محلي
vercel dev
```

هذا سيشغل الموقع محلياً مع نفس البيئة التي على Vercel.

## التحقق من التكوين

### ملفات مهمة:
1. `api/server.js` - يجب أن يصدر handler
2. `vercel.json` - يجب أن يكون التكوين صحيح
3. `server.js` - يجب أن يصدر `app`
4. `package.json` - يجب أن يحتوي على جميع dependencies

### اختبار سريع:

```bash
# تحقق من أن الملفات موجودة
ls -la api/server.js
ls -la vercel.json
ls -la server.js

# تحقق من dependencies
npm install

# اختبار محلي
npm start
```

## نصائح إضافية

1. **استخدم Vercel CLI للاختبار:**
   ```bash
   vercel dev
   ```

2. **راجع Logs بعناية:**
   - Function Logs تعطيك معلومات دقيقة عن الأخطاء

3. **تأكد من Environment Variables:**
   - يجب إضافتها لكل Environment (Production, Preview, Development)

4. **تحقق من MongoDB Atlas:**
   - تأكد من أن Cluster يعمل
   - تحقق من Network Access
   - تحقق من Database User credentials

## الدعم

إذا استمرت المشكلة:
1. راجع Vercel Documentation: https://vercel.com/docs
2. راجع Function Logs في Vercel Dashboard
3. تأكد من أن جميع المتغيرات موجودة وصحيحة


