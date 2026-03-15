import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import { connectDatabase } from './config/db.js';
import { apiRouter } from './routes/index.js';

const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
];
const DEFAULT_LOCAL_MONGODB_URI = 'mongodb://127.0.0.1:27017';

let connectionPromise: Promise<void> | null = null;
let hasWarnedAboutFallbackUri = false;

function isProductionEnvironment(): boolean {
  return process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
}

export function getMongoUri(): string {
  const mongoUri = process.env.MONGODB_URI;

  if (mongoUri) {
    return mongoUri;
  }

  if (isProductionEnvironment()) {
    throw new Error('MONGODB_URI is missing. Set it in the deployment environment or backend/.env.');
  }

  if (!hasWarnedAboutFallbackUri) {
    hasWarnedAboutFallbackUri = true;
    console.warn('MONGODB_URI is not set. Falling back to mongodb://127.0.0.1:27017 for local development.');
  }

  return DEFAULT_LOCAL_MONGODB_URI;
}

export async function ensureDatabaseConnection(uri: string): Promise<void> {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (mongoose.connection.readyState === 2 && connectionPromise) {
    await connectionPromise;
    return;
  }

  connectionPromise = connectDatabase(uri);

  try {
    await connectionPromise;
  } finally {
    connectionPromise = null;
  }
}

export function createApp(): express.Express {
  const app = express();

  app.use(
    cors({
      origin: allowedOrigins,
    })
  );
  app.use(express.json({ limit: '1mb' }));

  app.get('/', (_req, res) => {
    res.json({ message: 'Resume backend is running', health: '/api/health' });
  });

  app.use('/api', apiRouter);

  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (error instanceof Error) {
      console.error(error);
      res.status(400).json({ message: error.message });
      return;
    }

    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  });

  return app;
}