require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;
console.log('MongoDB URI:', MONGO_URI);

const connectDatabase = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDatabase;
