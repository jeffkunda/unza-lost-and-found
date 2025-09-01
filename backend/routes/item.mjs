import express from 'express';
import mongoose from 'mongoose';
import Item from '../models/Item.mjs';
import { verifyToken, permit } from '../middleware/auth.mjs';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log('✅ Created uploads directory');
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

/**
 * ✅ GET: All items
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const { category } = req.query;
    let filter = {};
    
    if (category && ['electronics', 'clothing', 'bag', 'id', 'studentid', 'wallet', 'keys'].includes(category)) {
      filter.category = category;
    }
    
    const items = await Item.find(filter).populate('postedBy', 'username role');
    res.json(items);
  } catch (error) {
    console.error('❌ GET / error:', error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * ✅ GET: Search by title and/or category
 */
router.get('/search', verifyToken, async (req, res) => {
  try {
    const { q, category } = req.query;
    
    // If both q and category are empty, return all items
    if (!q && !category) {
      const items = await Item.find().populate('postedBy', 'username role');
      return res.json(items);
    }

    let filter = {};
    
    if (q) {
      filter.title = new RegExp(q, 'i');
    }
    
    if (category && ['electronics', 'clothing', 'bag', 'id', 'studentid', 'wallet', 'keys'].includes(category)) {
      filter.category = category;
    }

    const items = await Item.find(filter).populate('postedBy', 'username role');
    res.json(items);
  } catch (error) {
    console.error('❌ GET /search error:', error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * ✅ POST: Add item (no date)
 */
router.post('/', verifyToken, permit('student'), upload.single('image'), async (req, res) => {
  try {
    const { title, locationFound, contactInfo, category } = req.body;

    if (!title?.trim() || !locationFound?.trim() || !contactInfo?.trim() || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!['electronics', 'clothing', 'bag', 'id', 'studentid', 'wallet', 'keys'].includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const item = new Item({
      title: title.trim(),
      locationFound: locationFound.trim(),
      contactInfo: contactInfo.trim(),
      category,
      imageUrl,
      postedBy: req.user.id
    });

    await item.save();
    res.status(201).json({ message: 'Item posted', item });
  } catch (error) {
    console.error('❌ Error posting item:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation failed',
        details: error.errors
      });
    }

    res.status(500).json({ message: error.message });
  }
});

/**
 * ✅ DELETE: Admin only
 */
router.delete('/:id', verifyToken, permit('admin'), async (req, res) => {
  console.log('DELETE route called with id:', req.params.id);
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid item ID' });
    }

    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    await Item.findByIdAndDelete(id);

    if (item.imageUrl) {
      const filepath = path.join(process.cwd(), item.imageUrl);
      fs.unlink(filepath, (err) => {
        if (err) console.error('Failed to delete image file:', err);
      });
    }

    res.json({ message: 'Item deleted' });
  } catch (error) {
    console.error('❌ DELETE error:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;