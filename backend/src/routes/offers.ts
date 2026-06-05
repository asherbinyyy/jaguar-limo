import { Router } from 'express';

const router = Router();

const OFFERS = [
  { id: 1, code: 'EID20',     discount: 0.20, label: '20% Eid Special',      type: 'percent', exp: '2024-06-08', active: true },
  { id: 2, code: 'AIRPORT15', discount: 0.15, label: '15% off airport rides', type: 'percent', exp: '2024-06-30', active: true },
  { id: 3, code: 'LUXURY10',  discount: 0.10, label: '10% off luxury cars',   type: 'percent', exp: '2024-06-20', active: true },
  { id: 4, code: 'MONTHLY20', discount: 0.20, label: '20% monthly plan',      type: 'percent', exp: '2024-12-31', active: true },
  { id: 5, code: 'SAVE15',    discount: 0.15, label: '15% off',               type: 'percent', exp: '2024-12-31', active: true },
  { id: 6, code: 'BDAY500',   discount: 500,  label: '500 bonus pts',         type: 'points',  exp: 'always',     active: true },
];

const REFERRAL_CODES: Record<string, { earned: number; friends: number }> = {
  AHMED50: { earned: 150, friends: 3 },
};

router.get('/', (_, res) => {
  res.json(OFFERS.filter(o => o.active).map(({ id, code, label, exp, type }) => ({ id, code, label, exp, type })));
});

router.post('/validate', (req, res) => {
  const code = (req.body.code || '').toUpperCase().trim();
  const offer = OFFERS.find(o => o.code === code && o.active);
  if (!offer) return res.status(400).json({ valid: false, message: 'Invalid or expired code' });
  res.json({ valid: true, code: offer.code, discount: offer.discount, label: offer.label, type: offer.type });
});

router.post('/referral/validate', (req, res) => {
  const code = (req.body.code || '').toUpperCase();
  const ref = REFERRAL_CODES[code];
  if (!ref) return res.status(400).json({ valid: false });
  res.json({ valid: true, earned: ref.earned, friends: ref.friends });
});

export default router;
