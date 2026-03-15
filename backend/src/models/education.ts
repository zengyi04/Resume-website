import { Schema, model } from 'mongoose';
import type { Education } from '../types.js';

const educationSchema = new Schema<Education>(
  {
    university: { type: String, required: true },
    degree: { type: String, required: true },
    period: { type: String, required: true },
    cgpa: { type: String, required: true },
    skills: {
      type: [
        {
          name: { type: String, required: true },
          category: { type: String, required: true },
        },
      ],
      required: true,
      default: [],
    },
  },
  { timestamps: true }
);

export const EducationModel = model<Education>('Education', educationSchema, 'Education');
