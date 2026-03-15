import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { connectDatabase } from './config/db.js';
import { apiRouter } from './routes/index.js';

dotenv.config();

const port = Number(process.env.PORT ?? 5000);
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error('MONGODB_URI is missing in backend/.env');
}

const validatedMongoUri = mongoUri;

async function bootstrap(): Promise<void> {
  await connectDatabase(validatedMongoUri);

  const app = express();

  app.use(
    cors({
      origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173'],
    })
  );
  app.use(express.json());

  app.get('/', (_req, res) => {
    res.json({ message: 'Resume backend is running', health: '/api/health' });
  });

  app.use("/api", apiRouter);

  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: "Internal server error" });
  });

  const server = app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
  });

  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      console.error(
        `Port ${port} is already in use. Stop the existing process or change PORT in backend/.env.`
      );
      process.exit(1);
      return;
    }

    throw error;
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start backend:', error);
  process.exit(1);
});
