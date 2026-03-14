import { Router } from 'express';
import Experience from '../models/Experience.js';
import { requireAdmin } from '../middleware.js';

const router = Router();

// GET /api/experiences  — public
router.get('/', async (_req, res) => {
  try {
    const items = await Experience.find().sort({ order: 1, createdAt: 1 });
    res.json(items);
  } catch {
    res.status(500).json({ message: 'Failed to fetch experiences' });
  }
});

// POST /api/experiences  — admin
router.post('/', requireAdmin, async (req, res) => {
  try {
    const item = await Experience.create(req.body);
    res.status(201).json(item);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
});

// PUT /api/experiences/:id  — admin
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const item = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) { res.status(404).json({ message: 'Not found' }); return; }
    res.json(item);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
});

// DELETE /api/experiences/:id  — admin
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await Experience.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ message: 'Failed to delete' });
  }
});

export default router;
