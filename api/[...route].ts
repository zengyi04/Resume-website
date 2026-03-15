import { createApp, ensureDatabaseConnection, getMongoUri } from '../backend/src/app.js';

const app = createApp();
type AppRequest = Parameters<typeof app>[0];
type AppResponse = Parameters<typeof app>[1];

export default async function handler(req: AppRequest, res: AppResponse): Promise<void> {
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
}