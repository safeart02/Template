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
  res.render('tuition', { title: 'Express' });
});

module.exports = router;

router.get("/get-tuition", (req, res) => { 
  try {
    let sql = `SELECT * FROM student_tuition_fee`;

    Select(sql, (err, result) => {
      if (err) throw err;
      res.status(200).json({
        message: "Tuitions retrieved successfully", 
        tuitions: result, 
      });
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.get("/get-transaction/:tuitionId", (req, res) => {
  const { tuitionId } = req.params;

  // Ensure tuitionId is valid
  if (!tuitionId || isNaN(tuitionId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid tuition ID provided.",
    });
  }

  const sql = `
      SELECT 
          ttf_tuition_fee_id, 
          ttf_mode_of_payment, 
          ttf_amount, 
          ttf_previous_balance, 
          ttf_current_balance, 
          ttf_received_by, 
          ttf_paid_by 
      FROM transaction_tuition_fee 
      WHERE ttf_tuition_fee_id = ${tuitionId}`; // Directly inserting tuitionId

  Select(sql, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({
        success: false,
        message: "Error fetching tuition transactions.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tuition transactions retrieved successfully.",
      transactions: result,
    });
  });
});

