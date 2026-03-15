import { createApp, ensureDatabaseConnection, getMongoUri } from '../backend/dist/app.js';

const app = createApp();
type AppRequest = Parameters<typeof app>[0];
type AppResponse = Parameters<typeof app>[1];

export default async function handler(req: AppRequest, res: AppResponse): Promise<void> {
  try {
    await ensureDatabaseConnection(getMongoUri());
    await new Promise<void>((resolve, reject) => {
      app(req, res, (error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  } catch (error) {
    console.error('Vercel API handler failed:', error);
    if (typeof res.status === 'function' && typeof res.json === 'function') {
      res.status(500).json({ message: 'Backend request failed on Vercel function.' });
    }
  }
}