import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

import { connectDB } from './db.js';
import authRoutes from './routes/auth.js';
import homeRoutes from './routes/home.js';
import experienceRoutes from './routes/experience.js';
import committeeRoutes from './routes/committee.js';
import achievementRoutes from './routes/achievement.js';
import educationRoutes from './routes/education.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/committees', committeeRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/educations', educationRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', message: 'Resume API running', timestamp: new Date().toISOString() });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
