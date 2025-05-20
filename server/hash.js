// hash.js
import bcrypt from "bcryptjs"; // If using ES modules
// const bcrypt = require("bcryptjs"); // If using CommonJS

const password = "evalAcc"; // Replace with your desired password

bcrypt.hash(password, 10, (err, hash) => {
  if (err) throw err;
  console.log("Hashed password:", hash);
});