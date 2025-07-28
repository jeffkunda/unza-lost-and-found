import mongoose from 'mongoose';

const ReplySchema = new mongoose.Schema({
  message: { type: String, required: true },
  studentTag: { type: String },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Reply', ReplySchema);
