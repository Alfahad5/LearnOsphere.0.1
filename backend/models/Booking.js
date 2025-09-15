import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'fake'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentId: String,
  paymentDetails: {
    amount: Number,
    currency: String,
    paymentMethod: String,
    status: String,
    receiptUrl: String,
    processedAt: Date
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session'
  },
  notes: String
}, {
  timestamps: true
});

export default mongoose.model('Booking', bookingSchema);