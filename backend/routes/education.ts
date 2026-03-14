import { Router } from 'express';
import Education from '../models/Education.js';
import { requireAdmin } from '../middleware.js';

const router = Router();

// GET /api/educations  — public
router.get('/', async (_req, res) => {
  try {
    const items = await Education.find().sort({ createdAt: 1 });
    res.json(items);
  } catch {
    res.status(500).json({ message: 'Failed to fetch educations' });
  }
});

// POST /api/educations  — admin
router.post('/', requireAdmin, async (req, res) => {
  try {
    const item = await Education.create(req.body);
    res.status(201).json(item);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
});

// PUT /api/educations/:id  — admin
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const item = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) { res.status(404).json({ message: 'Not found' }); return; }
    res.json(item);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
});

// DELETE /api/educations/:id  — admin
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await Education.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ message: 'Failed to delete' });
  }
});

export default router;
