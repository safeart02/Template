var express = require('express');
var router = express.Router();
const {
  Select,
  Update,
  Insert,
  Delete,
} = require("../routes/repository/db_connect");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('adminsubject', { title: 'Express' });
});

module.exports = router;

//fill edit subjects
router.get("/get-subject/:id", (req, res) => {
  try {
    const subjectId = req.params.id; // Get the subject ID from the request parameters

    if (!subjectId) {
      return res.status(400).json({ message: "Subject ID is required" });
    }

    const sql = `SELECT * FROM master_subject WHERE ms_id = ${subjectId}`; // SQL query to retrieve subject by ID
    const params = [subjectId]; // Query parameters

    Select(sql, (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ message: "Error executing query" });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Subject not found" });
      }

      res.status(200).json({
        message: "Subject retrieved successfully",
        subject: result[0], // Return the first (and expected only) result
      });
    });
  } catch (error) {
    console.error("Error fetching subject data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/get-subject", (req, res) => {
  try {
    let sql = `SELECT * FROM master_subject`;

    Select(sql, (err, result) => {
      if (err) throw err;
      res.status(200).json({
        message: "Subjects retrieved successfully",
        subjects: result,
      });
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.post("/add-subject", (req, res) => {
  try {
    const {
      code,
      description,
      status,
    } = req.body;
    const created_by = 'Kent'
    const created_date = '2025-01-23';

    let sql = `INSERT INTO master_subject(ms_code, ms_description, ms_status, ms_created_by, ms_created_date) VALUES ?`;
    let data = [[code, description, status, created_by, created_date]];

    Insert(sql, data, (err, result) => {
      if (err) throw err;
      res.status(200).json({
        message: "Subject added successfully",
        subject: result,
      });
    });

  } catch (error) {
    res.status(500).json({ message: error });
  }
});

//This is for eliminating a subject
router.delete("/delete-subject", (req, res) => {
  try {
    const subjectId = req.body.id; // Extract the subject ID from the route parameters

    if (!subjectId) {
      return res.status(400).json({ message: "Subject ID is required" });
    }

    // Construct the SQL query to delete the subject record
    const sql = `DELETE FROM master_subject WHERE ms_id = ${subjectId}`;

    const params = [subjectId]; // Bind the subject ID to the query

    Delete(sql, params, (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ message: "Error executing query" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Subject not found" });
      }

      res.status(200).json({ message: "Subject deleted successfully" });

    });
  } catch (error) {
    console.error("Error deleting subject:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/update-subject/:id", (req, res) => {
  try {
    const subjectId = req.params.id; // Extract the subject ID from the route parameters
    const { ms_code, ms_description, ms_status, ms_created_by, ms_created_date } = req.body;

    if (!subjectId) {
      return res.status(400).json({ message: "Subject ID is required" });
    }

    // Construct the SQL query to update the subject record
    const sql = `
      UPDATE master_subject
      SET ms_code = ?, ms_description = ?, ms_status = ?, ms_created_by = ?, ms_created_date = ?
      WHERE ms_id = ?
    `;

    const params = [
      ms_code,
      ms_description,
      ms_status,
      ms_created_by,
      ms_created_date,
      subjectId, // Bind the subject ID for the WHERE clause
    ];

    // Use the existing method for executing the query (Update function)
    Update(sql, params, (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ message: "Error executing query", error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Subject not found or not updated" });
      }

      res.status(200).json({ message: "Subject updated successfully" });
    });

  } catch (error) {
    console.error("Error updating subject:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});
