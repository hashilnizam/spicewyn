import mongoose from 'mongoose';
import slugify from 'slugify';

const variantSchema = new mongoose.Schema({
  size: String,
  weight: String,
  price: Number,
  compareAtPrice: Number,
  sku: String,
  stock: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
});

const nutritionSchema = new mongoose.Schema({
  calories: String,
  protein: String,
  carbohydrates: String,
  fat: String,
  fiber: String,
  sodium: String
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  shortDescription: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: { type: Boolean, default: false }
  }],
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  compareAtPrice: {
    type: Number,
    min: 0
  },
  costPrice: {
    type: Number,
    min: 0
  },
  sku: {
    type: String,
    unique: true,
    required: [true, 'SKU is required']
  },
  barcode: String,
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  lowStockThreshold: {
    type: Number,
    default: 10
  },
  variants: [variantSchema],
  tags: [String],
  ingredients: [String],
  nutrition: nutritionSchema,
  expiryDate: Date,
  manufacturingDate: Date,
  shelfLife: String,
  origin: String,
  brand: String,
  weight: String,
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: { type: String, default: 'cm' }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isBestseller: {
    type: Boolean,
    default: false
  },
  isNewArrival: {
    type: Boolean,
    default: false
  },
  ratings: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  metaTitle: String,
  metaDescription: String,
  metaKeywords: [String],
  ogImage: String,
  canonicalUrl: String,
  structuredData: mongoose.Schema.Types.Mixed,
  totalSales: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Generate slug before saving
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// Check low stock
productSchema.virtual('isLowStock').get(function() {
  return this.stock <= this.lowStockThreshold;
});

// Check if expired
productSchema.virtual('isExpired').get(function() {
  return this.expiryDate && this.expiryDate < new Date();
});

// Virtual for reviews
productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product'
});

// Index for search
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

export default mongoose.model('Product', productSchema);
