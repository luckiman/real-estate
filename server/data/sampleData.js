require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Product = require('../models/productModel');

const sampleProperties = [
  {
    name: "Luxury Villa with Pool",
    description: "Stunning 5-bedroom villa with private pool and garden",
    highlights: [
      "5 Bedrooms",
      "Private Pool",
      "Landscaped Garden",
      "Double Garage",
      "Smart Home System"
    ],
    specifications: {
      "Property Type": "Villa",
      "Size": "450 sq m",
      "Bedrooms": "5",
      "Bathrooms": "4",
      "Parking": "2 cars",
      "Year Built": "2020"
    },
    price: 1200000,
    images: [
      {
        url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
        public_id: "real_estate/villa_1"
      },
      {
        url: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800",
        public_id: "real_estate/villa_2"
      }
    ],
    brand: "Luxury Homes",
    category: "Villa",
    stock: 1,
    warranty: "1 year structural warranty",
    ratings: 4.8,
    numOfReviews: 5,
    user: "REPLACE_WITH_ACTUAL_USER_ID", // Replace this with the ID from sampleUser.js
    reviews: []
  },
  {
    name: "Modern City Apartment",
    description: "Contemporary 2-bedroom apartment in the heart of the city",
    highlights: [
      "2 Bedrooms",
      "City Views",
      "Modern Kitchen",
      "Gym Access",
      "24/7 Security"
    ],
    specifications: {
      "Property Type": "Apartment",
      "Size": "85 sq m",
      "Bedrooms": "2",
      "Bathrooms": "2",
      "Parking": "1 car",
      "Year Built": "2021"
    },
    price: 450000,
    images: [
      {
        url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
        public_id: "real_estate/apartment_1"
      },
      {
        url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
        public_id: "real_estate/apartment_2"
      }
    ],
    brand: "Urban Living",
    category: "Apartment",
    stock: 1,
    warranty: "1 year fixtures warranty",
    ratings: 4.5,
    numOfReviews: 3,
    user: "REPLACE_WITH_ACTUAL_USER_ID", // Replace this with the ID from sampleUser.js
    reviews: []
  },
  {
    name: "Beachfront Condo",
    description: "Luxurious 3-bedroom condo with stunning ocean views",
    highlights: [
      "3 Bedrooms",
      "Ocean Views",
      "Private Beach Access",
      "Resort Amenities",
      "Covered Parking"
    ],
    specifications: {
      "Property Type": "Condo",
      "Size": "200 sq m",
      "Bedrooms": "3",
      "Bathrooms": "3",
      "Parking": "2 cars",
      "Year Built": "2019"
    },
    price: 850000,
    images: [
      {
        url: "https://images.unsplash.com/photo-1519974719765-e6559eac2575?w=800",
        public_id: "real_estate/condo_1"
      },
      {
        url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
        public_id: "real_estate/condo_2"
      }
    ],
    brand: "Coastal Properties",
    category: "Condo",
    stock: 1,
    warranty: "2 year comprehensive warranty",
    ratings: 4.9,
    numOfReviews: 7,
    user: "REPLACE_WITH_ACTUAL_USER_ID", // Replace this with the ID from sampleUser.js
    reviews: []
  }
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Delete existing products
    await Product.deleteMany();
    console.log('Existing products deleted');

    // Insert new products
    const products = await Product.insertMany(sampleProperties);
    console.log('Sample properties added:', products.length);

    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 