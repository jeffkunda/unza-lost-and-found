import express from 'express';
import Reply from '../models/Reply.mjs';

const router = express.Router();

// Create a reply
router.post('/', async (req, res) => {
  try {
    const { message, studentTag } = req.body;

    if (!message || !studentTag) {
      return res.status(400).json({ error: 'Message and studentTag are required' });
    }

    const newReply = new Reply({ message, studentTag });
    await newReply.save();
    res.status(201).json(newReply);
  } catch (error) {
    console.error('Error creating reply:', error.message);
    res.status(500).json({ error: 'Server error creating reply' });
  }
});

// Get all replies
router.get('/', async (req, res) => {
  try {
    const replies = await Reply.find().sort({ timestamp: -1 });
    res.json(replies);
  } catch (error) {
    console.error('Error fetching replies:', error.message);
    res.status(500).json({ error: 'Server error fetching replies' });
  }
});

export default router;
