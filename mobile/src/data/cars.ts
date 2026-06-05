import { Car } from '../types';

// All cars sourced from jaguarlimousine.com fleet
const BASE = 'https://www.jaguarlimousine.com/assets/img/portfolio';

export const CARS: Car[] = [
  {
    id: 1,
    name: 'Mercedes S-Class',
    cat: 'luxury',
    label: 'Luxury',
    price: 950,
    seats: 4,
    bags: 2,
    imageUrl: `${BASE}/mercedes%202020/0.jpg`,
    gradientColors: ['#0F2A1C', '#040D09'],
    description:
      'The pinnacle of luxury travel. Leather seats, panoramic roof, and whisper-quiet ride for the most discerning passengers.',
    descriptionAr:
      'تجربة سفر فاخرة لا مثيل لها. مقاعد جلدية، سقف بانورامي، وراحة قصوى في كل رحلة.',
  },
  {
    id: 2,
    name: 'Audi Q7',
    cat: 'suv',
    label: 'SUV',
    price: 850,
    seats: 7,
    bags: 4,
    imageUrl: `${BASE}/pajero2020/0.png`,
    gradientColors: ['#1A2A1C', '#060A07'],
    description:
      'Spacious, powerful and refined. Perfect for families or groups who demand premium comfort on every journey.',
    descriptionAr:
      'فسيحة وقوية وراقية. مثالية للعائلات والمجموعات التي تتطلع للراحة الفائقة.',
  },
  {
    id: 3,
    name: 'Hyundai Tucson 2025',
    cat: 'suv',
    label: 'SUV',
    price: 600,
    seats: 5,
    bags: 3,
    imageUrl: `${BASE}/Tocsun%202021/0.png`,
    gradientColors: ['#1A2530', '#060A10'],
    description:
      'Modern and comfortable SUV offering a perfect balance of style, space, and economy for city and long-distance travel.',
    descriptionAr:
      'سيارة دفع رباعي عصرية ومريحة تجمع بين الأناقة والاقتصاد في التنقل.',
  },
  {
    id: 4,
    name: 'Kia Sportage 2026',
    cat: 'suv',
    label: 'SUV',
    price: 580,
    seats: 5,
    bags: 3,
    imageUrl: `${BASE}/cerato%202021/0.png`,
    gradientColors: ['#1A1A2A', '#060608'],
    description:
      'The all-new Kia Sportage blends bold design with advanced technology, delivering a refined ride every time.',
    descriptionAr:
      'كيا سبورتاج الجديدة كلياً تجمع بين التصميم الجريء والتكنولوجيا المتقدمة.',
  },
  {
    id: 5,
    name: 'Kia K4 2026',
    cat: 'economy',
    label: 'Economy',
    price: 420,
    seats: 5,
    bags: 2,
    imageUrl: `${BASE}/sportage%202020/0.png`,
    gradientColors: ['#101A2A', '#040608'],
    description:
      'Reliable, fuel-efficient and comfortable. Great for airport runs and daily commutes at a smart price.',
    descriptionAr:
      'موثوقة واقتصادية ومريحة. مثالية للتنقل اليومي ورحلات المطار بسعر مناسب.',
  },
  {
    id: 6,
    name: 'Hyundai Elantra 2026',
    cat: 'economy',
    label: 'Economy',
    price: 380,
    seats: 5,
    bags: 2,
    imageUrl: `${BASE}/cerato%202020/0.jpg`,
    gradientColors: ['#1C1010', '#080404'],
    description:
      'Sleek sedan offering smooth city rides at competitive rates. Ideal for solo travelers and business commutes.',
    descriptionAr:
      'سيدان أنيقة توفر تنقلاً سلساً في المدينة بأسعار تنافسية.',
  },
  {
    id: 7,
    name: 'Citroen C4X',
    cat: 'economy',
    label: 'Economy',
    price: 400,
    seats: 5,
    bags: 2,
    imageUrl: `${BASE}/Tocsun%202020/0.jpg`,
    gradientColors: ['#1A1A1C', '#060608'],
    description:
      'French engineering meets modern comfort. The Citroen C4X offers a uniquely smooth and quiet cabin experience.',
    descriptionAr:
      'الهندسة الفرنسية تلتقي بالراحة العصرية. سيتروين C4X تقدم تجربة هادئة فريدة.',
  },
  {
    id: 8,
    name: 'Hyundai Elantra CN7',
    cat: 'economy',
    label: 'Economy',
    price: 390,
    seats: 5,
    bags: 2,
    imageUrl: `${BASE}/Toyota%202020/0.jpg`,
    gradientColors: ['#10181A', '#040607'],
    description:
      'The latest Elantra generation brings a sharp design and improved ride quality at an unbeatable daily rate.',
    descriptionAr:
      'أحدث جيل من إيلانترا يجمع تصميماً جذاباً وجودة ركوب محسّنة.',
  },
  {
    id: 9,
    name: 'Toyota 2021',
    cat: 'economy',
    label: 'Economy',
    price: 350,
    seats: 5,
    bags: 2,
    imageUrl: `${BASE}/Toyota%202021/0.png`,
    gradientColors: ['#1A1808', '#080703'],
    description:
      'Legendary Toyota reliability at its best. Clean, comfortable and always on time. The everyday reliable choice.',
    descriptionAr:
      'موثوقية تويوتا الأسطورية في أبهى صورها. نظيفة ومريحة وفي الموعد دائماً.',
  },
];
