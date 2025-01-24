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
  res.render('subjectprice', { title: 'Express' });
});

module.exports = router;

//fill edit subjects
router.get("/get-subjectprice/:id", (req, res) => {
  try {
    const subjectpriceId = req.params.id; // Get the subject ID from the request parameters

    if (!subjectpriceId) {
      return res.status(400).json({ message: "Subject Price ID is required" });
    }

    const sql = `SELECT * FROM master_subject_price WHERE msp_id = ${subjectpriceId}`; // SQL query to retrieve subject price by ID
    const params = [subjectpriceId]; // Query parameters

    Select(sql, (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ message: "Error executing query" });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Subject not found" });
      }

      res.status(200).json({
        message: "Subject Price retrieved successfully",
        subject: result[0], // Return the first (and expected only) result
      });
    });
  } catch (error) {
    console.error("Error fetching subject price data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/get-subjectprice", (req, res) => {
  try {
    let sql = `SELECT * FROM master_subject_price`;

    Select(sql, (err, result) => {
      if (err) throw err;
      res.status(200).json({
        message: "Subjects retrieved successfully",
        subjectsprice: result,
      });
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.post("/add-subjectprice", (req, res) => {
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
        message: "Subject Price added successfully",
        subjectprice: result,
      });
    });

  } catch (error) {
    res.status(500).json({ message: error });
  }
});

//This is for eliminating a subject
router.delete("/delete-subjectprice", (req, res) => {
  try {
    const subjectpriceId = req.body.id; // Extract the subject ID from the route parameters

    if (!subjectpriceId) {
      return res.status(400).json({ message: "Subject Price ID is required" });
    }

    // Construct the SQL query to delete the subject record
    const sql = `DELETE FROM master_subject_price WHERE msp_id = ${subjectpriceId}`;

    const params = [subjectpriceId]; // Bind the subject ID to the query

    Delete(sql, params, (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ message: "Error executing query" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Subject Price not found" });
      }

      res.status(200).json({ message: "Subject Price deleted successfully" });

    });
  } catch (error) {
    console.error("Error deleting subject:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/update-subjectprice/:id", (req, res) => {
  try {
    const subjectpriceId = req.params.id; // Extract the subject ID from the route parameters
    const { ms_code, ms_description, ms_status, ms_created_by, ms_created_date } = req.body;

    if (!subjectpriceId) {
      return res.status(400).json({ message: "Subject Price ID is required" });
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
      subjectpriceId, // Bind the subject ID for the WHERE clause
    ];

    // Use the existing method for executing the query (Update function)
    Update(sql, params, (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ message: "Error executing query", error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Subject Price not found or not updated" });
      }

      res.status(200).json({ message: "Subject Price updated successfully" });
    });

  } catch (error) {
    console.error("Error updating subject:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});
