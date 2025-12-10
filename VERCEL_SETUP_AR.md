# دليل النشر على Vercel - بالعربية

## المتطلبات الأساسية

قبل النشر، تأكد من:
1. حساب Vercel (سجل من https://vercel.com)
2. MongoDB Atlas cluster جاهز
3. Cloudinary account (لرفع الصور)

## الخطوات المهمة جداً

### 1. إضافة Environment Variables في Vercel

**هذه الخطوة ضرورية جداً - بدونها الموقع لن يعمل!**

1. اذهب إلى Vercel Dashboard
2. اختر مشروعك (أو أنشئ مشروع جديد)
3. اذهب إلى **Settings** → **Environment Variables**
4. أضف المتغيرات التالية:

#### متغيرات مطلوبة (Required):

```
MONGODB_URI
mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
```

```
SESSION_SECRET
(أنشئ واحد عشوائي - يمكن استخدام: openssl rand -base64 32)
```

#### متغيرات اختيارية (Optional):

```
CLOUDINARY_CLOUD_NAME
(اسم الـ cloud في Cloudinary)
```

```
CLOUDINARY_API_KEY
(مفتاح API من Cloudinary)
```

```
CLOUDINARY_API_SECRET
(السر الخاص بـ Cloudinary)
```

```
FRONTEND_URL
(رابط الموقع الأمامي - مثال: https://yourdomain.com)
```

### 2. إعداد MongoDB Atlas

1. اذهب إلى MongoDB Atlas Dashboard
2. **Network Access** → **Add IP Address**
3. أضف `0.0.0.0/0` للسماح لجميع IPs (للاختبار)
   - أو أضف IPs الخاصة بـ Vercel
4. تأكد من أن Database User موجود وله صلاحيات

### 3. النشر

#### الطريقة الأولى: عبر Vercel CLI

```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# النشر
vercel

# للنشر على Production
vercel --prod
```

#### الطريقة الثانية: عبر GitHub

1. ادفع الكود إلى GitHub
2. اذهب إلى https://vercel.com/new
3. استورد الـ repository
4. Vercel سيكتشف التكوين تلقائياً
5. **مهم جداً:** أضف Environment Variables قبل النشر
6. اضغط Deploy

## التحقق من النشر

بعد النشر:

1. اذهب إلى Vercel Dashboard
2. اختر المشروع
3. اذهب إلى **Deployments**
4. اضغط على آخر deployment
5. شاهد **Function Logs** للتأكد من عدم وجود أخطاء

## حل المشاكل الشائعة

### الموقع لا يعمل

1. **تحقق من Environment Variables:**
   - تأكد من إضافتها في Vercel Dashboard
   - تأكد من أنها مضافة لـ Production و Preview

2. **تحقق من Logs:**
   - Function Logs في Vercel Dashboard
   - ابحث عن أخطاء MongoDB أو متغيرات مفقودة

3. **تحقق من MongoDB:**
   - تأكد من أن Cluster يعمل
   - تحقق من Network Access
   - تحقق من Connection String

### خطأ في الاتصال بقاعدة البيانات

- تحقق من `MONGODB_URI` في Vercel
- تأكد من إضافة IP في MongoDB Atlas Network Access
- تحقق من Database User credentials

### Sessions لا تعمل

- تأكد من إضافة `SESSION_SECRET`
- تحقق من أن MongoDB connection يعمل (Sessions تُخزن في MongoDB)

## الملفات المهمة

- `api/server.js` - نقطة الدخول لـ Vercel
- `server.js` - التطبيق الرئيسي
- `vercel.json` - تكوين Vercel
- `package.json` - Dependencies

## نصائح

1. استخدم `vercel dev` للاختبار محلياً قبل النشر
2. راجع Logs بعناية عند حدوث مشاكل
3. تأكد من إضافة جميع Environment Variables قبل النشر
4. اختبر الموقع بعد النشر مباشرة

## الدعم

- Vercel Docs: https://vercel.com/docs
- Vercel Community: https://github.com/vercel/vercel/discussions

