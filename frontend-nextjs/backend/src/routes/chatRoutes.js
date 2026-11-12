import express from 'express';
import { requireAuth } from '../utils/auth.js';

const router = express.Router();

router.get('/token', requireAuth, (req, res) => {
  const token = Buffer.from(JSON.stringify({
    sub: req.user.id,
    email: req.user.email,
    role: 'stream-user',
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  })).toString('base64');

  return res.json({ token });
});

export default router;
