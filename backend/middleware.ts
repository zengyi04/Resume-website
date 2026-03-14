import { Request, Response, NextFunction } from 'express';

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized — no token provided' });
    return;
  }
  const token = authHeader.split(' ')[1];
  if (token !== process.env.ADMIN_TOKEN) {
    res.status(403).json({ message: 'Forbidden — invalid token' });
    return;
  }
  next();
};
