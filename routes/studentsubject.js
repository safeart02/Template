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
  res.render('studentsubject', { title: 'Express' });
});

module.exports = router;

//Display student data on the main table
router.get("/get-studentsubject", (req, res) => {
  try {
    let sql = `SELECT * FROM student_grade`;

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