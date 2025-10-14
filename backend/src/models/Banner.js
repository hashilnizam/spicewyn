import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Banner title is required'],
    trim: true
  },
  subtitle: String,
  description: String,
  image: {
    desktop: { type: String, required: true },
    mobile: String,
    tablet: String
  },
  link: {
    url: String,
    text: String,
    openInNewTab: { type: Boolean, default: false }
  },
  placement: {
    type: String,
    enum: ['home_hero', 'home_secondary', 'category_top', 'product_sidebar', 'checkout'],
    default: 'home_hero'
  },
  order: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  clickCount: {
    type: Number,
    default: 0
  },
  impressionCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('Banner', bannerSchema);
