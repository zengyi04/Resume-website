import { Schema, model } from 'mongoose';
import type { Experience } from '../types.js';

const experienceSchema = new Schema<Experience>(
  {
    title: { type: String, required: true },
    role: { type: String, required: true },
    date: { type: String, required: true },
    language: { type: String, required: true },
    description: { type: String, required: true },
    certificateDataUrl: { type: String, required: false },
    certificateName: { type: String, required: false },
  },
  { timestamps: true }
);

export const ExperienceModel = model<Experience>('Experience', experienceSchema, 'Experience');
