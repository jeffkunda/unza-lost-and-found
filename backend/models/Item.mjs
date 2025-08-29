import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Item title is required'],
      trim: true,
    },
    locationFound: {
      type: String,
      required: [true, 'Location found is required'],
      trim: true,
    },
    contactInfo: {
      type: String,
      required: [true, 'Contact information is required'],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, 'Image is required'], // Changed from default: null to required
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    claimed: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

const Item = mongoose.model('Item', itemSchema);
export default Item;