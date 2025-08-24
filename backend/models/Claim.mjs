import mongoose from 'mongoose';

const claimSchema = new mongoose.Schema({
  item: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Item', 
    required: true,
    index: true // Added for better query performance
  },
  detail: { 
    type: String, 
    required: [true, 'Detail is required'],
    trim: true
  },
  studentId: { 
    type: String, 
    required: [true, 'Student ID is required'],
    trim: true
  },
  phone: { 
    type: String, 
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[0-9]{10,15}$/, 'Please enter a valid phone number']
  },
  username: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'returned'],
    default: 'pending'
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    immutable: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Update timestamp on save
claimSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add static method for safe deletion
claimSchema.statics.safeDelete = async function(claimId) {
  try {
    const claim = await this.findByIdAndDelete(claimId);
    if (!claim) {
      throw new Error('Claim not found');
    }
    return claim;
  } catch (error) {
    console.error('Claim deletion error:', error);
    throw error;
  }
};

// Add query helper to find claims by item
claimSchema.query.byItem = function(itemId) {
  return this.where({ item: itemId });
};

// Virtual for formatted phone number
claimSchema.virtual('formattedPhone').get(function() {
  return this.phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
});

// Indexes for better performance
claimSchema.index({ item: 1, studentId: 1 });
claimSchema.index({ createdAt: -1 });

const Claim = mongoose.model('Claim', claimSchema);

export default Claim;