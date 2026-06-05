/**
 * Notification helpers — email (nodemailer) + WhatsApp deep links.
 *
 * Email:
 *   • If SMTP_* env vars are set, a real email is sent.
 *   • Otherwise a free Ethereal test inbox is created on the fly and a
 *     preview URL is printed to the server console — so the flow is fully
 *     testable without real credentials.
 *
 * WhatsApp:
 *   • We can't send WhatsApp programmatically without the Business API, so
 *     we build a wa.me deep link prefilled with the booking details. The
 *     client opens it to deliver the message to the business number.
 */
import nodemailer from 'nodemailer';

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'ahmedelsherbiny19@gmail.com';
export const BUSINESS_WHATSAPP = process.env.BUSINESS_WHATSAPP || '201156666422';

export interface BookingDetails {
  id: string;
  carName: string;
  pickup: string;
  dropoff: string;
  date: string;        // already formatted e.g. "Jun 6 · 10:00 AM"
  total: number;
  paymentMethod: string;
  extras?: Record<string, boolean> | string[];
  customerName?: string;
  customerPhone?: string;
}

const EGP = (n: number) => `EGP ${Number(n || 0).toLocaleString()}`;

const prettyPayment = (p: string) => {
  switch (p) {
    case 'cash':     return 'Cash on pickup';
    case 'card':     return 'Credit / Debit card';
    case 'apple':    return 'Apple Pay';
    case 'instapay': return 'InstaPay transfer';
    default:         return p || '—';
  }
};

const prettyExtras = (extras?: BookingDetails['extras']): string => {
  if (!extras) return 'None';
  if (Array.isArray(extras)) return extras.length ? extras.join(', ') : 'None';
  const on = Object.entries(extras).filter(([, v]) => v).map(([k]) => k);
  return on.length ? on.join(', ') : 'None';
};

// ─── WhatsApp ────────────────────────────────────────────────────────────────
export function buildWhatsAppMessage(b: BookingDetails): string {
  return (
    `🚗 *New Jaguar Limousine Booking*\n\n` +
    `*Booking ID:* ${b.id}\n` +
    `*Car:* ${b.carName}\n` +
    `*Pickup:* ${b.pickup}\n` +
    `*Drop-off:* ${b.dropoff}\n` +
    `*Date & Time:* ${b.date}\n` +
    `*Extras:* ${prettyExtras(b.extras)}\n` +
    `*Payment:* ${prettyPayment(b.paymentMethod)}\n` +
    `*Total:* ${EGP(b.total)}\n` +
    (b.customerName ? `*Customer:* ${b.customerName}\n` : '') +
    (b.customerPhone ? `*Phone:* ${b.customerPhone}\n` : '')
  );
}

export function buildWhatsAppUrl(b: BookingDetails, to: string = BUSINESS_WHATSAPP): string {
  return `https://wa.me/${to}?text=${encodeURIComponent(buildWhatsAppMessage(b))}`;
}

// ─── Automatic WhatsApp (CallMeBot) ──────────────────────────────────────────
// CallMeBot lets you send a WhatsApp message to ONE registered number via a
// simple HTTP GET — no Business API needed. Great for e2e testing.
// Setup: WhatsApp "I allow callmebot to send me messages" to +34 644 51 95 23,
// you'll receive an apikey. Put it in .env as CALLMEBOT_APIKEY.
export async function sendWhatsAppAuto(b: BookingDetails): Promise<{ ok: boolean; skipped?: boolean }> {
  const apikey = process.env.CALLMEBOT_APIKEY;
  const phone  = process.env.CALLMEBOT_PHONE || BUSINESS_WHATSAPP;
  if (!apikey) return { ok: false, skipped: true };
  try {
    const text = buildWhatsAppMessage(b);
    const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(apikey)}`;
    const res = await fetch(url);
    const ok = res.ok;
    console.log(`📲 WhatsApp auto-send to ${phone}: ${ok ? 'sent' : 'failed'}`);
    return { ok };
  } catch (err) {
    console.error('📲 WhatsApp auto-send error:', (err as Error).message);
    return { ok: false };
  }
}

// ─── Email ───────────────────────────────────────────────────────────────────
export function renderBookingEmailHtml(b: BookingDetails): string { return emailHtml(b); }

function emailHtml(b: BookingDetails): string {
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:12px 16px;color:#8A8A8A;font-size:13px;border-bottom:1px solid #f0f0f0;">${label}</td>
      <td style="padding:12px 16px;color:#111;font-size:14px;font-weight:600;text-align:right;border-bottom:1px solid #f0f0f0;">${value}</td>
    </tr>`;

  return `
  <div style="background:#0D0D0D;padding:24px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e8e8e8;">
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#1A4D2E,#0A2015);padding:28px 24px;text-align:center;">
        <div style="color:#C9A227;font-size:22px;font-weight:900;letter-spacing:0.5px;">JAGUAR LIMOUSINE</div>
        <div style="color:rgba(255,255,255,0.6);font-size:12px;margin-top:4px;letter-spacing:1px;">PREMIUM RIDE PARTNER</div>
      </div>

      <!-- Confirmation banner -->
      <div style="padding:24px 24px 8px;text-align:center;">
        <div style="display:inline-block;background:rgba(201,162,39,0.12);color:#B8870F;font-size:13px;font-weight:700;padding:6px 14px;border-radius:20px;">✓ NEW BOOKING CONFIRMED</div>
        <h1 style="color:#111;font-size:20px;margin:16px 0 4px;">${b.carName}</h1>
        <div style="color:#8A8A8A;font-size:14px;">${b.date}</div>
      </div>

      <!-- Details table -->
      <div style="padding:16px 24px 8px;">
        <table style="width:100%;border-collapse:collapse;background:#fafafa;border-radius:12px;overflow:hidden;">
          ${row('Booking ID', b.id)}
          ${row('Pickup', b.pickup)}
          ${row('Drop-off', b.dropoff)}
          ${row('Extras', prettyExtras(b.extras))}
          ${row('Payment Method', prettyPayment(b.paymentMethod))}
          ${b.customerName ? row('Customer', b.customerName) : ''}
          ${b.customerPhone ? row('Phone', b.customerPhone) : ''}
        </table>
      </div>

      <!-- Total -->
      <div style="padding:8px 24px 24px;">
        <div style="display:flex;justify-content:space-between;align-items:center;background:#0D0D0D;border-radius:12px;padding:16px 20px;">
          <span style="color:#fff;font-size:15px;font-weight:700;">Total</span>
          <span style="color:#C9A227;font-size:22px;font-weight:900;">${EGP(b.total)}</span>
        </div>
      </div>

      <!-- Footer -->
      <div style="padding:18px 24px;background:#f7f7f7;text-align:center;border-top:1px solid #eee;">
        <div style="color:#8A8A8A;font-size:12px;">Jaguar Limousine · Established 1998 · 25+ years</div>
        <div style="color:#8A8A8A;font-size:12px;margin-top:4px;">31 Darna Buildings, Ring Road, Maadi, Cairo · +20 111 333 5999</div>
      </div>
    </div>
  </div>`;
}

let cachedTransport: nodemailer.Transporter | null = null;

async function getTransport(): Promise<{ transport: nodemailer.Transporter; from: string; isTest: boolean }> {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    if (!cachedTransport) {
      cachedTransport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
    }
    return { transport: cachedTransport, from: process.env.SMTP_FROM || process.env.SMTP_USER!, isTest: false };
  }

  // No SMTP configured → spin up a free Ethereal test inbox.
  const testAccount = await nodemailer.createTestAccount();
  const transport = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: { user: testAccount.user, pass: testAccount.pass },
  });
  return { transport, from: 'Jaguar Limousine <bookings@jaguarlimousine.com>', isTest: true };
}

export async function sendBookingEmail(b: BookingDetails): Promise<{ ok: boolean; previewUrl?: string }> {
  try {
    const { transport, from, isTest } = await getTransport();
    const info = await transport.sendMail({
      from,
      to: ADMIN_EMAIL,
      subject: `🚗 New Booking ${b.id} — ${b.carName} (${EGP(b.total)})`,
      html: emailHtml(b),
    });
    const previewUrl = isTest ? (nodemailer.getTestMessageUrl(info) || undefined) : undefined;
    if (previewUrl) console.log(`📧 Booking email preview: ${previewUrl}`);
    else console.log(`📧 Booking email sent to ${ADMIN_EMAIL} for ${b.id}`);
    return { ok: true, previewUrl };
  } catch (err) {
    console.error('✉️  Failed to send booking email:', (err as Error).message);
    return { ok: false };
  }
}
