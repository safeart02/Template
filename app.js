var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mysql = require('mysql2/promise');
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var studentRouter = require("./routes/student");
var studentgradeRouter = require("./routes/studentgrade");
var subjectRouter = require("./routes/subject");
var subjectaddRouter = require("./routes/subjectadd");
var tuitionRouter = require("./routes/tuition");
var loginRouter = require("./routes/login");
var studentdashboardRouter = require("./routes/studentdashboard");
var studentprofileRouter = require("./routes/studentprofile");
var adminsubjectRouter = require("./routes/adminsubject");
var syslogsRouter = require("./routes/syslogs");
var subjectpriceRouter = require("./routes/subjectprice");
var studentsubjectRouter = require("./routes/studentsubject");
var studenttuitionRouter = require("./routes/studenttuition");

var { CheckConnection } = require("./routes/repository/db_connect");
const verifyjwt = require("./middleware/authenticator");
const { initializemongodb } = require("./middleware/mongoose");
const roleCheck = require("./middleware/roleCheck");  // Import the roleCheck middleware

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER ,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

var app = express(); // ✅ Now `app` is initialized

// Initialize MongoDB session store and session middleware before routes
initializemongodb(app); // ✅ Now it's safe to call this

CheckConnection();

// View engine setup
app.set("views", path.join(__dirname, "views/Layouts"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// ✅ Allow public routes (No authentication)
app.use("/login", loginRouter); // Public route for login
app.use("/logout", (req, res, next) => {
  console.log("🚀 Skipping JWT check for /logout route");
  next();  // Allow the logout route to pass through without token check
});





app.get('/logout', (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to logout" });
    }

    // Clear the session cookie
    res.clearCookie('connect.sid');  // 'connect.sid' is the default cookie name for sessions in express-session

    // Redirect to login page after the session is destroyed
    res.redirect('/login');
  });
});

// ✅ Apply authentication middleware only after login (for protected routes)

app.use(verifyjwt);

app.get('/getUser', async (req, res) => {
  console.log("🔍 Checking req.user:", req.user);

  if (!req.user || !req.user.id || !req.user.role) {
    return res.status(401).json({ error: 'User not logged in' });
  }

  try {
    let query, values;

    if (req.user.role === 'student') {
      query = 'SELECT su_username AS username FROM student_user WHERE su_id = ?';
      values = [req.user.id];
    } else if (req.user.role === 'admin') {
      query = 'SELECT mu_username AS username FROM master_admin_user WHERE mu_id = ?';
      values = [req.user.id];
    } else {
      return res.status(400).json({ error: 'Invalid user role' });
    }

    const [rows] = await pool.query(query, values);

    if (rows.length > 0) {
      res.json({ username: rows[0].username });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error("❌ Database error:", error);
    res.status(500).json({ error: 'Database error' });
  }
});




// ✅ Protect these routes with authentication and role-based access control

app.use("/studentdashboard", roleCheck(['student']), studentdashboardRouter);  // Only accessible by students
app.use("/subject", roleCheck(['student']), subjectRouter);
app.use("/studentgrade", roleCheck(['student']), studentgradeRouter);
app.use("/studenttuition", roleCheck(['student']), studenttuitionRouter);
app.use("/", roleCheck(['admin']),  indexRouter);
app.use("/adminsubject", roleCheck(['admin']), adminsubjectRouter);
app.use("/syslogs", roleCheck(['admin']), syslogsRouter);

app.use("/student", roleCheck(['admin']), studentRouter);

// Student routes (only accessible to student users)

app.use("/studentprofile", roleCheck(['student']), studentprofileRouter);  // Only accessible by students


// Common routes (accessible to both admin and student)

app.use("/users", usersRouter);
app.use("/", indexRouter);


app.use("/subjectadd", subjectaddRouter);
app.use("/tuition", tuitionRouter);
app.use("/subjectprice", subjectpriceRouter);
app.use("/studentsubject", studentsubjectRouter);


// Logout route

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
