import { Router } from 'express';
import mongoose from 'mongoose';
import { AchievementModel } from '../models/achievement.js';
import { CommitteeModel } from '../models/committee.js';
import { EducationModel } from '../models/education.js';
import { ExperienceModel } from '../models/experience.js';
import { HomeModel } from '../models/home.js';
import { achievementsRouter } from './achievements.js';
import { committeeRouter } from './committee.js';
import { educationRouter } from './education.js';
import { experienceRouter } from './experience.js';
import { homeRouter } from './home.js';
import { seedRouter } from './seed.js';

const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

apiRouter.get('/debug/db-stats', async (_req, res) => {
  const db = mongoose.connection.db;
  const uri = mongoose.connection.host;

  const [home, experience, committee, achievements, education] = await Promise.all([
    HomeModel.countDocuments(),
    ExperienceModel.countDocuments(),
    CommitteeModel.countDocuments(),
    AchievementModel.countDocuments(),
    EducationModel.countDocuments(),
  ]);

  res.json({
    connected: mongoose.connection.readyState === 1,
    host: uri,
    dbName: db?.databaseName ?? null,
    counts: {
      Home: home,
      Experience: experience,
      Committee: committee,
      Achievements: achievements,
      Education: education,
    },
  });
});

apiRouter.use('/home', homeRouter);
apiRouter.use('/experience', experienceRouter);
apiRouter.use('/committee', committeeRouter);
apiRouter.use('/achievements', achievementsRouter);
apiRouter.use('/education', educationRouter);
apiRouter.use('/seed', seedRouter);

export { apiRouter };
