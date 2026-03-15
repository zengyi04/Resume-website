import { Schema, model } from 'mongoose';
import type { Achievement } from '../types.js';

const achievementSchema = new Schema<Achievement>(
  {
    title: { type: String, required: true },
    status: { type: String, required: true },
    role: { type: String, required: true },
    date: { type: String, required: true },
    language: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

export const AchievementModel = model<Achievement>('Achievements', achievementSchema, 'Achievements');
