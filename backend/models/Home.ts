import mongoose from 'mongoose';

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
});

const HomeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    tagline: { type: String, required: true },
    description: { type: String, required: true },
    availability: { type: String, required: true },
    email: { type: String, required: true },
    linkedin: { type: String, required: true },
    skills: [SkillSchema],
  },
  { timestamps: true }
);

export default mongoose.model('Home', HomeSchema);
