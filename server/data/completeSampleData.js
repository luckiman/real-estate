require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import essential models
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Category = require('../models/Category');
const ProductBrand = require('../models/ProductBrand');
const Review = require('../models/Review');
const WishList = require('../models/WishList');

// Sample Categories
const sampleCategories = [
  {
    name: "Villa",
    displayName: "Villa",
    systemName: "villa",
    description: "Luxury villas with premium amenities",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800"
  },
  {
    name: "Apartment",
    displayName: "Apartment",
    systemName: "apartment",
    description: "Modern apartments in prime locations",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"
  },
  {
    name: "Condo",
    displayName: "Condo",
    systemName: "condo",
    description: "Luxury condominiums with resort-style living",
    image: "https://images.unsplash.com/photo-1519974719765-e6559eac2575?w=800"
  }
];

// Sample Brands
const sampleBrands = [
  {
    name: "Luxury Homes",
    description: "Premium real estate developer",
    logo: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800"
  },
  {
    name: "Urban Living",
    description: "Modern urban properties",
    logo: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"
  },
  {
    name: "Coastal Properties",
    description: "Beachfront and waterfront properties",
    logo: "https://images.unsplash.com/photo-1519974719765-e6559eac2575?w=800"
  }
];

// Sample Users with hashed passwords
const sampleUsers = [
  {
    name: "John Doe",
    email: "john@example.com",
    gender: "male",
    password: bcrypt.hashSync("password123", 10),
    role: "admin",
    avatar: {
      public_id: "avatars/admin",
      url: "https://ui-avatars.com/api/?name=John+Doe"
    }
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    gender: "female",
    password: bcrypt.hashSync("password123", 10),
    role: "user",
    avatar: {
      public_id: "avatars/user",
      url: "https://ui-avatars.com/api/?name=Jane+Smith"
    }
  }
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Drop existing collections
    const collections = ['categories', 'productbrands', 'users', 'products', 'reviews', 'wishlists'];
    for (const collection of collections) {
      try {
        await mongoose.connection.db.dropCollection(collection);
        console.log(`Dropped collection: ${collection}`);
      } catch (err) {
        // Ignore collection not found errors
        if (err.code !== 26) {
          console.error(`Error dropping collection ${collection}:`, err);
        }
      }
    }

    // Create categories
    const categories = await Category.insertMany(sampleCategories);
    console.log('Categories created:', categories.length);

    // Create brands
    const brands = await ProductBrand.insertMany(sampleBrands);
    console.log('Brands created:', brands.length);

    // Create users
    const users = await User.insertMany(sampleUsers);
    console.log('Users created:', users.length);

    // Create products with references
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
        specifications: [
          {
            title: "Property Type",
            description: "Villa"
          },
          {
            title: "Size",
            description: "450 sq m"
          },
          {
            title: "Bedrooms",
            description: "5 spacious bedrooms"
          },
          {
            title: "Bathrooms",
            description: "4 luxury bathrooms"
          },
          {
            title: "Parking",
            description: "2 car garage"
          },
          {
            title: "Year Built",
            description: "2020"
          }
        ],
        price: 1200000,
        cuttedPrice: 1300000,
        images: [
          {
            public_id: "real_estate/villa_1",
            url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800"
          }
        ],
        brand: {
          name: brands[0].name,
          logo: {
            public_id: "real_estate/brand_1",
            url: brands[0].logo
          }
        },
        category: "Villa",
        stock: 1,
        warranty: 1,
        ratings: 4.8,
        numOfReviews: 5,
        user: users[0]._id,
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
        specifications: [
          {
            title: "Property Type",
            description: "Apartment"
          },
          {
            title: "Size",
            description: "85 sq m"
          },
          {
            title: "Bedrooms",
            description: "2 bedrooms"
          },
          {
            title: "Bathrooms",
            description: "2 bathrooms"
          },
          {
            title: "Parking",
            description: "1 car space"
          },
          {
            title: "Year Built",
            description: "2021"
          }
        ],
        price: 450000,
        cuttedPrice: 480000,
        images: [
          {
            public_id: "real_estate/apartment_1",
            url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"
          }
        ],
        brand: {
          name: brands[1].name,
          logo: {
            public_id: "real_estate/brand_2",
            url: brands[1].logo
          }
        },
        category: "Apartment",
        stock: 1,
        warranty: 1,
        ratings: 4.5,
        numOfReviews: 3,
        user: users[0]._id,
        reviews: []
      }
    ];

    const products = await Product.insertMany(sampleProperties);
    console.log('Products created:', products.length);

    // Create reviews
    const sampleReviews = [
      {
        user: users[0]._id,
        product: products[0]._id,
        rating: 5,
        comment: "Amazing property with great amenities!"
      },
      {
        user: users[1]._id,
        product: products[1]._id,
        rating: 4,
        comment: "Great location and modern design"
      }
    ];

    const reviews = await Review.insertMany(sampleReviews);
    console.log('Reviews created:', reviews.length);

    // Create wishlists
    const sampleWishlists = [
      {
        user: users[0]._id,
        product: products[0]._id
      },
      {
        user: users[1]._id,
        product: products[1]._id
      }
    ];

    const wishlists = await WishList.insertMany(sampleWishlists);
    console.log('Wishlists created:', wishlists.length);

    console.log('Database seeding completed successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 