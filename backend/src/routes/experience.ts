import { Router } from 'express';
import { ExperienceModel } from '../models/experience.js';

const experienceRouter = Router();

experienceRouter.get('/', async (_req, res) => {
  try {
    const items = await ExperienceModel.find().sort({ createdAt: -1 }).lean();
    res.json(items);
  } catch (error) {
    console.error('Failed to fetch experiences:', error);
    res.status(500).json({ message: 'Failed to fetch experiences.' });
  }
});

experienceRouter.post('/', async (req, res) => {
  try {
    const created = await ExperienceModel.create(req.body);
    res.status(201).json(created);
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      res.status(400).json({ message: error.message });
      return;
    }

    console.error('Failed to create experience:', error);
    res.status(500).json({ message: 'Failed to create experience.' });
  }
});

experienceRouter.put('/:id', async (req, res) => {
  try {
    const updated = await ExperienceModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) {
      res.status(404).json({ message: 'Experience not found' });
      return;
    }

    res.json(updated);
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      res.status(400).json({ message: error.message });
      return;
    }

    console.error('Failed to update experience:', error);
    res.status(500).json({ message: 'Failed to update experience.' });
  }
});

experienceRouter.delete('/:id', async (req, res) => {
  try {
    const deleted = await ExperienceModel.findByIdAndDelete(req.params.id).lean();

    if (!deleted) {
      res.status(404).json({ message: 'Experience not found' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error('Failed to delete experience:', error);
    res.status(500).json({ message: 'Failed to delete experience.' });
  }
});

export { experienceRouter };
