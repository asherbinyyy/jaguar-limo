import { Offer } from '../types';
import { C } from '../constants';

export const OFFERS: Offer[] = [
  {
    ico: '✈️',
    title: 'Airport Special — 15% Off',
    titleAr: 'عرض المطار — خصم 15%',
    sub: 'Valid Mon–Thu, all terminals',
    subAr: 'صالح الاثنين–الخميس، جميع الصالات',
    code: 'AIRPORT15',
    exp: 'Jun 30',
    bg: [C.green, '#0D2818'],
  },
  {
    ico: '⭐',
    title: 'Luxury Package — 10% Off',
    titleAr: 'باقة الفاخرة — خصم 10%',
    sub: 'On all luxury car bookings',
    subAr: 'على جميع حجوزات السيارات الفاخرة',
    code: 'LUXURY10',
    exp: 'Jun 20',
    bg: ['#3A2800', '#1A1000'],
  },
  {
    ico: '🎂',
    title: 'Birthday Bonus',
    titleAr: 'مكافأة عيد الميلاد',
    sub: '500 pts credited on your birthday',
    subAr: '500 نقطة تُضاف في عيد ميلادك',
    code: 'BDAY500',
    exp: 'Always',
    bg: ['#2A1A3A', '#0D0818'],
  },
];

export const VALID_PROMO_CODES: Record<string, { discount: number; label: string }> = {
  SAVE15: { discount: 0.15, label: '15% off' },
  AIRPORT15: { discount: 0.15, label: '15% off airport rides' },
  LUXURY10: { discount: 0.10, label: '10% off luxury cars' },
  MONTHLY20: { discount: 0.20, label: '20% off monthly plan' },
  EID20: { discount: 0.20, label: '20% Eid Special' },
};

export const BOOKINGS_DATA = {
  upcoming: [
    { id: 'JL-20240606-0042', route: 'Maadi → Cairo Airport T2', date: 'Jun 6, 10:00 AM', car: 'Mercedes S-Class', status: 'confirmed' as const },
    { id: 'JL-20240610-0018', route: 'Zamalek → New Cairo', date: 'Jun 10, 2:30 PM', car: 'Hyundai Tucson', status: 'confirmed' as const },
  ],
  active: [
    { id: 'JL-20240605-0031', route: 'Maadi → Cairo Airport T1', date: 'Today, 3:15 PM', car: 'Mercedes S-Class', status: 'active' as const, driver: 'Ahmed Hassan', plate: 'ABC 1234' },
  ],
  past: [
    { id: 'JL-20240602-0014', route: 'New Cairo → Zamalek', date: 'Jun 2', car: 'Audi Q7', price: 920, stars: 5, status: 'completed' as const },
    { id: 'JL-20240528-0009', route: 'Maadi → Heliopolis', date: 'May 28', car: 'Toyota 2021', price: 380, stars: 0, status: 'completed' as const },
  ],
};
