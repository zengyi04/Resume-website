import { Router } from 'express';
import { EducationModel } from '../models/education.js';

const educationRouter = Router();

educationRouter.get('/', async (_req, res) => {
  const items = await EducationModel.find().sort({ createdAt: -1 }).lean();
  res.json(items);
});

educationRouter.post('/', async (req, res) => {
  const created = await EducationModel.create(req.body);
  res.status(201).json(created);
});

educationRouter.put('/:id', async (req, res) => {
  const updated = await EducationModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).lean();

  if (!updated) {
    res.status(404).json({ message: 'Education not found' });
    return;
  }

  res.json(updated);
});

educationRouter.delete('/:id', async (req, res) => {
  const deleted = await EducationModel.findByIdAndDelete(req.params.id).lean();

  if (!deleted) {
    res.status(404).json({ message: 'Education not found' });
    return;
  }

  res.status(204).send();
});

export { educationRouter };
