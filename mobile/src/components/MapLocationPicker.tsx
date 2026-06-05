/**
 * MapLocationPicker — full-screen interactive map for dropping a pin.
 *
 *  • Drag the map (or the marker) to position the pin.
 *  • Tap anywhere on the map to move the pin there.
 *  • "Use My Location" recentres on the device's GPS position.
 *  • The pin is reverse-geocoded to a street address, which is returned
 *    via onConfirm so the chosen location gets saved into the booking.
 *
 * Uses PROVIDER_DEFAULT (Apple Maps on iOS) — no Google Maps API key needed.
 * Requires a development build; react-native-maps is not available in Expo Go.
 */
import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, Pressable, StyleSheet, ActivityIndicator, Platform,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { C } from '../constants';

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: (address: string, coords: { latitude: number; longitude: number }) => void;
  lang: 'en' | 'ar';
}

// Default centre: Cairo, Egypt
const CAIRO: Region = {
  latitude: 30.0444,
  longitude: 31.2357,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

export default function MapLocationPicker({ visible, onClose, onConfirm, lang }: Props) {
  const ar = lang === 'ar';
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<Region>(CAIRO);
  const [marker, setMarker] = useState({ latitude: CAIRO.latitude, longitude: CAIRO.longitude });
  const [address, setAddress] = useState('');
  const [resolving, setResolving] = useState(false);
  const [locating, setLocating] = useState(false);

  // Reverse-geocode the pin whenever it settles (debounced).
  useEffect(() => {
    if (!visible) return;
    const handle = setTimeout(() => reverseGeocode(marker), 350);
    return () => clearTimeout(handle);
  }, [marker, visible]);

  // On open, try to jump to the user's current location.
  useEffect(() => {
    if (visible) tryCurrentLocation(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const reverseGeocode = async (coords: { latitude: number; longitude: number }) => {
    setResolving(true);
    try {
      const addrs = await Location.reverseGeocodeAsync(coords);
      if (addrs.length > 0) {
        const a = addrs[0];
        const label = [a.name, a.street, a.district, a.city, a.region]
          .filter(Boolean)
          .filter((v, i, arr) => arr.indexOf(v) === i)
          .join(', ');
        setAddress(label || (ar ? 'موقع محدد على الخريطة' : 'Dropped pin location'));
      } else {
        setAddress(ar ? 'موقع محدد على الخريطة' : 'Dropped pin location');
      }
    } catch {
      setAddress(ar ? 'موقع محدد على الخريطة' : 'Dropped pin location');
    } finally {
      setResolving(false);
    }
  };

  const tryCurrentLocation = async (animate: boolean) => {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const next = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
      setMarker(next);
      const nextRegion = { ...next, latitudeDelta: 0.02, longitudeDelta: 0.02 };
      setRegion(nextRegion);
      if (animate) mapRef.current?.animateToRegion(nextRegion, 600);
    } catch {
      // keep default region
    } finally {
      setLocating(false);
    }
  };

  if (!visible) return null;

  return (
    <View style={[StyleSheet.absoluteFill, s.container]}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          initialRegion={region}
          onRegionChangeComplete={r => setRegion(r)}
          onPress={e => setMarker(e.nativeEvent.coordinate)}
          showsUserLocation
          showsMyLocationButton={false}
        >
          <Marker
            coordinate={marker}
            draggable
            onDragEnd={e => setMarker(e.nativeEvent.coordinate)}
            pinColor={C.gold}
          />
        </MapView>

        {/* Top bar */}
        <View style={s.topBar}>
          <Pressable onPress={onClose} style={s.topBtn}>
            <Text style={s.topBtnTxt}>{ar ? 'إلغاء' : 'Cancel'}</Text>
          </Pressable>
          <Text style={s.topTitle}>{ar ? 'حدد الموقع على الخريطة' : 'Pin Your Location'}</Text>
          <View style={s.topBtn} />
        </View>

        {/* Hint */}
        <View style={s.hint}>
          <Text style={s.hintTxt}>
            {ar ? 'اضغط على الخريطة أو اسحب الدبوس' : 'Tap the map or drag the pin'}
          </Text>
        </View>

        {/* Recenter button */}
        <Pressable onPress={() => tryCurrentLocation(true)} disabled={locating} style={s.gpsBtn}>
          {locating ? <ActivityIndicator size="small" color={C.gold} /> : <Text style={s.gpsIco}>🎯</Text>}
        </Pressable>

        {/* Bottom card */}
        <View style={s.bottom}>
          <Text style={s.bottomLbl}>{ar ? 'الموقع المحدد' : 'Selected Location'}</Text>
          <View style={s.addrRow}>
            <Text style={s.addrIco}>📍</Text>
            {resolving
              ? <ActivityIndicator size="small" color={C.gold} />
              : <Text style={[s.addrTxt, ar && s.rtl]} numberOfLines={2}>
                  {address || (ar ? 'حرّك الخريطة لتحديد موقع' : 'Move the map to pick a spot')}
                </Text>}
          </View>
          <Pressable
            onPress={() => { if (address) onConfirm(address, marker); }}
            disabled={!address || resolving}
            style={[s.confirmBtn, (!address || resolving) && s.confirmBtnOff]}
          >
            <Text style={s.confirmTxt}>{ar ? 'تأكيد هذا الموقع' : 'Confirm This Location'}</Text>
          </Pressable>
        </View>
      </View>
  );
}

const s = StyleSheet.create({
  container:   { backgroundColor: C.bg, zIndex: 100, elevation: 100 },
  topBar:      { position: 'absolute', top: Platform.OS === 'ios' ? 54 : 24, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  topBtn:      { minWidth: 60, backgroundColor: 'rgba(0,0,0,0.65)', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12 },
  topBtnTxt:   { color: C.gold, fontSize: 14, fontWeight: '700', textAlign: 'center' },
  topTitle:    { color: C.white, fontSize: 15, fontWeight: '800', backgroundColor: 'rgba(0,0,0,0.65)', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 14, overflow: 'hidden' },
  hint:        { position: 'absolute', top: Platform.OS === 'ios' ? 100 : 70, alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 20, paddingVertical: 6, paddingHorizontal: 14 },
  hintTxt:     { color: '#fff', fontSize: 12, fontWeight: '600' },
  gpsBtn:      { position: 'absolute', right: 16, bottom: 220, width: 48, height: 48, borderRadius: 24, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(201,162,39,0.4)', shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 4 },
  gpsIco:      { fontSize: 20 },
  bottom:      { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: C.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 34, gap: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)' },
  bottomLbl:   { color: C.gray, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  addrRow:     { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 40, backgroundColor: C.surface2, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12 },
  addrIco:     { fontSize: 18 },
  addrTxt:     { flex: 1, color: C.white, fontSize: 14, fontWeight: '600' },
  rtl:         { textAlign: 'right' },
  confirmBtn:  { backgroundColor: C.gold, borderRadius: 14, height: 54, alignItems: 'center', justifyContent: 'center' },
  confirmBtnOff: { opacity: 0.5 },
  confirmTxt:  { color: '#000', fontSize: 16, fontWeight: '800' },
});
