import { Router } from 'express';
import { sendBookingEmail, buildWhatsAppUrl, sendWhatsAppAuto, BookingDetails } from '../lib/notify';

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

router.post('/', async (req, res) => {
  const { pickup, dropoff, carId, carName, date, time, userId, extras, paymentMethod, total, customerName, customerPhone } = req.body;

  const now = new Date();
  const dateStr = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}`;
  const id = `JL-${dateStr}-${String(bookingCounter++).padStart(4,'0')}`;

  const dateLabel = [date, time].filter(Boolean).join(' · ');

  const newBooking = {
    id,
    userId: userId || 'user_1',
    route: `${pickup} → ${dropoff}`,
    date: dateLabel,
    car: carName,
    status: 'confirmed',
    price: total,
    extras,
    paymentMethod,
    createdAt: now.toISOString(),
  };

  bookings.unshift(newBooking);
  console.log(`📋 New booking: ${id} — ${carName} — EGP ${total}`);

  // Build notification payload (shared by email + WhatsApp).
  const details: BookingDetails = {
    id, carName, pickup, dropoff, date: dateLabel,
    total, paymentMethod, extras, customerName, customerPhone,
  };

  // WhatsApp deep link to the business number, prefilled with details.
  const whatsappUrl = buildWhatsAppUrl(details);

  // Fire the email + automatic WhatsApp in parallel.
  const [emailResult, waResult] = await Promise.all([
    sendBookingEmail(details).catch(() => ({ ok: false })),
    sendWhatsAppAuto(details).catch(() => ({ ok: false })),
  ]);

  res.status(201).json({
    ...newBooking,
    whatsappUrl,
    emailSent: emailResult.ok,
    whatsappSent: (waResult as any).ok,
  });
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
