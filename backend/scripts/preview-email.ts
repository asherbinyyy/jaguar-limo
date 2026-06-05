/**
 * Renders the booking-confirmation email to /tmp and opens it in a browser.
 * Run:  npx ts-node scripts/preview-email.ts
 */
import { writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { renderBookingEmailHtml, BookingDetails } from '../src/lib/notify';

const sample: BookingDetails = {
  id: 'JL-20260605-0042',
  carName: 'Mercedes S-Class',
  pickup: '12 Ahmed Hassan St, Maadi, Cairo',
  dropoff: 'Cairo International Airport — Terminal 2',
  date: 'Jun 6 · 10:00 AM',
  total: 950,
  paymentMethod: 'instapay',
  extras: { child: true, driver: false },
  customerName: 'Ahmed El-Sherbiny',
  customerPhone: '+201113335999',
};

const out = '/tmp/jaguar-booking-email.html';
writeFileSync(out, renderBookingEmailHtml(sample));
console.log(`✅ Wrote ${out}`);
try { execSync(`open "${out}"`); } catch { /* non-mac: open manually */ }
