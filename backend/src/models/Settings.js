import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  key: {
    type: String,
    unique: true,
    required: true
  },
  value: mongoose.Schema.Types.Mixed,
  category: {
    type: String,
    enum: ['general', 'store', 'payment', 'shipping', 'email', 'seo', 'social', 'analytics', 'theme', 'backup'],
    default: 'general'
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Settings', settingsSchema);
