import { Router } from 'express';
import { AchievementModel } from '../models/achievement.js';

const achievementsRouter = Router();

achievementsRouter.get('/', async (_req, res) => {
  const items = await AchievementModel.find().sort({ createdAt: -1 }).lean();
  res.json(items);
});

achievementsRouter.post('/', async (req, res) => {
  const created = await AchievementModel.create(req.body);
  res.status(201).json(created);
});

achievementsRouter.put('/:id', async (req, res) => {
  const updated = await AchievementModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).lean();

  if (!updated) {
    res.status(404).json({ message: 'Achievement not found' });
    return;
  }

  res.json(updated);
});

achievementsRouter.delete('/:id', async (req, res) => {
  const deleted = await AchievementModel.findByIdAndDelete(req.params.id).lean();

  if (!deleted) {
    res.status(404).json({ message: 'Achievement not found' });
    return;
  }

  res.status(204).send();
});

export { achievementsRouter };
