import { Schema, model } from 'mongoose';
import type { Home } from '../types.js';

const homeSchema = new Schema<Home>(
  {
    name: { type: String, required: true },
    subtitle: { type: String, required: true },
    bio: { type: String, required: true },
    linkedinUrl: { type: String, required: true },
    email: { type: String, required: true },
    internshipAvailability: { type: String, required: true },
  },
  { timestamps: true }
);

export const HomeModel = model<Home>('Home', homeSchema, 'Home');
