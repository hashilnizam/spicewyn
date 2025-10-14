import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  attachments: [String],
  isStaff: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ticketSchema = new mongoose.Schema({
  ticketNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  guestEmail: {
    type: String
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['order', 'product', 'payment', 'shipping', 'return', 'other'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'waiting_customer', 'resolved', 'closed'],
    default: 'open'
  },
  messages: [messageSchema],
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  relatedOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  tags: [String],
  resolvedAt: Date,
  closedAt: Date
}, {
  timestamps: true
});

// Generate ticket number
ticketSchema.pre('save', async function(next) {
  if (!this.ticketNumber) {
    const count = await mongoose.model('Ticket').countDocuments();
    this.ticketNumber = `TKT-${Date.now()}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

export default mongoose.model('Ticket', ticketSchema);
