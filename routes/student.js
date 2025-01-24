var express = require("express");
var router = express.Router();
const {
  Select,
  Update,
  Insert,
  Delete,
} = require("../routes/repository/db_connect");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("student", { title: "Express" });
});

module.exports = router;

// This will handle fetching a student by ID
router.get("/get-student/:id", (req, res) => {
  try {
    const studentId = req.params.id; // Get the student ID from the request parameters

    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    const sql = `SELECT * FROM master_student WHERE ms_id = ${studentId}`; // SQL query to retrieve student by ID
    const params = [studentId]; // Query parameters

    Select(sql, (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ message: "Error executing query" });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Student not found" });
      }

      res.status(200).json({
        message: "Student retrieved successfully",
        student: result[0], // Return the first (and expected only) result
      });
    });
  } catch (error) {
    console.error("Error fetching student data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//This is for eliminating a student
router.delete("/delete-student/:id", (req, res) => {
  try {
    const studentId = req.params.id; // Extract the student ID from the route parameters

    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    // Construct the SQL query to delete the student record
    const sql = `DELETE FROM master_student WHERE ms_id = ${studentId}`;

    const params = [studentId]; // Bind the student ID to the query

    Delete(sql, params, (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ message: "Error executing query" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Student not found" });
      }

      res.status(200).json({ message: "Student deleted successfully" });
    });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// Update student data
router.put("/update-student/:id", (req, res) => {
  try {
    const studentId = req.params.id; // Extract the student ID from the route parameters
    const {
      ms_student_id,
      ms_first_name,
      ms_middle_name,
      ms_last_name,
      ms_date_of_birth,
      ms_contact_no,
      ms_email,
      ms_status,
      ms_address,
      ms_created_by,
      ms_created_date,
    } = req.body; // Extract updated fields from the request body

    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    // Construct the SQL query to update the student record
    const sql = `
      UPDATE master_student
      SET
        ms_student_id = ?,
        ms_first_name = ?,
        ms_middle_name = ?,
        ms_last_name = ?,
        ms_date_of_birth = ?,
        ms_contact_no = ?,
        ms_email = ?,
        ms_status = ?,
        ms_address = ?,
        ms_created_by = ?,
        ms_created_date = ?
      WHERE ms_id = ?`;

    const params = [
      ms_student_id,
      ms_first_name,
      ms_middle_name,
      ms_last_name,
      ms_date_of_birth,
      ms_contact_no,
      ms_email,
      ms_status,
      ms_address,
      ms_created_by,
      ms_created_date,
      studentId, // Bind the ID for the WHERE clause
    ];

    // Execute the query
    Update(sql, params, (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ message: "Error executing query" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Student not found or not updated" });
      }

      res.status(200).json({ message: "Student updated successfully" });
    });
  } catch (error) {
    console.error("Error updating student data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



//Display student data on the main table
router.get("/get-student", (req, res) => {
  try {
    let sql = `SELECT * FROM master_student`;

    Select(sql, (err, result) => {
      if (err) throw err;
      res.status(200).json({
        message: "Students retrieved successfully",
        students: result,
      });
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});
router.post("/add-student", (req, res) => {
  try {
    const {
      first_name,
      middle_name,
      last_name,
      date_of_birth,
      contact_no,
      email,
      address,
    } = req.body;
    const status = 'Enrolled';
    const created_by = 'Kent'
    const created_date = '2025-01-23';
    const student_id = '2025-01-0001'

    let sql = `INSERT INTO master_student(ms_student_id, ms_first_name, ms_middle_name, ms_last_name, ms_date_of_birth, ms_contact_no, ms_email, ms_address, ms_status, ms_created_by, ms_created_date) VALUES ?`;
    let data = [[student_id, first_name, middle_name, last_name, date_of_birth, contact_no, email, address, status, created_by, created_date]];

    Insert(sql, data, (err, result) => {
      if (err) throw err;
      res.status(200).json({
        message: "Student added successfully",
        student: result,
      });
    });

  } catch (error) {
    res.status(500).json({ message: error });
  }
});
router.put("/update-student", (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: error });
  }; 
});
router.delete("/delete-student", (req, res) => {});
