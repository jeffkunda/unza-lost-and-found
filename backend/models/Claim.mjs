import mongoose from 'mongoose';

const claimSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  detail: { type: String, required: true },         // Describe the item in detail
  studentId: { type: String, required: true },       // Student ID
  phone: { type: String, required: true },           // Phone number
  username: String,                                  // Optional: who submitted it
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Claim', claimSchema);
