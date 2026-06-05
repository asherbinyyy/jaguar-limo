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

export default function LocationPicker({ visible, onClose, onSelect, lang, title }: Props) {
  const ar = lang === 'ar';
  const [query, setQuery]       = useState('');
  const [results, setResults]   = useState<Place[]>([]);
  const [loading, setLoading]   = useState(false);
  const [locating, setLocating] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Debounced autocomplete
  useEffect(() => {
    if (!query.trim() || query.length < 2) { setResults([]); return; }
    const t = setTimeout(() => fetchPlaces(query), 450);
    return () => clearTimeout(t);
  }, [query]);

  const fetchPlaces = async (q: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/places/autocomplete?q=${encodeURIComponent(q)}`, { signal: AbortSignal.timeout(4000) });
      const data = await res.json();
      setResults(data.results ?? []);
    } catch {
      setResults([]); // backend not ready / no key — silently fall back
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
              autoFocus
              selectionColor={C.gold}
              returnKeyType="search"
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

          <View style={styles.divider} />

          {/* Loading */}
          {loading && <ActivityIndicator color={C.gold} style={{ marginVertical: 12 }} />}

          {/* Autocomplete results */}
          {!loading && results.length > 0 && (
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

          {/* Quick picks (shown when no search results) */}
          {!loading && results.length === 0 && (
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
  gpsBtn:      { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(46,125,79,0.15)', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: 'rgba(46,125,79,0.35)', marginBottom: 4 },
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
});
