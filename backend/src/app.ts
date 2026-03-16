import cors from 'cors';
import express from 'express';
import { existsSync } from 'fs';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDatabase } from './config/db.js';
import { apiRouter } from './routes/index.js';

const localAllowedOrigins = new Set([
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
]);

const vercelPreviewOriginPattern = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i;
const renderOriginPattern = /^https:\/\/[a-z0-9-]+\.onrender\.com$/i;

function getConfiguredAllowedOrigins(): Set<string> {
  const envValue = process.env.FRONTEND_ORIGIN;

  if (!envValue) {
    return new Set();
  }

  return new Set(
    envValue
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
  );
}

const configuredAllowedOrigins = getConfiguredAllowedOrigins();

function isAllowedOrigin(origin: string | undefined): boolean {
  if (!origin) {
    return true;
  }

  if (localAllowedOrigins.has(origin)) {
    return true;
  }

  if (vercelPreviewOriginPattern.test(origin)) {
    return true;
  }

  if (renderOriginPattern.test(origin)) {
    return true;
  }

  return configuredAllowedOrigins.has(origin);
}
const DEFAULT_LOCAL_MONGODB_URI = 'mongodb://127.0.0.1:27017';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');

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
  const hasFrontendDist = existsSync(path.join(frontendDistPath, 'index.html'));
  const apiCors = cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin ?? 'unknown'} is not allowed by CORS.`));
    },
  });

  app.use(express.json({ limit: '10mb' }));

  app.use('/api', apiCors);
  app.use('/api', async (_req, res, next) => {
    try {
      await ensureDatabaseConnection(getMongoUri());
      next();
    } catch (error) {
      console.error('Database connection failed:', error);
      res.status(503).json({ message: 'Database is temporarily unavailable. Please try again shortly.' });
    }
  });

  app.use('/api', apiRouter);

  if (hasFrontendDist) {
    app.use(express.static(frontendDistPath));

    app.get(/^(?!\/api(?:\/|$)).*/, (_req, res) => {
      res.sendFile(path.join(frontendDistPath, 'index.html'));
    });
  } else {
    app.get('/', (_req, res) => {
      res.json({ message: 'Resume backend is running', health: '/api/health' });
    });
  }

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