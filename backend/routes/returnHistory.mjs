import express from 'express';
import ReturnHistory from '../models/ReturnHistory.mjs';
import { verifyToken, permit } from '../middleware/auth.mjs';

const router = express.Router();

// Add to return history
router.post('/', verifyToken, permit('admin'), async (req, res) => {
  try {
    const historyEntry = new ReturnHistory(req.body);
    await historyEntry.save();
    res.status(201).json(historyEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all return history
router.get('/', verifyToken, permit('admin'), async (req, res) => {
  try {
    const history = await ReturnHistory.find().sort({ returnedAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;