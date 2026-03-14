import { Router } from 'express';

const router = Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body as { email: string; password: string };
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminToken = process.env.ADMIN_TOKEN;

  if (!adminEmail || !adminPassword || !adminToken) {
    res.status(500).json({ message: 'Server auth not configured' });
    return;
  }

  if (email === adminEmail && password === adminPassword) {
    res.json({ success: true, token: adminToken, role: 'admin' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
});

export default router;
