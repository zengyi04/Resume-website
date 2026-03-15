import { Router } from 'express';
import { ExperienceModel } from '../models/experience.js';

const experienceRouter = Router();

experienceRouter.get('/', async (_req, res) => {
  const items = await ExperienceModel.find().sort({ createdAt: -1 }).lean();
  res.json(items);
});

experienceRouter.post('/', async (req, res) => {
  const created = await ExperienceModel.create(req.body);
  res.status(201).json(created);
});

experienceRouter.put('/:id', async (req, res) => {
  const updated = await ExperienceModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).lean();

  if (!updated) {
    res.status(404).json({ message: 'Experience not found' });
    return;
  }

  res.json(updated);
});

experienceRouter.delete('/:id', async (req, res) => {
  const deleted = await ExperienceModel.findByIdAndDelete(req.params.id).lean();

  if (!deleted) {
    res.status(404).json({ message: 'Experience not found' });
    return;
  }

  res.status(204).send();
});

export { experienceRouter };
