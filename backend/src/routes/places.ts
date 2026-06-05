/**
 * Google Places Autocomplete proxy
 * The API key lives here on the server — never exposed to the device.
 *
 * Set GOOGLE_MAPS_API_KEY in backend/.env to enable live results.
 * Without a key the route returns an empty array (graceful fallback).
 */
import { Router } from 'express';

const router = Router();

router.get('/autocomplete', async (req, res) => {
  const q = (req.query.q as string || '').trim();
  if (!q || q.length < 2) return res.json({ results: [] });

  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key || key === 'your_key_here') {
    // ── Dev fallback: return mock Cairo addresses so the UI still works ──────
    const mockPlaces = [
      { id: 'p1', name: `${q}, Maadi, Cairo`,           address: 'Maadi, Cairo Governorate, Egypt' },
      { id: 'p2', name: `${q}, Zamalek, Cairo`,          address: 'Zamalek, Cairo Governorate, Egypt' },
      { id: 'p3', name: `${q}, New Cairo`,               address: 'New Cairo, Cairo Governorate, Egypt' },
      { id: 'p4', name: `${q}, Heliopolis, Cairo`,        address: 'Heliopolis, Cairo Governorate, Egypt' },
      { id: 'p5', name: `${q}, Nasr City, Cairo`,         address: 'Nasr City, Cairo Governorate, Egypt' },
    ].filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || q.length > 1);
    return res.json({ results: mockPlaces });
  }

  try {
    const url = new URL('https://maps.googleapis.com/maps/api/place/autocomplete/json');
    url.searchParams.set('input', q);
    url.searchParams.set('key', key);
    url.searchParams.set('components', 'country:eg');   // restrict to Egypt
    url.searchParams.set('language', 'en');
    url.searchParams.set('types', 'geocode|establishment');

    const response = await fetch(url.toString());
    const data: any = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Places API error:', data.status, data.error_message);
      return res.json({ results: [] });
    }

    const results = (data.predictions ?? []).map((p: any) => ({
      id:      p.place_id,
      name:    p.structured_formatting?.main_text    ?? p.description,
      address: p.structured_formatting?.secondary_text ?? '',
    }));

    res.json({ results });
  } catch (err) {
    console.error('Places proxy error:', err);
    res.json({ results: [] });
  }
});

export default router;
