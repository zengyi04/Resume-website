import { Router } from 'express';
import Home from '../models/Home.js';
import { requireAdmin } from '../middleware.js';

const router = Router();

// GET /api/home  — public
router.get('/', async (_req, res) => {
  try {
    const doc = await Home.findOne();
    res.json(doc);
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch home data' });
  }
});

// PUT /api/home  — admin only
router.put('/', requireAdmin, async (req, res) => {
  try {
    const doc = await Home.findOne();
    if (doc) {
      Object.assign(doc, req.body);
      await doc.save();
      res.json(doc);
    } else {
      const created = await Home.create(req.body);
      res.json(created);
    }
  } catch (e) {
    res.status(500).json({ message: 'Failed to update home data' });
  }
});

export default router;
