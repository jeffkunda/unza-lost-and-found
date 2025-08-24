import mongoose from 'mongoose';

const returnSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  itemTitle: {
    type: String,
    required: true
  },
  studentId: {
    type: String,
    required: true
  },
  contactInfo: {
    type: String,
    required: true
  },
  claimDetails: {
    type: String,
    required: true
  },
  itemImageUrl: {
    type: String
  },
  approvedAt: {
    type: Date,
    required: true,
    default: Date.now
  }
}, {
  timestamps: true
});

const Return = mongoose.model('Return', returnSchema);

export default Return;