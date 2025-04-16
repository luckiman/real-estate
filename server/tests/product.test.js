const mongoose = require('mongoose');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const app = require('../app');
const request = require('supertest');

// Test data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  role: 'admin'
};

const testProduct = {
  name: 'Test Property',
  description: 'A beautiful test property',
  address: {
    street: '123 Test St',
    city: 'Test City',
    state: 'TS',
    zip: '12345'
  },
  propertyType: 'house',
  price: 2000,
  securityDeposit: 2000,
  bedrooms: 3,
  bathrooms: 2,
  squareFootage: 1500,
  amenities: ['pool', 'gym'],
  leaseTerms: {
    minLeaseMonths: 12,
    maxLeaseMonths: 24
  },
  availabilityDate: new Date(),
  isAvailable: true
};

let token;
let productId;

beforeAll(async () => {
  // Connect to test database
  await mongoose.connect(process.env.MONGO_URI_TEST);
  
  // Create test user
  const user = await User.create(testUser);
  
  // Login to get token
  const response = await request(app)
    .post('/api/v1/login')
    .send({
      email: testUser.email,
      password: testUser.password
    });
  
  token = response.body.token;
});

afterAll(async () => {
  // Clean up test database
  await Product.deleteMany({});
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe('Product CRUD Operations', () => {
  test('Create Product', async () => {
    const response = await request(app)
      .post('/api/v1/admin/product/new')
      .set('Authorization', `Bearer ${token}`)
      .send(testProduct);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.product.name).toBe(testProduct.name);
    productId = response.body.product._id;
  });

  test('Get All Products', async () => {
    const response = await request(app)
      .get('/api/v1/products')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.products)).toBe(true);
  });

  test('Get Single Product', async () => {
    const response = await request(app)
      .get(`/api/v1/product/${productId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.product._id).toBe(productId);
  });

  test('Update Product', async () => {
    const updatedData = {
      ...testProduct,
      name: 'Updated Test Property',
      price: 2500
    };

    const response = await request(app)
      .put(`/api/v1/admin/product/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.product.name).toBe('Updated Test Property');
    expect(response.body.product.price).toBe(2500);
  });

  test('Delete Product', async () => {
    const response = await request(app)
      .delete(`/api/v1/admin/product/${productId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    // Verify product is deleted
    const getResponse = await request(app)
      .get(`/api/v1/product/${productId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(getResponse.status).toBe(404);
  });
}); 