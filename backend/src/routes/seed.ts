import { Router } from 'express';
import { AchievementModel } from '../models/achievement.js';
import { CommitteeModel } from '../models/committee.js';
import { EducationModel } from '../models/education.js';
import { ExperienceModel } from '../models/experience.js';
import { HomeModel } from '../models/home.js';
import type { SeedPayload } from '../types.js';

const seedRouter = Router();

seedRouter.post('/', async (req, res) => {
  const payload = req.body as SeedPayload;

  if (!payload || !payload.home) {
    res.status(400).json({ message: 'Invalid payload for seed endpoint' });
    return;
  }

  await HomeModel.deleteMany({});
  await HomeModel.create(payload.home);

  await ExperienceModel.deleteMany({});
  if (payload.experience?.length) {
    await ExperienceModel.insertMany(payload.experience);
  }

  await CommitteeModel.deleteMany({});
  if (payload.committee?.length) {
    await CommitteeModel.insertMany(payload.committee);
  }

  await AchievementModel.deleteMany({});
  if (payload.achievements?.length) {
    await AchievementModel.insertMany(payload.achievements);
  }

  await EducationModel.deleteMany({});
  if (payload.education?.length) {
    await EducationModel.insertMany(payload.education);
  }

  res.json({ message: 'Seed completed' });
});

export { seedRouter };
