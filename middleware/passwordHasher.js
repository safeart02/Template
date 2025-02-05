const bcrypt = require("bcryptjs");
const { Select, Update } = require("../routes/repository/db_connect"); // Adjust the path as needed

async function hashExistingPasswords() {
  try {
    // Get all admin users
    Select("SELECT mu_id, mu_password FROM master_admin_user", async (err, users) => {
      if (err) {
        console.error("🔥 Error fetching admin users:", err);
        return;
      }

      for (const user of users) {
        if (user.mu_password) {
          const hashedPassword = await bcrypt.hash(user.mu_password, 10);
          
          // Update admin user password in database
          Update(
            `UPDATE master_admin_user SET mu_password = ? WHERE mu_id = ?`,
            [hashedPassword, user.mu_id],
            (updateErr) => {
              if (updateErr) {
                console.error(`❌ Failed to update admin user ${user.mu_id}:`, updateErr);
              } else {
                console.log(`✅ Password updated for admin user ID: ${user.mu_id}`);
              }
            }
          );
        }
      }
    });

    // Get all student users
    Select("SELECT su_id, su_password FROM student_user", async (err, students) => {
      if (err) {
        console.error("🔥 Error fetching student users:", err);
        return;
      }

      for (const student of students) {
        if (student.su_password) {
          const hashedPassword = await bcrypt.hash(student.su_password, 10);
          
          // Update student user password in database
          Update(
            `UPDATE student_user SET su_password = ? WHERE su_id = ?`,
            [hashedPassword, student.su_id],
            (updateErr) => {
              if (updateErr) {
                console.error(`❌ Failed to update student user ${student.su_id}:`, updateErr);
              } else {
                console.log(`✅ Password updated for student user ID: ${student.su_id}`);
              }
            }
          );
        }
      }
    });
  } catch (error) {
    console.error("🔥 Error hashing passwords:", error);
  }
}

hashExistingPasswords();
