const express = require("express");
const path = require("path");

const app = express();
const PORT = 3003;

// Static files
app.use(express.static(path.join(__dirname, "./public")));
app.use(express.static(path.join(__dirname, "./images")));

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/news", (req, res) => res.render("news"));
app.get("/sales", (req, res) => res.render("sales"));
app.get("/construction", (req, res) => res.render("construction"));
app.get("/decor", (req, res) => res.render("decor"));
app.get("/about", (req, res) => res.render("about"));
app.get("/contact", (req, res) => res.render("contact"));

app.listen(PORT, (err) => {
    console.error(err ? err : `http://localhost:${PORT}`)
})

// CLOUDINARY_URL=cloudinary://948753347448127:**********@dqu7geevt
// CLOUDINARY_URL=cloudinary://948753347448127:ER_WBKXkcfDMswFmkn3cKbABmtg@dqu7geevt