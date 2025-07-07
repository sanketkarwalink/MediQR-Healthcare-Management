// hash.js
import bcrypt from "bcryptjs";

const password = "saksham0"; // Replace with your desired password

bcrypt.hash(password, 10, (err, hash) => {
  if (err) throw err;
  console.log("Hashed password:", hash);
});