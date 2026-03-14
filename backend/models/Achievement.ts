import mongoose from 'mongoose';

const AchievementSchema = new mongoose.Schema(
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

export default mongoose.model('Achievement', AchievementSchema);
