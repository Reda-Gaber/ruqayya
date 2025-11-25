require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');

const dbConnect = require('./models/DB');
const bcrypt = require("bcrypt");
const User = require('./models/user'); // استورد هنا بعد الـ session

const app = express();
const PORT = process.env.PORT || 3001;

// ------------------- Session & Security -------------------
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET || 'ruqayya-al-yami-very-very-2025-super-secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions',
    ttl: 7 * 24 * 60 * 60, // 7 أيام
  }),
  cookie: {
    httpOnly: true,
    secure: false,               // غيّر لـ true لما ترفع على HTTPS
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
}));

// ------------------- Middleware -------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "images")));

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ------------------- Database Connection -------------------
dbConnect().catch(err => {
  console.error('فشل الاتصال بـ MongoDB:', err.message);
  process.exit(1);
});

// ------------------- Auth Middleware (الحماية الكاملة) -------------------
const requireAuth = (req, res, next) => {
  if (req.session && req.session.authenticated) {
    next();
  } else {
    return res.redirect("/admin/login");
  }
};

// ------------------- Routes العادية (الفرونت) -------------------
app.get("/", (req, res) => res.render("index"));
app.get("/news", (req, res) => res.render("news"));
app.get("/sales", (req, res) => res.render("sales"));
app.get("/construction", (req, res) => res.render("construction"));
app.get("/decor", (req, res) => res.render("decor"));
app.get("/about", (req, res) => res.render("about"));
app.get("/contact", (req, res) => res.render("contact"));

app.get('/projects', async (req, res) => {
  try {
    const response = await fetch(`${req.protocol}://${req.get('host')}/api/projects`);
    const result = await response.json();
    res.render('admin/projects', {
      projects: result.success ? result.data : [],
      pageTitle: 'مشاريعنا - مؤسسة رقية اليامي للمقاولات'
    });
  } catch (err) {
    res.render('admin/projects', { projects: [], pageTitle: 'مشاريعنا' });
  }
});

app.get('/project/:id', async (req, res) => {
  try {
    const apiRes = await fetch(`http://localhost:3001/api/projects/${req.params.id}`);
    const result = await apiRes.json();
    res.render('project', {
      project: result.success ? result.data : null,
      pageTitle: result.success ? result.data.title : 'مشروع غير موجود'
    });
  } catch (err) {
    res.render('project', { project: null });
  }
});

app.use('/api/projects', require('./routes/api/projects'));

// ------------------- صفحة اللوجن (متاحة للكل) -------------------
app.get("/admin/login", (req, res) => {
  res.render("login");
});

// ------------------- تسجيل الدخول -------------------
app.post("/admin/login", async (req, res) => {
  try {
    await dbConnect();

    const username = (req.body.uname || req.body.username || "").toString().trim();
    const password = req.body.password || "";

    if (!username || !password) {
      return res.status(400).json({ error: "البيانات ناقصة" });
    }

    const user = await User.findOne({ username });
    if (!user || !await user.comparePassword(password)) {
      return res.status(400).json({ error: "اسم المستخدم أو كلمة المرور غير صحيحة" });
    }

    // حفظ الجلسة
    req.session.authenticated = true;
    req.session.user = { id: user._id, username: user.username };

    console.log("تم تسجيل الدخول بنجاح:", username);
    res.redirect("/admin/projects");

  } catch (err) {
    console.error("خطأ في تسجيل الدخول:", err.message);
    res.status(500).json({ error: "خطأ في السيرفر" });
  }
});

// ------------------- حماية كل routes الأدمن -------------------
app.use('/admin', requireAuth); // أي حاجة تبدأ بـ /admin لازم لوجن

// مثال إضافي لو عايز dashboard منفصل
// app.get('/admin/dashboard', requireAuth, (req, res) => res.render('admin/dashboard'));

// ------------------- تسجيل الخروج -------------------
app.get("/admin/logout", requireAuth, (req, res) => {
  req.session.destroy(() => {
    res.redirect("/admin/login");
  });
});

// ------------------- Routes الأدمن (محمية تلقائيًا بفضل app.use('/admin', requireAuth)) -------------------
app.use('/admin', require('./routes/projects.route')); // لو عندك routes تانية للأدمن

// ------------------- Tools مؤقتة (أزلها لما تخلّص التطوير) -------------------
app.get("/create-admin", async (req, res) => {
  try {
    await dbConnect();
    const username = "20002000";
    const password = "222000";

    await User.deleteOne({ username });
    const newUser = await User.create({ username, password });

    res.send(`
      <h1 style="color:green">تم إنشاء الأدمن بنجاح!</h1>
      <p>Username: <b>${username}</b></p>
      <p>Password: <b>${password}</b></p>
    `);
  } catch (err) {
    res.status(500).send("خطأ: " + err.message);
  }
});

app.get("/clean-users", async (req, res) => {
  await User.deleteMany({});
  res.send("تم مسح كل اليوزرز");
});

// ------------------- API Test -------------------
app.get("/api/test", async (req, res) => {
  await dbConnect();
  res.json({ message: "Express + MongoDB Connected ✓" });
});

// ------------------- Start Server -------------------
app.listen(PORT, () => {
  console.log(`Server running → http://localhost:${PORT}`);
  console.log(`Admin Login → http://localhost:${PORT}/admin/login`);
});