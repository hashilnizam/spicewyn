import mongoose from 'mongoose';

const backupLogSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true
  },
  fileUrl: String,
  fileSize: Number,
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'failed'],
    default: 'pending'
  },
  type: {
    type: String,
    enum: ['manual', 'automatic'],
    default: 'manual'
  },
  triggeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  error: String,
  startedAt: Date,
  completedAt: Date
}, {
  timestamps: true
});

export default mongoose.model('BackupLog', backupLogSchema);
