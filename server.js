require("dotenv").config();
const express = require("express");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");

const multer = require("multer");
const { storage } = require("./config/cloudinary"); // أو المسار اللي عندك
const upload = multer({ storage });

const dbConnect = require("./models/DB");
const mongoose = require("mongoose");
const User = require("./models/user");
const Project = require("./models/projects.model");
const News = require("./models/news.model");

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cookieParser());

app.use(
  session({
    secret:
      process.env.SESSION_SECRET ||
      "ruqayya-al-yami-very-very-2025-super-secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
      ttl: 7 * 24 * 60 * 60,
    }),
    cookie: {
      httpOnly: true,
      secure: false, // غيّر لـ true لما ترفع على HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files with caching
app.use(express.static(path.join(__dirname, "public"), {
  maxAge: '1y',
  etag: true,
  lastModified: true
}));
app.use(express.static(path.join(__dirname, "images"), {
  maxAge: '1y',
  etag: true,
  lastModified: true
}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

dbConnect().catch((err) => {
  console.error("فشل الاتصال بـ MongoDB:", err.message);
  process.exit(1);
});

app.use(async (req, res, next) => {
  try {
    const SiteSettings = require("./models/settings.model");
    let settings = await SiteSettings.getSettings();
    
    // تحديث العنوان والأرقام إذا كانت قديمة
    if (!settings.address || settings.address.includes('الرياض') || settings.address.includes('الملقا')) {
      settings.address = "نجران رجلاء حي فواز";
      await SiteSettings.findOneAndUpdate({}, { address: "نجران رجلاء حي فواز" }, { upsert: true });
    }
    
    // تحديث الأرقام إذا كانت قديمة
    if (!settings.phones || settings.phones.length === 0 || settings.phones[0].includes('966501234567')) {
      settings.phones = ["0503119104", "0560864811"];
      await SiteSettings.findOneAndUpdate({}, { phones: ["0503119104", "0560864811"] }, { upsert: true });
    }
    
    res.locals.settings = settings;
  } catch (err) {
    res.locals.settings = {
      siteName: "مؤسسة رقية اليامي",
      phones: ["0503119104", "0560864811"],
      address: "نجران رجلاء حي فواز",
      email: "info@roqaya-alyami.sa",
      social: {},
    };
  }
  next();
});

const requireAuth = (req, res, next) => {
  if (req.session && req.session.authenticated) {
    next();
  } else {
    return res.redirect("/admin/login");
  }
};

app.get("/", (req, res) => res.render("index"));

app.get("/about", (req, res) => res.render("about"));

app.get("/contact", (req, res) => res.render("contact"));

app.get("/construction", async (req, res) => {
  try {
    const projects = await Project.find({ category: 'مشاريع إنشائية' }).sort({
      createdAt: -1,
    });
    res.render("construction", {
      constructionProjects: projects,
      pageTitle: "المقاولات الإنشائية",
    });
  } catch (err) {
    console.error("خطأ في جلب المشاريع الإنشائية:", err.message);
    res.render("construction", {
      constructionProjects: [],
      pageTitle: "المقاولات الإنشائية",
    });
  }
});

app.get("/decor", async (req, res) => {
  try {
    const projects = await Project.find({ category: "ديكورات داخلية" }).sort({
      createdAt: -1,
    });

    res.render("decor", {
      title: "الديكورات الداخلية - مؤسسة رقية اليامي",
      projects: projects, 
    });
  } catch (err) {
    console.error("خطأ في جلب مشاريع الديكور:", err.message);
    res.render("decor", {
      title: "الديكورات الداخلية - مؤسسة رقية اليامي",
      projects: [],
    });
  }
});

app.get("/news", async (req, res) => {
  try {
    // Set cache headers for better performance
    res.set('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
    const news = await News.find().sort({ createdAt: -1 }).lean(); // Use lean() for better performance
    res.render("news", {
      newsList: news,
      pageTitle: "الأخبار والفعاليات",
    });
  } catch (err) {
    console.error("خطأ في جلب الأخبار:", err.message);
    res.render("news", { newsList: [], pageTitle: "الأخبار" });
  }
});

app.get("/news/:id", async (req, res) => {
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).render("news-detail", {
        news: null,
        pageTitle: "الخبر غير موجود",
        error: "معرف الخبر غير صحيح",
      });
    }

    const newsItem = await News.findById(req.params.id);
    if (!newsItem) {
      return res.status(404).render("news-detail", {
        news: null,
        pageTitle: "الخبر غير موجود",
        error: "الخبر المطلوب غير موجود",
      });
    }
    res.render("news-detail", {
      news: newsItem,
      pageTitle: newsItem.title,
    });
  } catch (err) {
    console.error("خطأ في جلب تفاصيل الخبر:", err.message);
    res.status(500).render("news-detail", {
      news: null,
      pageTitle: "خطأ",
      error: "حدث خطأ في تحميل الخبر",
    });
  }
});

app.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.render("projects", {
      projects,
      pageTitle: "جميع المشاريع",
    });
  } catch (err) {
    console.error("خطأ في جلب المشاريع:", err.message);
    res.render("projects", { projects: [], pageTitle: "جميع المشاريع" });
  }
});

app.get("/project/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).render("404", { pageTitle: "المشروع غير موجود" });
    }
    res.render("project", {
      project,
      pageTitle: project.title,
    });
  } catch (err) {
    console.error("خطأ في جلب تفاصيل المشروع:", err.message);
    res.status(500).render("404", { pageTitle: "خطأ في تحميل المشروع" });
  }
});

// Public API endpoint for fetching all news - MUST be before /api/ routes
app.get("/api/news", async (req, res) => {
  try {
    // Set cache headers
    res.set('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
    const news = await News.find().sort({ createdAt: -1 }).lean(); // Use lean() for better performance
    res.json({ success: true, news });
  } catch (err) {
    console.error("خطأ جلب الأخبار:", err.message);
    res.status(500).json({ success: false, message: "فشل جلب الأخبار" });
  }
});

// API endpoint for single news item - MUST be before /api/ routes
app.get("/api/news/:id", async (req, res) => {
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "معرف الخبر غير صحيح" });
    }

    const newsItem = await News.findById(req.params.id);
    if (!newsItem) {
      return res.status(404).json({ success: false, message: "الخبر غير موجود" });
    }
    res.json({ success: true, news: newsItem });
  } catch (err) {
    console.error("خطأ في جلب تفاصيل الخبر:", err.message);
    res.status(500).json({ success: false, message: "فشل جلب الخبر" });
  }
});

app.use("/api/", require("./routes/api/projects"));

app.get("/admin/login", (req, res) => {
  res.render("login");
});

app.post("/admin/login", async (req, res) => {
  try {
    const username = (req.body.uname || req.body.username || "")
      .toString()
      .trim();
    const password = req.body.password || "";

    if (!username || !password) {
      return res.status(400).json({ error: "البيانات ناقصة" });
    }

    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(400)
        .json({ error: "اسم المستخدم أو كلمة المرور غير صحيحة" });
    }

    req.session.authenticated = true;
    req.session.user = { id: user._id, username: user.username };

    console.log("تم تسجيل الدخول بنجاح:", username);
    res.redirect("/admin/projects");
  } catch (err) {
    console.error("خطأ في تسجيل الدخول:", err.message);
    res.status(500).json({ error: "خطأ في السيرفر" });
  }
});

app.get("/interior", async (req, res) => {
  try {
    const interiorProjects = await Project.find({
      category: "ديكورات داخلية",
    }).sort({ createdAt: -1 });

    res.render("interior", {
      title: "الديكورات الداخلية - مؤسسة رقية اليامي",
      projects: interiorProjects,
    });
  } catch (err) {
    console.error("خطأ في جلب المشاريع الداخلية:", err.message);
    res.render("interior", {
      title: "الديكورات الداخلية - مؤسسة رقية اليامي",
      projects: [],
    });
  }
});

app.use("/admin", requireAuth);

app.use("/admin", require("./routes/projects.route"));

app.get("/admin/logout", requireAuth, (req, res) => {
  req.session.destroy(() => {
    res.redirect("/admin/login");
  });
});

app.get("/create-admin", async (req, res) => {
  try {
    const username = "20002000";
    const password = "222000";
    await User.deleteOne({ username });
    await User.create({ username, password });
    res.send(
      `<h1 style="color:green">تم إنشاء الأدمن!</h1><p>User: ${username} | Pass: ${password}</p>`
    );
  } catch (err) {
    res.status(500).send("خطأ: " + err.message);
  }
});

app.use("/admin/api/employees", require("./routes/employee.route"));
app.use("/api/settings", require("./routes/api/settings.route"));

app.get("/admin/api/news", async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json({ success: true, news });
  } catch (err) {
    console.error("خطأ جلب الأخبار:", err.message);
    res.status(500).json({ success: false, message: "فشل جلب الأخبار" });
  }
});

app.post("/admin/api/news", upload.single("image"), async (req, res) => {
  try {
    const { title, description } = req.body;

    const newsItem = await News.create({
      title,
      description,
      image: req.file ? req.file.path : null, // هياخد الصورة من Cloudinary
    });

    res.json({ success: true, news: newsItem });
  } catch (err) {
    console.error("خطأ إضافة خبر:", err.message);
    res.status(500).json({ success: false, message: "فشل إضافة الخبر" });
  }
});

app.delete("/admin/api/news/:id", async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("خطأ حذف الخبر:", err.message);
    res.status(500).json({ success: false, message: "فشل حذف الخبر" });
  }
});

// Export app for serverless compatibility
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running → http://localhost:${PORT}`);
    console.log(`Admin Login → http://localhost:${PORT}/admin/login`);
    console.log(`Construction Page → http://localhost:${PORT}/construction`);
    console.log(`All Projects → http://localhost:${PORT}/projects`);
  });
}

module.exports = app;
