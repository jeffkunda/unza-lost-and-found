import mongoose from 'mongoose';

const approvedReturnSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
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
  contact: {
    type: String,
    required: true
  },
  approvedDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const ApprovedReturn = mongoose.model('ApprovedReturn', approvedReturnSchema);

export default ApprovedReturn;