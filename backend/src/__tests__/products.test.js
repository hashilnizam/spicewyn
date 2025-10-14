import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import User from '../models/User.js';

describe('Product API', () => {
  let adminToken;
  let categoryId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/spicewyn-test');

    // Create admin user and get token
    const admin = new User({
      name: 'Admin User',
      email: 'admin@test.com',
      mobile: '9999999999',
      password: 'Password123!',
      role: 'admin',
      isVerified: true
    });
    await admin.save();

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'Password123!'
      });

    adminToken = loginRes.body.data.accessToken;

    // Create category
    const category = await Category.create({
      name: 'Test Category',
      slug: 'test-category'
    });
    categoryId = category._id;
  });

  afterAll(async () => {
    await Product.deleteMany({});
    await Category.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('GET /api/products', () => {
    it('should return all active products', async () => {
      const res = await request(app).get('/api/products');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('POST /api/products', () => {
    it('should create a new product (admin only)', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Product',
          description: 'Test Description',
          category: categoryId,
          price: 99.99,
          sku: 'TEST-001',
          stock: 100
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('_id');
      expect(res.body.data.name).toBe('Test Product');
    });

    it('should not create product without authentication', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({
          name: 'Test Product',
          description: 'Test Description',
          category: categoryId,
          price: 99.99,
          sku: 'TEST-002',
          stock: 100
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
