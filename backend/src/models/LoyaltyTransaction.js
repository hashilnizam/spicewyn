import mongoose from 'mongoose';

const loyaltyTransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['earned', 'redeemed', 'expired', 'adjusted'],
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  expiresAt: Date,
  balanceAfter: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('LoyaltyTransaction', loyaltyTransactionSchema);
