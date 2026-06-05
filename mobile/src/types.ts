export interface Car {
  id: number;
  name: string;
  cat: 'luxury' | 'suv' | 'economy';
  label: string;
  price: number;
  seats: number;
  bags: number;
  imageUrl: string;
  gradientColors: [string, string];
  description: string;
  descriptionAr: string;
}

export interface Booking {
  id: string;
  route: string;
  date: string;
  car: string;
  status: 'confirmed' | 'active' | 'completed' | 'cancelled';
  price?: number;
  stars?: number;
  driver?: string;
  plate?: string;
}

export interface Offer {
  ico: string;
  title: string;
  titleAr: string;
  sub: string;
  subAr: string;
  code: string;
  exp: string;
  bg: [string, string];
}

export interface Notification {
  ico: string;
  title: string;
  titleAr: string;
  body: string;
  bodyAr: string;
  time: string;
  timeAr: string;
  unread: boolean;
}

export type Phase =
  | 'splash'
  | 'onboarding'
  | 'language'
  | 'auth'
  | 'phone'
  | 'otp'
  | 'app';

export type TabId = 'home' | 'fleet' | 'bookings' | 'offers' | 'profile';

export type ScreenId =
  | null
  | 'booking'
  | 'notifications'
  | 'tracking'
  | 'loyalty'
  | 'carDetail';

export interface BookData {
  pickup: string;
  dropoff: string;
}

export type Lang = 'en' | 'ar';
