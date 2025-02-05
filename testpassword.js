const bcrypt = require('bcryptjs');

const testPassword = '1234';

bcrypt.hash(testPassword, 10, (err, hashedPassword) => {
  if (err) {
    console.error("Error hashing password:", err);
  } else {
    console.log("Hashed Password:", hashedPassword);
  }
});
