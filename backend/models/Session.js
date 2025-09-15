import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }],
  title: {
    type: String,
    required: true
  },
  description: String,
  jitsiLink: {
    type: String,
    required: true
  },
  jitsiRoomName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'active', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  duration: {
    type: Number,
    default: 60 // minutes
  },
  maxStudents: {
    type: Number,
    default: 10
  },
  scheduledDate: {
    type: Date,
    default: Date.now
  },
  language: String,
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  }
}, {
  timestamps: true
});

export default mongoose.model('Session', sessionSchema);