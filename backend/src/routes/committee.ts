import { Router } from 'express';
import { CommitteeModel } from '../models/committee.js';

const committeeRouter = Router();

committeeRouter.get('/', async (_req, res) => {
  const items = await CommitteeModel.find().sort({ createdAt: -1 }).lean();
  res.json(items);
});

committeeRouter.post('/', async (req, res) => {
  const created = await CommitteeModel.create(req.body);
  res.status(201).json(created);
});

committeeRouter.put('/:id', async (req, res) => {
  const updated = await CommitteeModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).lean();

  if (!updated) {
    res.status(404).json({ message: 'Committee item not found' });
    return;
  }

  res.json(updated);
});

committeeRouter.delete('/:id', async (req, res) => {
  const deleted = await CommitteeModel.findByIdAndDelete(req.params.id).lean();

  if (!deleted) {
    res.status(404).json({ message: 'Committee item not found' });
    return;
  }

  res.status(204).send();
});

export { committeeRouter };
