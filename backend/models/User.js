import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const CURRENT_YEAR = new Date().getFullYear();

/**
 * Sub-schemas used in profile.trainer fields
 */
const LanguageSchema = new mongoose.Schema({
  language: { type: String, trim: true, required: true },
  proficiency: { type: String, enum: ['Native', 'Fluent'], default: 'Fluent' },
  teachingLevel: [{ type: String, trim: true }] // e.g. 'Beginner','Intermediate','Advanced','Business','Exam Prep'
}, { _id: false });

const CertificationSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true },
  issuer: { type: String, trim: true, default: '' },
  year: {
    type: Number,
    validate: {
      validator: function (v) {
        if (v === undefined || v === null || v === '') return true;
        return Number.isInteger(v) && v >= 1950 && v <= CURRENT_YEAR;
      },
      message: props => `Certification year must be between 1950 and ${CURRENT_YEAR}`
    },
    default: ''
  }
}, { _id: false });

const AvailabilitySchema = new mongoose.Schema({
  day: { type: String, trim: true, required: true }, // monday..sunday
  startTime: { type: String, default: null }, // store 'HH:MM' or ISO substring
  endTime: { type: String, default: null },
  available: { type: Boolean, default: false }
}, { _id: false });

/**
 * Main user schema
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['student', 'trainer'],
    required: true
  },
  // profile contains generic user profile and a trainer-specific subset
  profile: {
    bio: { type: String, trim: true, default: '' },

    // simple list when the user is a student or fallback short format
    languages: [{ type: String, trim: true }],

    // trainer rich languages (if using richer structure)
    trainerLanguages: { type: [LanguageSchema], default: [] },

    // trainer-specific numeric fields
    experience: { type: Number, min: 0, default: 0 }, // years
    hourlyRate: { type: Number, min: 0, default: 25 },

    avatar: { type: String, trim: true, default: '' },
    phone: { type: String, trim: true, default: '' },
    location: { type: String, trim: true, default: '' },

    // tags and specializations
    specializations: { type: [String], default: [] },

    // certifications
    certifications: { type: [CertificationSchema], default: [] },

    // availability
    availability: { type: [AvailabilitySchema], default: [] },

    // demo video embed url (youtube embed or watch url)
    demoVideo: { type: String, trim: true, default: '' },

    // profile images (public urls)
    profileImages: { type: [String], default: [] },

    // social links
    socialMedia: {
      instagram: { type: String, trim: true, default: '' },
      youtube: { type: String, trim: true, default: '' },
      linkedin: { type: String, trim: true, default: '' },
      // additional keys allowed by storing as Mixed if needed
    },

    // teaching style & student demographics
    teachingStyle: { type: String, trim: true, default: 'Conversational' },
    studentAge: { type: [String], default: [] }, // e.g., ['Kids', 'Teens', 'Adults']

    isAvailable: { type: Boolean, default: true },

    // optional quick stats (mirror of user.stats or derived)
    totalBookings: { type: Number, default: 0 },
    averageRating: { type: Number, default: 5.0 }
  },

  isActive: {
    type: Boolean,
    default: true
  },

  stats: {
    totalSessions: { type: Number, default: 0 },
    completedSessions: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    rating: { type: Number, default: 5.0 }
  }
}, {
  timestamps: true
});

/**
 * Password hashing
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Compare candidate password
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Convenience: ensure availability array contains all days (optional)
 */
userSchema.methods.ensureFullAvailability = function () {
  const ALL_DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
  const existing = (this.profile?.availability || []).reduce((acc, a) => { acc[a.day] = a; return acc; }, {});
  this.profile = this.profile || {};
  this.profile.availability = ALL_DAYS.map(d => {
    if (existing[d]) return existing[d];
    return { day: d, startTime: null, endTime: null, available: false };
  });
  return this;
};

export default mongoose.model('User', userSchema);