import { Schema, model } from 'mongoose';
import type { Committee } from '../types.js';

const committeeSchema = new Schema<Committee>(
  {
    title: { type: String, required: true },
    role: { type: String, required: true },
    date: { type: String, required: true },
  },
  { timestamps: true }
);

export const CommitteeModel = model<Committee>('Committee', committeeSchema, 'Committee');
