import { Router } from 'express';

const router = Router();

// In-memory bookings store (replace with DB later)
const bookings: any[] = [
  { id: 'JL-20240606-0042', userId: 'user_1', route: 'Maadi → Cairo Airport T2', date: 'Jun 6, 10:00 AM', car: 'Mercedes S-Class', status: 'confirmed', price: 850 },
  { id: 'JL-20240602-0014', userId: 'user_1', route: 'New Cairo → Zamalek', date: 'Jun 2', car: 'Audi Q7', status: 'completed', price: 920, stars: 5 },
];

let bookingCounter = 100;

router.get('/', (req, res) => {
  const { userId } = req.query;
  const result = userId ? bookings.filter(b => b.userId === userId) : bookings;
  res.json(result);
});

router.get('/:id', (req, res) => {
  const bk = bookings.find(b => b.id === req.params.id);
  if (!bk) return res.status(404).json({ error: 'Booking not found' });
  res.json(bk);
});

router.post('/', (req, res) => {
  const { pickup, dropoff, carId, carName, date, time, userId, extras, paymentMethod, total } = req.body;

  const now = new Date();
  const dateStr = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}`;
  const id = `JL-${dateStr}-${String(bookingCounter++).padStart(4,'0')}`;

  const newBooking = {
    id,
    userId: userId || 'user_1',
    route: `${pickup} → ${dropoff}`,
    date: `${date} · ${time}`,
    car: carName,
    status: 'confirmed',
    price: total,
    extras,
    paymentMethod,
    createdAt: now.toISOString(),
  };

  bookings.unshift(newBooking);
  console.log(`📋 New booking: ${id} — ${carName} — EGP ${total}`);
  res.status(201).json(newBooking);
});

router.patch('/:id/cancel', (req, res) => {
  const bk = bookings.find(b => b.id === req.params.id);
  if (!bk) return res.status(404).json({ error: 'Not found' });
  bk.status = 'cancelled';
  res.json(bk);
});

router.patch('/:id/rate', (req, res) => {
  const bk = bookings.find(b => b.id === req.params.id);
  if (!bk) return res.status(404).json({ error: 'Not found' });
  bk.stars = req.body.stars;
  bk.comment = req.body.comment;
  res.json(bk);
});

export default router;
