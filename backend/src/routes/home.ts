import { Router } from 'express';
import { HomeModel } from '../models/home.js';

const homeRouter = Router();

homeRouter.get('/', async (_req, res) => {
  const home = await HomeModel.findOne().lean();
  res.json(home);
});

homeRouter.put('/', async (req, res) => {
  const updated = await HomeModel.findOneAndUpdate({}, req.body, {
    new: true,
    upsert: true,
    runValidators: true,
  }).lean();
  res.json(updated);
});

export { homeRouter };
