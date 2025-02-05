var express = require('express');
var router = express.Router();
var { Select } = require('../routes/repository/db_connect');

router.get('/', function (req, res, next) {
  res.render('studentdashboard', { title: 'Express' });
});


// Route to get the username for the logged-in student
router.get('/get-username', (req, res) => {
    const studentId = req.session.studentId;  // Assuming studentId is stored in session

    if (!studentId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const sql = `SELECT su_username FROM student_user WHERE su_student_id = ? AND su_status = 'active'`;

    Select(sql, [studentId], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error fetching username' });
        }
        if (results.length > 0) {
            return res.json({ username: results[0].su_username });
        } else {
            return res.status(404).json({ error: 'Username not found' });
        }
    });
});


module.exports = router;
