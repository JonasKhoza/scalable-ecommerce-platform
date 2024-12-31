import crypto from "crypto";

// Function to generate a secure random key
function generateJwtSecretKey() {
  // Generate a 256-bit (32-byte) random string
  const secretKey = crypto.randomBytes(32).toString("hex");
  console.log("Generated JWT Secret Key:", secretKey);
  return secretKey;
}

// Call the function and save the key to use in your application
const jwtSecretKey = generateJwtSecretKey();
console.log(jwtSecretKey);
let vary =
  "are these tokens the same? eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzcxMmZiMThlMmYyMjBjMTliMGI1MmUiLCJjcmVhdGVkQXQiOiIyMDI0LTEyLTI5VDExOjE3OjA1LjY3MloiLCJ1cGRhdGVkQXQiOiIyMDI0LTEyLTI5VDExOjE3OjA1LjY3MloiLCJpYXQiOjE3MzU2NjI5MjAsImV4cCI6MTczNTc0OTMyMH0.9tbKerkfr-SYJ2qdzLUND_RLQk13OD7s64LIRQnEgM4";
