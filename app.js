var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var studentRouter = require("./routes/student");
var studentgradeRouter = require("./routes/studentgrade");
var subjectRouter = require("./routes/subject");
var subjectaddRouter = require("./routes/subjectadd");
var studentregistrationRouter = require("./routes/studentregistration");
var tuitionRouter = require("./routes/tuition");
var loginRouter = require("./routes/login");
var studentdashboardRouter = require("./routes/studentdashboard");
var studentprofileRouter = require("./routes/studentprofile");
var adminsubjectRouter = require("./routes/adminsubject");
var syslogsRouter = require("./routes/syslogs");
var subjectpriceRouter = require("./routes/subjectprice");
var studentsubjectRouter = require("./routes/studentsubject");

var { CheckConnection } = require("./routes/repository/db_connect");

var app = express();

CheckConnection();

// view engine setup
app.set("views", path.join(__dirname, "views/Layouts"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/login", loginRouter);
app.use("/student", studentRouter);
app.use("/studentgrade", studentgradeRouter);
app.use("/subject", subjectRouter);
app.use("/subjectadd", subjectaddRouter);
app.use("/studentregistration", studentregistrationRouter);
app.use("/tuition", tuitionRouter);
app.use("/studentdashboard", studentdashboardRouter);
app.use("/studentprofile", studentprofileRouter);
app.use("/adminsubject", adminsubjectRouter);
app.use("/syslogs", syslogsRouter);
app.use("/subjectprice", subjectpriceRouter);
app.use("/studentsubject", studentsubjectRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
