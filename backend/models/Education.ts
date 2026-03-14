import mongoose from 'mongoose';

const EducationSchema = new mongoose.Schema(
  {
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    period: { type: String, required: true },
    cgpa: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Education', EducationSchema);
