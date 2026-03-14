import { Router } from 'express';
import Committee from '../models/Committee.js';
import { requireAdmin } from '../middleware.js';

const router = Router();

// GET /api/committees  — public
router.get('/', async (_req, res) => {
  try {
    const items = await Committee.find().sort({ createdAt: 1 });
    res.json(items);
  } catch {
    res.status(500).json({ message: 'Failed to fetch committees' });
  }
});

// POST /api/committees  — admin
router.post('/', requireAdmin, async (req, res) => {
  try {
    const item = await Committee.create(req.body);
    res.status(201).json(item);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
});

// PUT /api/committees/:id  — admin
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const item = await Committee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) { res.status(404).json({ message: 'Not found' }); return; }
    res.json(item);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
});

// DELETE /api/committees/:id  — admin
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await Committee.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ message: 'Failed to delete' });
  }
});

export default router;
