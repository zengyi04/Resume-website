import mongoose from 'mongoose';

const ExperienceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    role: { type: String, required: true },
    date: { type: String, required: true },
    language: { type: String, required: true },
    description: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Experience', ExperienceSchema);
