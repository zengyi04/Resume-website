import mongoose from 'mongoose';

const CommitteeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    role: { type: String, required: true },
    date: { type: String, required: true },
  },
  { timestamps: true, collection: 'committee' }
);

export default mongoose.model('Committee', CommitteeSchema);
