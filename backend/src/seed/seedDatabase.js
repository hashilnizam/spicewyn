import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Banner from '../models/Banner.js';
import Coupon from '../models/Coupon.js';
import Settings from '../models/Settings.js';
import logger from '../utils/logger.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info('MongoDB Connected for seeding');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Banner.deleteMany({});
    await Coupon.deleteMany({});
    await Settings.deleteMany({});

    logger.info('Existing data cleared');

    // Create users
    const users = await User.create([
      {
        name: 'Super Admin',
        email: 'super@spicewyn.test',
        mobile: '9999999999',
        password: 'Password123!',
        role: 'super_admin',
        isVerified: true,
        isActive: true
      },
      {
        name: 'Admin User',
        email: 'admin@spicewyn.test',
        mobile: '9999999998',
        password: 'Password123!',
        role: 'admin',
        isVerified: true,
        isActive: true
      },
      {
        name: 'Staff User',
        email: 'staff@spicewyn.test',
        mobile: '9999999997',
        password: 'Password123!',
        role: 'staff',
        isVerified: true,
        isActive: true
      },
      {
        name: 'John Customer',
        email: 'customer@spicewyn.test',
        mobile: '9876543210',
        password: 'Password123!',
        role: 'customer',
        isVerified: true,
        isActive: true,
        loyaltyPoints: 500,
        addresses: [{
          label: 'Home',
          name: 'John Customer',
          mobile: '9876543210',
          addressLine1: '123 Main Street',
          addressLine2: 'Apartment 4B',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          country: 'India',
          isDefault: true
        }]
      }
    ]);

    logger.info('Users created');

    // Create categories
    const categories = await Category.create([
      {
        name: 'Whole Spices',
        slug: 'whole-spices',
        description: 'Premium quality whole spices sourced directly from farms',
        image: 'https://images.unsplash.com/photo-1596040033229-a0b8dc5d6962',
        isActive: true,
        order: 1,
        metaTitle: 'Buy Whole Spices Online - Premium Quality',
        metaDescription: 'Shop authentic whole spices online at best prices. Fresh, aromatic, and directly sourced from farms.'
      },
      {
        name: 'Ground Spices',
        slug: 'ground-spices',
        description: 'Freshly ground spice powders for everyday cooking',
        image: 'https://images.unsplash.com/photo-1599909533460-cb1749d0b5a2',
        isActive: true,
        order: 2,
        metaTitle: 'Ground Spices & Spice Powders Online',
        metaDescription: 'Premium ground spices and powders for authentic Indian cooking. 100% pure and natural.'
      },
      {
        name: 'Spice Blends',
        slug: 'spice-blends',
        description: 'Authentic spice blends and masalas',
        image: 'https://images.unsplash.com/photo-1505253304499-671c55fb57fe',
        isActive: true,
        order: 3
      },
      {
        name: 'Herbs & Seeds',
        slug: 'herbs-seeds',
        description: 'Fresh herbs and nutritious seeds',
        image: 'https://images.unsplash.com/photo-1587735243475-46d7bcb37985',
        isActive: true,
        order: 4
      },
      {
        name: 'Exotic Spices',
        slug: 'exotic-spices',
        description: 'Rare and exotic spices from around the world',
        image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b',
        isActive: true,
        order: 5
      }
    ]);

    logger.info('Categories created');

    // Create products
    const products = await Product.create([
      {
        name: 'Organic Turmeric Powder',
        slug: 'organic-turmeric-powder',
        description: 'Premium organic turmeric powder with high curcumin content. Known for its vibrant color and earthy flavor. Perfect for curries, golden milk, and health supplements.',
        shortDescription: 'Premium organic turmeric with high curcumin',
        category: categories[1]._id,
        images: [
          { url: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7', alt: 'Turmeric Powder', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5', alt: 'Turmeric', isPrimary: false }
        ],
        price: 149,
        compareAtPrice: 199,
        sku: 'GS-ORG-TUR001',
        stock: 250,
        lowStockThreshold: 50,
        tags: ['organic', 'turmeric', 'powder', 'curcumin', 'health'],
        ingredients: ['100% Organic Turmeric'],
        nutrition: {
          calories: '354 per 100g',
          protein: '7.8g',
          carbohydrates: '64.9g',
          fat: '9.9g',
          fiber: '21.1g'
        },
        origin: 'Kerala, India',
        brand: 'SpiceWyn Organic',
        weight: '100g',
        shelfLife: '12 months',
        isActive: true,
        isFeatured: true,
        isBestseller: true,
        ratings: { average: 4.7, count: 128 }
      },
      {
        name: 'Kashmiri Red Chili Powder',
        slug: 'kashmiri-red-chili-powder',
        description: 'Authentic Kashmiri red chili powder known for its vibrant red color and mild heat. Adds beautiful color to dishes without excessive spiciness.',
        shortDescription: 'Vibrant color, mild heat - Perfect for authentic dishes',
        category: categories[1]._id,
        images: [
          { url: 'https://images.unsplash.com/photo-1583032014808-5fda41b36334', alt: 'Red Chili Powder', isPrimary: true }
        ],
        price: 129,
        compareAtPrice: 169,
        sku: 'GS-KAS-CHI001',
        stock: 180,
        tags: ['kashmiri', 'chili', 'powder', 'mild', 'colorful'],
        origin: 'Kashmir, India',
        brand: 'SpiceWyn Premium',
        weight: '100g',
        isActive: true,
        isFeatured: true,
        ratings: { average: 4.5, count: 95 }
      },
      {
        name: 'Cinnamon Sticks - Ceylon',
        slug: 'cinnamon-sticks-ceylon',
        description: 'Premium Ceylon cinnamon sticks, known as true cinnamon. Sweeter and more delicate than Cassia cinnamon. Perfect for desserts, beverages, and savory dishes.',
        shortDescription: 'True Ceylon cinnamon - Sweet and delicate',
        category: categories[0]._id,
        images: [
          { url: 'https://images.unsplash.com/photo-1585508345026-7e876aff7020', alt: 'Ceylon Cinnamon', isPrimary: true }
        ],
        price: 299,
        compareAtPrice: 399,
        sku: 'WS-CEY-CIN001',
        stock: 120,
        tags: ['ceylon', 'cinnamon', 'sticks', 'premium', 'sweet'],
        origin: 'Sri Lanka',
        brand: 'SpiceWyn Premium',
        weight: '50g',
        isActive: true,
        isFeatured: true,
        isNewArrival: true,
        ratings: { average: 4.8, count: 67 }
      },
      {
        name: 'Cumin Seeds (Jeera)',
        slug: 'cumin-seeds-jeera',
        description: 'High-quality cumin seeds with strong aroma. Essential for Indian cooking, tempering, and spice blends. Rich in iron and aids digestion.',
        shortDescription: 'Essential for Indian cooking - Aromatic jeera',
        category: categories[0]._id,
        images: [
          { url: 'https://images.unsplash.com/photo-1596040033229-a0b8dc5d6962', alt: 'Cumin Seeds', isPrimary: true }
        ],
        price: 89,
        compareAtPrice: 119,
        sku: 'WS-CUM-SEE001',
        stock: 300,
        tags: ['cumin', 'jeera', 'seeds', 'tempering', 'digestive'],
        origin: 'Gujarat, India',
        brand: 'SpiceWyn',
        weight: '100g',
        isActive: true,
        isBestseller: true,
        ratings: { average: 4.6, count: 203 }
      },
      {
        name: 'Garam Masala Blend',
        slug: 'garam-masala-blend',
        description: 'Authentic garam masala blend with cinnamon, cardamom, cloves, cumin, coriander, and black pepper. Perfect finishing spice for curries and gravies.',
        shortDescription: 'Authentic Indian spice blend',
        category: categories[2]._id,
        images: [
          { url: 'https://images.unsplash.com/photo-1505253304499-671c55fb57fe', alt: 'Garam Masala', isPrimary: true }
        ],
        price: 159,
        compareAtPrice: 199,
        sku: 'BL-GAR-MAS001',
        stock: 200,
        tags: ['garam masala', 'blend', 'spice mix', 'authentic'],
        ingredients: ['Cinnamon', 'Cardamom', 'Cloves', 'Cumin', 'Coriander', 'Black Pepper'],
        brand: 'SpiceWyn',
        weight: '100g',
        isActive: true,
        isFeatured: true,
        ratings: { average: 4.7, count: 156 }
      },
      {
        name: 'Black Peppercorns',
        slug: 'black-peppercorns',
        description: 'Premium quality whole black peppercorns. Bold, pungent flavor perfect for seasoning, marinades, and fresh grinding.',
        shortDescription: 'Premium whole black pepper',
        category: categories[0]._id,
        images: [
          { url: 'https://images.unsplash.com/photo-1605522561233-768ad7a8fabf', alt: 'Black Pepper', isPrimary: true }
        ],
        price: 199,
        compareAtPrice: 249,
        sku: 'WS-BLK-PEP001',
        stock: 150,
        tags: ['black pepper', 'peppercorns', 'whole', 'premium'],
        origin: 'Kerala, India',
        brand: 'SpiceWyn Premium',
        weight: '100g',
        isActive: true,
        ratings: { average: 4.6, count: 89 }
      },
      {
        name: 'Cardamom Pods - Green',
        slug: 'cardamom-pods-green',
        description: 'Premium green cardamom pods with intense aroma. The queen of spices, perfect for both sweet and savory dishes, beverages, and desserts.',
        shortDescription: 'Queen of spices - Intensely aromatic',
        category: categories[0]._id,
        images: [
          { url: 'https://images.unsplash.com/photo-1599909533438-d4f3c8e9c8e8', alt: 'Green Cardamom', isPrimary: true }
        ],
        price: 399,
        compareAtPrice: 499,
        sku: 'WS-GRN-CAR001',
        stock: 80,
        tags: ['cardamom', 'elaichi', 'green', 'premium', 'aromatic'],
        origin: 'Kerala, India',
        brand: 'SpiceWyn Premium',
        weight: '50g',
        isActive: true,
        isFeatured: true,
        ratings: { average: 4.9, count: 134 }
      },
      {
        name: 'Coriander Powder',
        slug: 'coriander-powder',
        description: 'Freshly ground coriander powder with mild, citrusy flavor. Essential base spice for most Indian curries and vegetable preparations.',
        shortDescription: 'Essential base spice - Mild and citrusy',
        category: categories[1]._id,
        images: [
          { url: 'https://images.unsplash.com/photo-1599909533460-cb1749d0b5a2', alt: 'Coriander Powder', isPrimary: true }
        ],
        price: 79,
        compareAtPrice: 99,
        sku: 'GS-COR-POW001',
        stock: 220,
        tags: ['coriander', 'dhania', 'powder', 'essential'],
        origin: 'Rajasthan, India',
        brand: 'SpiceWyn',
        weight: '100g',
        isActive: true,
        isBestseller: true,
        ratings: { average: 4.5, count: 167 }
      },
      {
        name: 'Saffron Threads',
        slug: 'saffron-threads',
        description: 'Premium Kashmiri saffron threads - the most expensive spice in the world. Adds distinctive flavor, aroma, and golden color to dishes.',
        shortDescription: 'Premium Kashmiri Kesar - Worlds most expensive spice',
        category: categories[4]._id,
        images: [
          { url: 'https://images.unsplash.com/photo-1587735243475-46d7bcb37985', alt: 'Saffron', isPrimary: true }
        ],
        price: 899,
        compareAtPrice: 1199,
        sku: 'EX-SAF-THR001',
        stock: 30,
        lowStockThreshold: 10,
        tags: ['saffron', 'kesar', 'premium', 'exotic', 'luxury'],
        origin: 'Kashmir, India',
        brand: 'SpiceWyn Luxury',
        weight: '1g',
        isActive: true,
        isFeatured: true,
        isNewArrival: true,
        ratings: { average: 5.0, count: 45 }
      },
      {
        name: 'Mustard Seeds - Yellow',
        slug: 'mustard-seeds-yellow',
        description: 'High-quality yellow mustard seeds perfect for tempering, pickles, and marinades. Adds pungent flavor and crunch to dishes.',
        shortDescription: 'Perfect for tempering and pickles',
        category: categories[0]._id,
        images: [
          { url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d', alt: 'Mustard Seeds', isPrimary: true }
        ],
        price: 69,
        compareAtPrice: 89,
        sku: 'WS-MUS-YEL001',
        stock: 180,
        tags: ['mustard', 'seeds', 'yellow', 'tempering'],
        origin: 'Haryana, India',
        brand: 'SpiceWyn',
        weight: '100g',
        isActive: true,
        ratings: { average: 4.4, count: 72 }
      },
      {
        name: 'Fenugreek Seeds (Methi)',
        slug: 'fenugreek-seeds-methi',
        description: 'Bitter-sweet fenugreek seeds rich in fiber and protein. Used in curries, pickles, and as a health supplement.',
        shortDescription: 'Nutritious methi seeds - Rich in fiber',
        category: categories[3]._id,
        images: [
          { url: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f', alt: 'Fenugreek', isPrimary: true }
        ],
        price: 59,
        compareAtPrice: 79,
        sku: 'HS-FEN-SEE001',
        stock: 140,
        tags: ['fenugreek', 'methi', 'seeds', 'health', 'fiber'],
        origin: 'Rajasthan, India',
        brand: 'SpiceWyn',
        weight: '100g',
        isActive: true,
        ratings: { average: 4.3, count: 56 }
      },
      {
        name: 'Cloves (Laung)',
        slug: 'cloves-laung',
        description: 'Premium quality whole cloves with intense aroma and warm, sweet flavor. Perfect for biryanis, curries, and desserts.',
        shortDescription: 'Intensely aromatic whole cloves',
        category: categories[0]._id,
        images: [
          { url: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859', alt: 'Cloves', isPrimary: true }
        ],
        price: 249,
        compareAtPrice: 299,
        sku: 'WS-CLO-LAU001',
        stock: 110,
        tags: ['cloves', 'laung', 'whole', 'aromatic'],
        origin: 'Madagascar',
        brand: 'SpiceWyn Premium',
        weight: '50g',
        isActive: true,
        ratings: { average: 4.7, count: 88 }
      }
    ]);

    logger.info('Products created');

    // Create banners
    const banners = await Banner.create([
      {
        title: 'Premium Spices Collection',
        subtitle: 'Farm Fresh & Authentic',
        description: 'Get 25% off on your first order',
        image: {
          desktop: 'https://images.unsplash.com/photo-1596797038530-2c107229654b',
          mobile: 'https://images.unsplash.com/photo-1596797038530-2c107229654b',
          tablet: 'https://images.unsplash.com/photo-1596797038530-2c107229654b'
        },
        link: {
          url: '/products',
          text: 'Shop Now',
          openInNewTab: false
        },
        placement: 'home_hero',
        order: 1,
        isActive: true
      },
      {
        title: 'Organic Turmeric Sale',
        subtitle: 'Limited Time Offer',
        description: 'Buy 2 Get 1 Free on all turmeric products',
        image: {
          desktop: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7',
          mobile: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7'
        },
        link: {
          url: '/products/organic-turmeric-powder',
          text: 'Learn More',
          openInNewTab: false
        },
        placement: 'home_secondary',
        order: 2,
        isActive: true
      }
    ]);

    logger.info('Banners created');

    // Create coupons
    const coupons = await Coupon.create([
      {
        code: 'WELCOME25',
        description: 'Welcome offer for new customers - 25% off',
        discountType: 'percentage',
        discountValue: 25,
        minPurchaseAmount: 500,
        maxDiscountAmount: 250,
        expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        usageLimit: 1000,
        perUserLimit: 1,
        isActive: true,
        userSegment: 'new'
      },
      {
        code: 'FLAT100',
        description: 'Flat ₹100 off on orders above ₹1000',
        discountType: 'fixed',
        discountValue: 100,
        minPurchaseAmount: 1000,
        expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        usageLimit: 500,
        perUserLimit: 3,
        isActive: true,
        userSegment: 'all'
      },
      {
        code: 'VIP200',
        description: 'VIP customer exclusive - ₹200 off',
        discountType: 'fixed',
        discountValue: 200,
        minPurchaseAmount: 1500,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        isActive: true,
        userSegment: 'vip'
      }
    ]);

    logger.info('Coupons created');

    // Create settings
    await Settings.create([
      { key: 'site_name', value: 'SpiceWyn', category: 'general', isPublic: true },
      { key: 'site_tagline', value: 'Premium Spices Direct from Farms', category: 'general', isPublic: true },
      { key: 'currency', value: 'INR', category: 'store', isPublic: true },
      { key: 'currency_symbol', value: '₹', category: 'store', isPublic: true },
      { key: 'tax_rate', value: 5, category: 'store', isPublic: false },
      { key: 'free_shipping_threshold', value: 500, category: 'shipping', isPublic: true },
      { key: 'shipping_cost', value: 50, category: 'shipping', isPublic: true },
      { key: 'contact_email', value: 'support@spicewyn.com', category: 'general', isPublic: true },
      { key: 'contact_phone', value: '+91 9876543210', category: 'general', isPublic: true },
      { key: 'facebook_url', value: 'https://facebook.com/spicewyn', category: 'social', isPublic: true },
      { key: 'instagram_url', value: 'https://instagram.com/spicewyn', category: 'social', isPublic: true },
      { key: 'whatsapp_number', value: '919876543210', category: 'social', isPublic: true },
      { key: 'meta_title', value: 'SpiceWyn - Buy Premium Spices Online', category: 'seo', isPublic: true },
      { key: 'meta_description', value: 'Shop authentic spices online at SpiceWyn. Farm-fresh, premium quality spices delivered to your doorstep.', category: 'seo', isPublic: true },
      { key: 'theme', value: 'light', category: 'theme', isPublic: false },
      { key: 'loyalty_points_ratio', value: 100, category: 'store', isPublic: false }
    ]);

    logger.info('Settings created');

    logger.info('✅ Database seeded successfully!');
    logger.info('');
    logger.info('📧 Demo Credentials:');
    logger.info('Super Admin: super@spicewyn.test / Password123!');
    logger.info('Admin: admin@spicewyn.test / Password123!');
    logger.info('Staff: staff@spicewyn.test / Password123!');
    logger.info('Customer: customer@spicewyn.test / Password123!');
    logger.info('');

    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
