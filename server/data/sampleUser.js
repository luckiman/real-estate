require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/userModel');

const sampleUser = {
  name: "John Doe",
  email: "john@example.com",
  gender: "male",
  password: "password123",
  role: "admin"
};

// Function to seed the user
const seedUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Create user
    const user = await User.create(sampleUser);
    console.log('Sample user created with ID:', user._id);
    console.log('Use this ID in sampleData.js');

    process.exit();
  } catch (error) {
    console.error('Error creating user:', error);
    process.exit(1);
  }
};

seedUser(); 