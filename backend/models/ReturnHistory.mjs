import mongoose from 'mongoose';

const returnHistorySchema = new mongoose.Schema({
  itemTitle: { type: String, required: true },
  itemDescription: { type: String, required: true },
  itemContact: { type: String, required: true },
  studentId: { type: String, required: true },
  studentPhone: { type: String, required: true },
  returnedBy: { type: String, required: true }, // admin username
  returnedAt: { type: Date, default: Date.now },
  originalItemId: { type: mongoose.Schema.Types.ObjectId } // keep reference to original item
});

export default mongoose.model('ReturnHistory', returnHistorySchema);