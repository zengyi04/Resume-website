import { Schema, model } from 'mongoose';
import type { Experience } from '../types.js';

const experienceSchema = new Schema<Experience>(
  {
    title: { type: String, required: false, default: '' },
    role: { type: String, required: false, default: '' },
    date: { type: String, required: false, default: '' },
    language: { type: String, required: false, default: '' },
    description: { type: String, required: false, default: '' },
    certificateDataUrl: { type: String, required: false },
    certificateName: { type: String, required: false },
  },
  { timestamps: true }
);

export const ExperienceModel = model<Experience>('Experience', experienceSchema, 'Experience');
