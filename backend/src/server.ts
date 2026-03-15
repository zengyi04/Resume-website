import dotenv from 'dotenv';
import { createApp, ensureDatabaseConnection, getMongoUri } from './app.js';

dotenv.config();

const port = Number(process.env.PORT ?? 5000);
const mongoUri = getMongoUri();

async function bootstrap(): Promise<void> {
  await ensureDatabaseConnection(mongoUri);

  const app = createApp();

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
