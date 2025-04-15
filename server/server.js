const path = require('path');
require("dotenv").config({ path: path.join(__dirname, '.env') });
const app = require("./app");
const connectDatabase = require("./config/database");
const cloudinary = require("cloudinary");
console.log('Environment PORT:', process.env.PORT);
const PORT = process.env.PORT || 4098;

// UncaughtException Error
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  process.exit(1);
});

connectDatabase();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = app.listen(PORT, () => {
  console.log(`Server running`);
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
