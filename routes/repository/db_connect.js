const mysql = require("mysql");

require("dotenv").config();

let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

exports.CheckConnection = () => {
  try {
    connection.connect((err) => {
      if (err) return console.error(err.message);

      console.log("Connected to the database!");
    });
  } catch (err) {
    console.log(err);
  }
};

exports.Select = (sql, callback) => {
  try {
    connection.connect((err) => {
      return err;
    });
    connection.query(sql, (error, results, fields) => {
      if (error) {
        console.log(error);

        return callback(error, null);
      }
      callback(null, results);
    });
  } catch (error) {
    console.log(error);
  }
};

exports.Update = (sql, data, callback) => {
  try {
    // Assuming you're using a connection pool or a single connection (avoid connecting every time)
    connection.query(sql, data, (error, results, fields) => {
      if (error) {
        console.error("Error updating:", error.message);
        callback(error, null);  // Return error to callback
      } else {
        console.log("Rows affected:", results.affectedRows);
        callback(null, results);  // Return result to callback
      }
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    callback(err, null);  // Return unexpected error to callback
  }
};


exports.Insert = (stmt, todos, callback) => {
    try {
      connection.connect((err) => {
        return err;
      });
      // console.log(statement: ${stmt} data: ${todos});
  
      connection.query(stmt, [todos], (err, results, fields) => {
        if (err) {
          callback(err, null);
        }
        // callback(null, Row inserted: ${results});
        let data = [
          {
            rows: results.affectedRows,
            id: results.insertId,
          },
        ];
        callback(null, data);
        // console.log(Row inserted: ${results.affectedRows});
      });
    } catch (error) {
      callback(error, null);
    }
}

exports.Delete = (sql, data, callback) => {
  try {
    // Assuming you're using a connection pool or a single connection (avoid connecting every time)
    connection.query(sql, data, (error, results, fields) => {
      if (error) {
        console.error("Error deleting:", error.message);
        callback(error, null);  // Return error to callback
      } else {
        console.log("Rows affected:", results.affectedRows);
        callback(null, results);  // Return result to callback
      }
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    callback(err, null);  // Return unexpected error to callback
  }
};

