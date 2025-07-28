import express from 'express';
import Claim from '../models/Claim.mjs';
import Item from '../models/Item.mjs';
import { verifyToken, permit } from '../middleware/auth.mjs';

const router = express.Router();

// ✅ Submit a claim (student)
router.post('/', verifyToken, permit('student'), async (req, res) => {
  try {
    const { itemId, detail, studentId, phone } = req.body;

    if (!itemId || !detail || !studentId || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.claimed = true;
    await item.save();

    const claim = new Claim({
      item: itemId,
      detail,
      studentId,
      phone,
      username: req.user.username
    });

    await claim.save();
    res.status(201).json({ message: 'Claim submitted successfully', claim });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Get all claims (admin only)
router.get('/', verifyToken, permit('admin'), async (req, res) => {
  try {
    const claims = await Claim.find().populate('item');
    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
