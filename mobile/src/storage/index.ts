import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  LANG: '@jag_lang',
  USER: '@jag_user',
  BOOKINGS: '@jag_bookings',
  FAVORITES: '@jag_favorites',
  POINTS: '@jag_points',
  ONBOARDED: '@jag_onboarded',
} as const;

export const Storage = {
  async getLang(): Promise<string | null> {
    return AsyncStorage.getItem(KEYS.LANG);
  },
  async setLang(lang: string): Promise<void> {
    await AsyncStorage.setItem(KEYS.LANG, lang);
  },
  async getOnboarded(): Promise<boolean> {
    const v = await AsyncStorage.getItem(KEYS.ONBOARDED);
    return v === 'true';
  },
  async setOnboarded(): Promise<void> {
    await AsyncStorage.setItem(KEYS.ONBOARDED, 'true');
  },
  async getUser(): Promise<any | null> {
    const v = await AsyncStorage.getItem(KEYS.USER);
    return v ? JSON.parse(v) : null;
  },
  async setUser(user: any): Promise<void> {
    await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
  },
  async getBookings(): Promise<any[]> {
    const v = await AsyncStorage.getItem(KEYS.BOOKINGS);
    return v ? JSON.parse(v) : [];
  },
  async addBooking(booking: any): Promise<void> {
    const existing = await Storage.getBookings();
    await AsyncStorage.setItem(KEYS.BOOKINGS, JSON.stringify([booking, ...existing]));
  },
  async getFavorites(): Promise<string[]> {
    const v = await AsyncStorage.getItem(KEYS.FAVORITES);
    return v ? JSON.parse(v) : ['Home', 'Work', 'Airport'];
  },
  async getPoints(): Promise<number> {
    const v = await AsyncStorage.getItem(KEYS.POINTS);
    return v ? parseInt(v, 10) : 1240;
  },
  async addPoints(pts: number): Promise<void> {
    const current = await Storage.getPoints();
    await AsyncStorage.setItem(KEYS.POINTS, String(current + pts));
  },
  async clear(): Promise<void> {
    await AsyncStorage.multiRemove(Object.values(KEYS));
  },
};
