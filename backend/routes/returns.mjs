import express from 'express';
import Return from '../models/Return.mjs';
import { verifyToken, permit } from '../middleware/auth.mjs';

const router = express.Router();

// Record a return
router.post('/', verifyToken, permit('admin'), async (req, res) => {
  try {
    const newReturn = new Return(req.body);
    await newReturn.save();
    res.status(201).json(newReturn);
  } catch (error) {
    console.error('Error recording return:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get all returns
router.get('/', verifyToken, permit('admin'), async (req, res) => {
  try {
    const returns = await Return.find().sort({ returnedAt: -1 });
    res.json(returns);
  } catch (error) {
    console.error('Error fetching returns:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get return count
router.get('/count', verifyToken, permit('admin'), async (req, res) => {
  try {
    const count = await Return.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error('Error getting return count:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;