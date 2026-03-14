import { Router } from 'express';
import Achievement from '../models/Achievement.js';
import { requireAdmin } from '../middleware.js';

const router = Router();

// GET /api/achievements  — public
router.get('/', async (_req, res) => {
  try {
    const items = await Achievement.find().sort({ createdAt: 1 });
    res.json(items);
  } catch {
    res.status(500).json({ message: 'Failed to fetch achievements' });
  }
});

// POST /api/achievements  — admin
router.post('/', requireAdmin, async (req, res) => {
  try {
    const item = await Achievement.create(req.body);
    res.status(201).json(item);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
});

// PUT /api/achievements/:id  — admin
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const item = await Achievement.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) { res.status(404).json({ message: 'Not found' }); return; }
    res.json(item);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
});

// DELETE /api/achievements/:id  — admin
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await Achievement.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ message: 'Failed to delete' });
  }
});

export default router;
