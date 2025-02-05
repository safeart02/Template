const express = require("express");
var router = express.Router();
const { Select } = require("../routes/repository/db_connect");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

// Login route
router.post("/", (req, res) => {
  console.log("Session before setting token:", req.session);  // Log the session object

  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // First, check for admin account
    const sqlAdmin = `SELECT * FROM master_admin_user WHERE mu_username = '${username}'`;
    Select(sqlAdmin, (err, rows) => {
      if (err) {
        console.error("🔥 Database Error:", err);
        return res.status(500).json({ message: "Server error, please try again later" });
      }

      if (rows && rows.length > 0) {
        const user = rows[0];

        // Verify password using bcrypt
        bcrypt.compare(password, user.mu_password, (err, isMatch) => {
          if (err) {
            console.error("🔥 Password Hashing Error:", err);
            return res.status(500).json({ message: "Error processing password" });
          }

          if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
          }

          // Generate JWT token
          let token;
          try {
            token = jwt.sign(
              { id: user.mu_id, username: user.mu_username, role: 'admin'},
              process.env.JWT_SECRET || "secret",
              { expiresIn: "1h" },
              
            );
          } catch (error) {
            console.error("🔥 Error generating JWT token:", error);
            return res.status(500).json({ message: "Failed to generate JWT token" });
          }

          // Store JWT token in the session (MongoDB session store)
          req.session.token = token;  // Store JWT in the session

          // Redirect to admin dashboard
          return res.status(200).json({ message: "Login successful", token: token, redirectTo: "/" });
        });
      } else {
        // Check for student account if not admin
        const sqlStudent = `SELECT * FROM student_user WHERE su_username = '${username}'`;
        Select(sqlStudent, (err, rows) => {
          if (err) {
            console.error("🔥 Database Error:", err);
            return res.status(500).json({ message: "Server error, please try again later" });
          }

          if (!rows || rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
          }

          const student = rows[0];

          // Verify password using bcrypt
          bcrypt.compare(password, student.su_password, (err, isMatch) => {
            if (err) {
              console.error("🔥 Password Hashing Error:", err);
              return res.status(500).json({ message: "Error processing password" });
            }

            if (!isMatch) {
              return res.status(401).json({ message: "Invalid credentials" });
            }

            // Generate JWT token
            let token;
            try {
              token = jwt.sign(
                { id: student.su_id, username: student.su_username, role: 'student' },
                process.env.JWT_SECRET || "secret",
                { expiresIn: "1h" }
              );
            } catch (error) {
              console.error("🔥 Error generating JWT token:", error);
              return res.status(500).json({ message: "Failed to generate JWT token" });
            }

            // Store JWT token in the session
            req.session.token = token;  // Store JWT in the session

            // Redirect to student dashboard
            return res.status(200).json({ message: "Login successful", token: token, redirectTo: "/studentdashboard" });
          });
        });
      }
    });
  } catch (error) {
    console.error("🔥 General Error:", error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
});

module.exports = router;
