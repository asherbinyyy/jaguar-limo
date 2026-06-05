import { Router } from 'express';

const router = Router();

const BASE = 'https://www.jaguarlimousine.com/assets/img/portfolio';

const CARS = [
  { id: 1, name: 'Mercedes S-Class', cat: 'luxury', label: 'Luxury', price: 950, seats: 4, bags: 2, imageUrl: `${BASE}/mercedes%202020/0.jpg`, gradientColors: ['#0F2A1C', '#040D09'], description: 'The pinnacle of luxury travel. Leather seats, panoramic roof, whisper-quiet ride.', descriptionAr: 'تجربة سفر فاخرة لا مثيل لها. مقاعد جلدية وسقف بانورامي.' },
  { id: 2, name: 'Audi Q7', cat: 'suv', label: 'SUV', price: 850, seats: 7, bags: 4, imageUrl: `${BASE}/pajero2020/0.png`, gradientColors: ['#1A2A1C', '#060A07'], description: 'Spacious, powerful and refined. Perfect for families.', descriptionAr: 'فسيحة وقوية ومثالية للعائلات.' },
  { id: 3, name: 'Hyundai Tucson 2025', cat: 'suv', label: 'SUV', price: 600, seats: 5, bags: 3, imageUrl: `${BASE}/Tocsun%202021/0.png`, gradientColors: ['#1A2530', '#060A10'], description: 'Modern SUV balancing style, space, and economy.', descriptionAr: 'SUV عصرية تجمع الأناقة والاقتصاد.' },
  { id: 4, name: 'Kia Sportage 2026', cat: 'suv', label: 'SUV', price: 580, seats: 5, bags: 3, imageUrl: `${BASE}/cerato%202021/0.png`, gradientColors: ['#1A1A2A', '#060608'], description: 'Bold design with advanced technology.', descriptionAr: 'تصميم جريء وتكنولوجيا متقدمة.' },
  { id: 5, name: 'Kia K4 2026', cat: 'economy', label: 'Economy', price: 420, seats: 5, bags: 2, imageUrl: `${BASE}/sportage%202020/0.png`, gradientColors: ['#101A2A', '#040608'], description: 'Reliable and fuel-efficient for daily commutes.', descriptionAr: 'موثوقة واقتصادية للتنقل اليومي.' },
  { id: 6, name: 'Hyundai Elantra 2026', cat: 'economy', label: 'Economy', price: 380, seats: 5, bags: 2, imageUrl: `${BASE}/cerato%202020/0.jpg`, gradientColors: ['#1C1010', '#080404'], description: 'Sleek sedan for smooth city rides.', descriptionAr: 'سيدان أنيقة للتنقل في المدينة.' },
  { id: 7, name: 'Citroen C4X', cat: 'economy', label: 'Economy', price: 400, seats: 5, bags: 2, imageUrl: `${BASE}/Tocsun%202020/0.jpg`, gradientColors: ['#1A1A1C', '#060608'], description: 'French engineering with a uniquely smooth cabin.', descriptionAr: 'هندسة فرنسية بكابينة هادئة فريدة.' },
  { id: 8, name: 'Hyundai Elantra CN7', cat: 'economy', label: 'Economy', price: 390, seats: 5, bags: 2, imageUrl: `${BASE}/Toyota%202020/0.jpg`, gradientColors: ['#10181A', '#040607'], description: 'Latest Elantra with sharp design and improved ride.', descriptionAr: 'أحدث إيلانترا بتصميم جذاب.' },
  { id: 9, name: 'Toyota 2021', cat: 'economy', label: 'Economy', price: 350, seats: 5, bags: 2, imageUrl: `${BASE}/Toyota%202021/0.png`, gradientColors: ['#1A1808', '#080703'], description: 'Legendary Toyota reliability. Clean and always on time.', descriptionAr: 'موثوقية تويوتا الأسطورية. نظيفة ومنضبطة.' },
];

router.get('/', (_, res) => res.json(CARS));

router.get('/:id', (req, res) => {
  const car = CARS.find(c => c.id === parseInt(req.params.id));
  if (!car) return res.status(404).json({ error: 'Car not found' });
  res.json(car);
});

export default router;
