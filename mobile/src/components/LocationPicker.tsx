/**
 * LocationPicker — bottom-sheet modal for choosing a pickup / drop-off location.
 *
 * Features:
 *  • "Use My Current Location" via expo-location (no API key needed on device)
 *  • Google Places autocomplete proxied through the backend (key stays server-side)
 *  • Quick-pick saved places: Home, Work, Cairo Airport
 *  • Graceful fallback: if backend is unreachable, user can still type freely
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  Modal, View, Text, TextInput, Pressable,
  FlatList, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import * as Location from 'expo-location';
import { C } from '../constants';
import { API_URL } from '../api';
import MapLocationPicker from './MapLocationPicker';

interface Place { id: string; name: string; address: string }

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (location: string) => void;
  lang: 'en' | 'ar';
  title?: string;
}

const QUICK: { id: string; ico: string; en: string; ar: string }[] = [
  { id: 'home',    ico: '🏠', en: 'Home',                       ar: 'المنزل'           },
  { id: 'work',    ico: '🏢', en: 'Work',                        ar: 'العمل'            },
  { id: 'airport', ico: '✈️', en: 'Cairo International Airport', ar: 'مطار القاهرة الدولي' },
  { id: 'maadi',   ico: '📌', en: 'Maadi, Cairo',                ar: 'المعادي، القاهرة' },
  { id: 'zamalek', ico: '📌', en: 'Zamalek, Cairo',              ar: 'الزمالك، القاهرة' },
  { id: 'heliopolis', ico: '📌', en: 'Heliopolis, Cairo',        ar: 'مصر الجديدة، القاهرة' },
];

// Built-in searchable places — lets users search & pick instantly even when
// the Google Places backend isn't reachable (e.g. running in Expo Go).
const PLACES: { en: string; ar: string; area: string; areaAr: string }[] = [
  { en: 'Cairo International Airport — Terminal 1', ar: 'مطار القاهرة الدولي — مبنى 1', area: 'Cairo', areaAr: 'القاهرة' },
  { en: 'Cairo International Airport — Terminal 2', ar: 'مطار القاهرة الدولي — مبنى 2', area: 'Cairo', areaAr: 'القاهرة' },
  { en: 'Cairo International Airport — Terminal 3', ar: 'مطار القاهرة الدولي — مبنى 3', area: 'Cairo', areaAr: 'القاهرة' },
  { en: 'Sphinx International Airport', ar: 'مطار سفنكس الدولي', area: 'Giza', areaAr: 'الجيزة' },
  { en: 'Maadi', ar: 'المعادي', area: 'Cairo', areaAr: 'القاهرة' },
  { en: 'Zamalek', ar: 'الزمالك', area: 'Cairo', areaAr: 'القاهرة' },
  { en: 'Heliopolis', ar: 'مصر الجديدة', area: 'Cairo', areaAr: 'القاهرة' },
  { en: 'Nasr City', ar: 'مدينة نصر', area: 'Cairo', areaAr: 'القاهرة' },
  { en: 'New Cairo — 5th Settlement', ar: 'القاهرة الجديدة — التجمع الخامس', area: 'New Cairo', areaAr: 'القاهرة الجديدة' },
  { en: 'Downtown Cairo', ar: 'وسط البلد', area: 'Cairo', areaAr: 'القاهرة' },
  { en: 'Garden City', ar: 'جاردن سيتي', area: 'Cairo', areaAr: 'القاهرة' },
  { en: 'Mohandessin', ar: 'المهندسين', area: 'Giza', areaAr: 'الجيزة' },
  { en: 'Dokki', ar: 'الدقي', area: 'Giza', areaAr: 'الجيزة' },
  { en: 'Giza — Pyramids', ar: 'الجيزة — الأهرامات', area: 'Giza', areaAr: 'الجيزة' },
  { en: '6th of October City', ar: 'مدينة 6 أكتوبر', area: 'Giza', areaAr: 'الجيزة' },
  { en: 'Sheikh Zayed City', ar: 'مدينة الشيخ زايد', area: 'Giza', areaAr: 'الجيزة' },
  { en: 'New Administrative Capital', ar: 'العاصمة الإدارية الجديدة', area: 'Cairo', areaAr: 'القاهرة' },
  { en: 'Cairo Festival City Mall', ar: 'كايرو فيستيفال سيتي مول', area: 'New Cairo', areaAr: 'القاهرة الجديدة' },
  { en: 'Mall of Egypt', ar: 'مول مصر', area: '6th of October', areaAr: '6 أكتوبر' },
  { en: 'City Stars Mall', ar: 'سيتي ستارز', area: 'Nasr City', areaAr: 'مدينة نصر' },
  { en: 'Ramses Railway Station', ar: 'محطة مصر — رمسيس', area: 'Cairo', areaAr: 'القاهرة' },
  { en: 'Khan el-Khalili', ar: 'خان الخليلي', area: 'Cairo', areaAr: 'القاهرة' },
  { en: 'Smart Village', ar: 'القرية الذكية', area: 'Giza', areaAr: 'الجيزة' },
  { en: 'El Rehab City', ar: 'مدينة الرحاب', area: 'New Cairo', areaAr: 'القاهرة الجديدة' },
  { en: 'Madinaty', ar: 'مدينتي', area: 'New Cairo', areaAr: 'القاهرة الجديدة' },
  { en: 'Obour City', ar: 'مدينة العبور', area: 'Cairo', areaAr: 'القاهرة' },
  { en: 'Shorouk City', ar: 'مدينة الشروق', area: 'Cairo', areaAr: 'القاهرة' },
];

const norm = (s: string) => s.toLowerCase().trim();

export default function LocationPicker({ visible, onClose, onSelect, lang, title }: Props) {
  const ar = lang === 'ar';
  const [query, setQuery]       = useState('');
  const [results, setResults]   = useState<Place[]>([]);
  const [loading, setLoading]   = useState(false);
  const [locating, setLocating] = useState(false);
  const [mapOpen, setMapOpen]   = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Instant local search + (optional) backend autocomplete merged on top.
  useEffect(() => {
    const q = norm(query);
    if (!q || q.length < 1) { setResults([]); return; }

    // 1) Filter the built-in dataset immediately — works fully offline.
    const local: Place[] = PLACES
      .filter(p => norm(p.en).includes(q) || norm(p.ar).includes(q) || norm(p.area).includes(q) || norm(p.areaAr).includes(q))
      .slice(0, 12)
      .map((p, i) => ({
        id: `local-${i}`,
        name: ar ? p.ar : p.en,
        address: ar ? p.areaAr : p.area,
      }));
    setResults(local);

    // 2) Try the backend too; if it answers, prepend any new results.
    const handle = setTimeout(() => fetchPlaces(query, local), 400);
    return () => clearTimeout(handle);
  }, [query, ar]);

  const fetchPlaces = async (q: string, local: Place[]) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/places/autocomplete?q=${encodeURIComponent(q)}`, { signal: AbortSignal.timeout(4000) });
      const data = await res.json();
      const remote: Place[] = data.results ?? [];
      if (remote.length) {
        // Merge, de-duping by name, backend results first.
        const seen = new Set(remote.map(r => norm(r.name)));
        setResults([...remote, ...local.filter(l => !seen.has(norm(l.name)))]);
      }
    } catch {
      // backend not ready / no key — local results already shown
    } finally {
      setLoading(false);
    }
  };

  const handleCurrentLocation = async () => {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') { pick(ar ? 'موقعي الحالي' : 'Current Location'); return; }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const addrs = await Location.reverseGeocodeAsync(pos.coords);
      if (addrs.length > 0) {
        const a = addrs[0];
        const label = [a.street, a.name, a.district, a.city].filter(Boolean).join(', ');
        pick(label || (ar ? 'موقعي الحالي' : 'Current Location'));
      } else {
        pick(ar ? 'موقعي الحالي' : 'Current Location');
      }
    } catch {
      pick(ar ? 'موقعي الحالي' : 'Current Location');
    } finally {
      setLocating(false);
    }
  };

  const pick = (loc: string) => { setQuery(''); setResults([]); onSelect(loc); onClose(); };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          {/* Handle bar */}
          <View style={styles.handle} />

          {/* Title */}
          <Text style={[styles.title, ar && styles.rtl]}>
            {title || (ar ? 'اختر الموقع' : 'Choose Location')}
          </Text>

          {/* Search box */}
          <View style={styles.searchWrap}>
            <Text style={styles.searchIco}>🔍</Text>
            <TextInput
              ref={inputRef}
              style={[styles.searchInput, ar && { textAlign: 'right' }]}
              placeholder={ar ? 'ابحث عن عنوان أو منطقة...' : 'Search address or area...'}
              placeholderTextColor={C.gray}
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={() => { if (query.trim()) pick(query.trim()); }}
              autoFocus
              selectionColor={C.gold}
              returnKeyType="done"
            />
            {query.length > 0 && (
              <Pressable onPress={() => { setQuery(''); setResults([]); }} style={styles.clearBtn}>
                <Text style={styles.clearTxt}>✕</Text>
              </Pressable>
            )}
          </View>

          {/* Use Current Location */}
          <Pressable onPress={handleCurrentLocation} disabled={locating} style={styles.gpsBtn}>
            <Text style={styles.gpsIco}>{locating ? '⏳' : '🎯'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.gpsTxt, ar && styles.rtl]}>
                {ar ? 'استخدام موقعي الحالي' : 'Use My Current Location'}
              </Text>
              {locating && (
                <Text style={[styles.gpsSub, ar && styles.rtl]}>
                  {ar ? 'جارٍ تحديد موقعك...' : 'Detecting your location...'}
                </Text>
              )}
            </View>
            {locating && <ActivityIndicator size="small" color={C.gold} />}
          </Pressable>

          {/* Choose on map — opens interactive draggable-pin map */}
          <Pressable onPress={() => setMapOpen(true)} style={styles.mapBtn}>
            <Text style={styles.gpsIco}>🗺️</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.mapTxt, ar && styles.rtl]}>
                {ar ? 'الاختيار من الخريطة' : 'Choose on Map'}
              </Text>
              <Text style={[styles.gpsSub, ar && styles.rtl]}>
                {ar ? 'اسحب الدبوس لتحديد الموقع بدقة' : 'Drag the pin to set the exact spot'}
              </Text>
            </View>
            <Text style={styles.locArrow}>›</Text>
          </Pressable>

          <View style={styles.divider} />

          {/* Use exactly what was typed — guarantees manual entry always saves */}
          {query.trim().length > 0 && (
            <Pressable onPress={() => pick(query.trim())} style={styles.useTypedRow}>
              <Text style={styles.resultIco}>✏️</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.useTypedTxt, ar && styles.rtl]} numberOfLines={1}>
                  {ar ? `استخدم "${query.trim()}"` : `Use "${query.trim()}"`}
                </Text>
                <Text style={[styles.gpsSub, ar && styles.rtl]}>
                  {ar ? 'إضافة هذا العنوان يدوياً' : 'Add this address manually'}
                </Text>
              </View>
              <Text style={styles.locArrow}>›</Text>
            </Pressable>
          )}

          {/* Autocomplete results — shown instantly from the built-in list */}
          {results.length > 0 && (
            <FlatList
              data={results}
              keyExtractor={i => i.id}
              keyboardShouldPersistTaps="handled"
              style={styles.list}
              renderItem={({ item }) => (
                <Pressable onPress={() => pick(item.name)} style={styles.resultRow}>
                  <Text style={styles.resultIco}>📍</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.resultName, ar && styles.rtl]} numberOfLines={1}>{item.name}</Text>
                    <Text style={[styles.resultAddr, ar && styles.rtl]} numberOfLines={1}>{item.address}</Text>
                  </View>
                </Pressable>
              )}
            />
          )}

          {/* Quick picks (shown when not searching) */}
          {results.length === 0 && (
            <>
              <Text style={[styles.sectionLbl, ar && styles.rtl]}>
                {ar ? 'المواقع الشائعة' : 'Common Locations'}
              </Text>
              {QUICK.map(place => (
                <Pressable key={place.id} onPress={() => pick(ar ? place.ar : place.en)} style={styles.resultRow}>
                  <Text style={styles.resultIco}>{place.ico}</Text>
                  <Text style={[styles.resultName, ar && styles.rtl]}>{ar ? place.ar : place.en}</Text>
                </Pressable>
              ))}
            </>
          )}
        </View>
      </KeyboardAvoidingView>

      {/* Interactive map pin picker */}
      <MapLocationPicker
        visible={mapOpen}
        onClose={() => setMapOpen(false)}
        onConfirm={(addr) => { setMapOpen(false); pick(addr); }}
        lang={lang}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay:     { flex: 1, justifyContent: 'flex-end' },
  backdrop:    { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet:       { backgroundColor: C.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 36, maxHeight: '85%' },
  handle:      { width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'center', marginBottom: 16 },
  title:       { color: C.white, fontSize: 18, fontWeight: '800', marginBottom: 14 },
  rtl:         { textAlign: 'right' },
  searchWrap:  { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface2, borderRadius: 14, paddingHorizontal: 14, borderWidth: 1.5, borderColor: C.gold, marginBottom: 12 },
  searchIco:   { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, height: 50, color: C.white, fontSize: 15 },
  clearBtn:    { padding: 6 },
  clearTxt:    { color: C.gray, fontSize: 14 },
  gpsBtn:      { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(46,125,79,0.15)', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: 'rgba(46,125,79,0.35)', marginBottom: 8 },
  mapBtn:      { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(201,162,39,0.1)', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: 'rgba(201,162,39,0.35)', marginBottom: 4 },
  mapTxt:      { color: C.gold, fontSize: 14, fontWeight: '700' },
  gpsIco:      { fontSize: 20 },
  gpsTxt:      { color: C.greenLight, fontSize: 14, fontWeight: '700' },
  gpsSub:      { color: C.gray, fontSize: 12, marginTop: 2 },
  divider:     { height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginVertical: 12 },
  sectionLbl:  { color: C.gray, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },
  list:        { maxHeight: 300 },
  resultRow:   { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  resultIco:   { fontSize: 18, width: 28, textAlign: 'center' },
  resultName:  { color: C.white, fontSize: 14, fontWeight: '600' },
  resultAddr:  { color: C.gray, fontSize: 12, marginTop: 2 },
  useTypedRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(201,162,39,0.1)', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: 'rgba(201,162,39,0.35)', marginBottom: 8 },
  useTypedTxt: { color: C.gold, fontSize: 14, fontWeight: '700' },
  locArrow:    { color: C.gold, fontSize: 22, fontWeight: '300' },
});
