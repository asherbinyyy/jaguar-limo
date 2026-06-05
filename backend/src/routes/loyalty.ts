import { Router } from 'express';

const router = Router();

// In-memory loyalty data per user
const loyalty: Record<string, { points: number; tier: string; history: any[] }> = {
  user_1: {
    points: 1240,
    tier: 'gold',
    history: [
      { type: 'earn', pts: 100, desc: 'Trip completed — Maadi to Airport', date: '2024-06-04' },
      { type: 'earn', pts: 150, desc: 'Airport transfer bonus', date: '2024-06-02' },
      { type: 'redeem', pts: -400, desc: 'Redeemed: EGP 50 voucher', date: '2024-05-28' },
    ],
  },
};

const REWARDS = [
  { id: 'free_economy', label: 'Free Economy Ride', pts: 500 },
  { id: 'upgrade_luxury', label: 'Upgrade to Luxury', pts: 800 },
  { id: 'egp50', label: 'EGP 50 Discount', pts: 400 },
  { id: 'free_airport', label: 'Free Airport Transfer', pts: 1200 },
];

function getTier(pts: number): string {
  if (pts >= 3000) return 'platinum';
  if (pts >= 1000) return 'gold';
  return 'silver';
}

router.get('/:userId', (req, res) => {
  const data = loyalty[req.params.userId];
  if (!data) return res.json({ points: 0, tier: 'silver', history: [] });
  res.json({ ...data, tier: getTier(data.points), rewards: REWARDS });
});

router.post('/earn', (req, res) => {
  const { userId, pts, reason } = req.body;
  if (!loyalty[userId]) loyalty[userId] = { points: 0, tier: 'silver', history: [] };
  loyalty[userId].points += pts;
  loyalty[userId].history.unshift({ type: 'earn', pts, desc: reason, date: new Date().toISOString().split('T')[0] });
  console.log(`⭐ +${pts} pts for ${userId} — ${reason}`);
  res.json({ points: loyalty[userId].points, tier: getTier(loyalty[userId].points) });
});

router.post('/redeem', (req, res) => {
  const { userId, rewardId } = req.body;
  const reward = REWARDS.find(r => r.id === rewardId);
  if (!reward) return res.status(404).json({ error: 'Reward not found' });
  if (!loyalty[userId]) return res.status(400).json({ error: 'User not found' });
  if (loyalty[userId].points < reward.pts) return res.status(400).json({ error: 'Insufficient points' });
  loyalty[userId].points -= reward.pts;
  loyalty[userId].history.unshift({ type: 'redeem', pts: -reward.pts, desc: `Redeemed: ${reward.label}`, date: new Date().toISOString().split('T')[0] });
  console.log(`🎁 Redeemed ${reward.label} for ${userId}`);
  res.json({ success: true, remaining: loyalty[userId].points, reward });
});

export default router;
