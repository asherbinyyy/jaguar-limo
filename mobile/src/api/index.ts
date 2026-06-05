/**
 * API client — all requests go through the local backend so API keys
 * never touch the device.
 *
 * ─── HOW TO FIND YOUR LOCAL IP (run in Terminal) ────────────────────
 *   macOS:   ipconfig getifaddr en0
 *   or:      ifconfig | grep "inet " | grep -v 127
 *
 * Update API_URL below with your machine's local IP before launching
 * on a real device (Expo Go needs this to reach the backend over WiFi).
 * ─────────────────────────────────────────────────────────────────────
 */

// Auto-resolve: Expo dev server host = same machine as backend
const getApiUrl = (): string => {
  if (__DEV__) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const Constants = require('expo-constants').default;
      const hostUri: string | undefined = Constants?.expoConfig?.hostUri;
      if (hostUri) {
        const ip = hostUri.split(':')[0];
        return `http://${ip}:3001`;
      }
    } catch {
      // ignore
    }
    return 'http://localhost:3001';
  }
  return 'https://api.jaguarlimousine.com'; // swap for production
};

export const API_URL = getApiUrl();

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...opts.headers },
    ...opts,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json() as Promise<T>;
}

export const api = {
  fleet: {
    list: () => request<any[]>('/fleet'),
    get: (id: number) => request<any>(`/fleet/${id}`),
  },
  bookings: {
    create: (data: any) => request<any>('/bookings', { method: 'POST', body: JSON.stringify(data) }),
    list: (userId: string) => request<any[]>(`/bookings?userId=${userId}`),
  },
  offers: {
    list: () => request<any[]>('/offers'),
    validate: (code: string) => request<any>('/offers/validate', { method: 'POST', body: JSON.stringify({ code }) }),
  },
  loyalty: {
    get: (userId: string) => request<any>(`/loyalty/${userId}`),
    redeem: (userId: string, rewardId: string) =>
      request<any>('/loyalty/redeem', { method: 'POST', body: JSON.stringify({ userId, rewardId }) }),
  },
  auth: {
    requestOtp: (phone: string) => request<any>('/auth/otp', { method: 'POST', body: JSON.stringify({ phone }) }),
    verifyOtp: (phone: string, code: string) =>
      request<any>('/auth/verify', { method: 'POST', body: JSON.stringify({ phone, code }) }),
  },
};
