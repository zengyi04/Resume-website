import mongoose from 'mongoose';

export async function connectDatabase(uri: string): Promise<void> {
  const dbName = process.env.MONGODB_DB_NAME ?? 'resume_website';
  await mongoose.connect(uri, { dbName });
}
