import { Router } from 'express';

const router = Router();

// OTP store: phone → code (in-memory, expires in 5 min)
const otpStore: Record<string, { code: string; expires: number }> = {};

router.post('/otp', (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone required' });

  // In dev mode: always use 123456
  const code = process.env.NODE_ENV === 'development' ? '123456' : String(Math.floor(100000 + Math.random() * 900000));
  otpStore[phone] = { code, expires: Date.now() + 5 * 60 * 1000 };

  console.log(`📱 OTP for ${phone}: ${code} ${process.env.NODE_ENV === 'development' ? '(DEV — not sent)' : ''}`);

  // In production: integrate Twilio / AWS SNS here to send SMS
  // const client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
  // await client.messages.create({ body: `Your Jaguar Limousine code: ${code}`, from: process.env.TWILIO_PHONE, to: `+20${phone}` });

  res.json({ sent: true, ...(process.env.NODE_ENV === 'development' ? { devCode: code } : {}) });
});

router.post('/verify', (req, res) => {
  const { phone, code } = req.body;
  const entry = otpStore[phone];

  // In development, accept any 6-digit code
  if (process.env.NODE_ENV === 'development') {
    const user = { id: 'user_1', name: 'Ahmed El-Sherbiny', phone, tier: 'gold', points: 1240 };
    return res.json({ success: true, user, token: `dev_token_${Date.now()}` });
  }

  if (!entry || Date.now() > entry.expires) return res.status(401).json({ error: 'Code expired' });
  if (entry.code !== code) return res.status(401).json({ error: 'Invalid code' });

  delete otpStore[phone];
  const user = { id: `user_${phone}`, phone, name: 'New User', tier: 'silver', points: 0 };
  res.json({ success: true, user, token: `token_${Date.now()}` });
});

export default router;
