import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, Modal, Alert, Linking } from 'react-native';
import Svg, { Line, Path, Circle, G, Text as SvgText } from 'react-native-svg';
import Stars from '../components/Stars';
import { C } from '../constants';
import { t, Lang } from '../i18n';

interface Props { onBack: () => void; lang: Lang }

export default function TrackingScreen({ onBack, lang }: Props) {
  const ar = lang === 'ar';
  const carX = useRef(new Animated.Value(15)).current;
  const [sosModal, setSosModal] = useState(false);

  useEffect(() => {
    Animated.loop(
      Animated.timing(carX, { toValue: 75, duration: 12000, useNativeDriver: false })
    ).start();
  }, []);

  const [displayX, setDisplayX] = useState(15);
  useEffect(() => {
    const id = carX.addListener(({ value }) => setDisplayX(value));
    return () => carX.removeListener(id);
  }, []);

  const actions = [
    { ico: '📞', lbl: ar ? 'اتصال' : 'Call', bg: C.success, fn: () => Linking.openURL('tel:+201113335999') },
    { ico: '💬', lbl: 'WhatsApp', bg: '#25D366', fn: () => Linking.openURL('https://wa.me/201113335999') },
    { ico: '📤', lbl: ar ? 'مشاركة' : 'Share', bg: C.surface3, fn: () => {} },
    { ico: '🆘', lbl: 'SOS', bg: C.error, fn: () => setSosModal(true) },
  ];

  return (
    <View style={styles.container}>
      {/* Map */}
      <View style={styles.map}>
        <Svg width="100%" height="100%" viewBox="0 0 400 500" style={StyleSheet.absoluteFill}>
          {[60,120,180,240,300,360,420].map(y => <Line key={y} x1="0" y1={y} x2="500" y2={y} stroke="rgba(46,125,79,0.1)" strokeWidth="1" />)}
          {[50,100,150,200,250,300,350].map(x => <Line key={x} x1={x} y1="0" x2={x} y2="600" stroke="rgba(46,125,79,0.1)" strokeWidth="1" />)}
          <Path d="M0,200 Q100,190 200,200 Q300,210 400,200" stroke="rgba(46,125,79,0.35)" strokeWidth="5" fill="none" />
          <Path d="M150,0 Q160,100 150,200 Q140,300 150,400" stroke="rgba(46,125,79,0.25)" strokeWidth="4" fill="none" />
          <Path d="M0,200 Q100,190 200,200 Q300,210 400,200" stroke={C.gold} strokeWidth="2.5" fill="none" strokeDasharray="12 6" opacity="0.6" />
          <Circle cx="340" cy="200" r="12" fill="#EF5350" opacity="0.9" />
          <Circle cx="340" cy="200" r="5" fill="#fff" />
          {/* Animated car */}
          <G transform={`translate(${displayX * 3.7}, 200)`}>
            <Circle cx="0" cy="0" r="14" fill={C.gold} opacity="0.2" />
            <Circle cx="0" cy="0" r="9" fill={C.gold} />
            <SvgText x="0" y="4" textAnchor="middle" fontSize="10">🚙</SvgText>
          </G>
        </Svg>

        {/* ETA Chip */}
        <View style={styles.etaChip}>
          <Text style={styles.etaTxt}>🕙 {t(lang, 'arrivesIn')}</Text>
        </View>
        {/* Back Button */}
        <Pressable onPress={onBack} style={[styles.backBtn, ar ? { right: 16, left: undefined } : { left: 16 }]}>
          <Text style={styles.backArrow}>{ar ? '→' : '←'}</Text>
        </Pressable>
      </View>

      {/* Bottom Drawer */}
      <View style={styles.drawer}>
        <View style={styles.handle} />
        <View style={styles.driverRow}>
          <View style={styles.driverAvatar}><Text style={styles.driverInitials}>AH</Text></View>
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>Ahmed Hassan</Text>
            <Stars n={5} size={12} />
            <Text style={styles.driverMeta}>Cairo · ABC 1234 · Mercedes S-Class</Text>
          </View>
        </View>
        <View style={styles.actions}>
          {actions.map((a, i) => (
            <Pressable key={i} onPress={a.fn} style={[styles.actionBtn, { backgroundColor: a.bg }]}>
              <Text style={styles.actionIco}>{a.ico}</Text>
              <Text style={styles.actionLbl}>{a.lbl}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* SOS Modal */}
      <Modal visible={sosModal} transparent animationType="slide">
        <View style={styles.sosOverlay}>
          <View style={styles.sosModal}>
            <Text style={styles.sosTitle}>{ar ? '🆘 طوارئ' : '🆘 Emergency'}</Text>
            <Text style={styles.sosSub}>{ar ? 'اختر إجراءً:' : 'Choose an action:'}</Text>
            <Pressable onPress={() => { Linking.openURL('tel:123'); setSosModal(false); }} style={styles.sosBtn}>
              <Text style={styles.sosBtnTxt}>{ar ? '🚔 اتصل بالشرطة — 123' : '🚔 Call Police — 123'}</Text>
            </Pressable>
            <Pressable onPress={() => { Linking.openURL('tel:180'); setSosModal(false); }} style={styles.sosBtn}>
              <Text style={styles.sosBtnTxt}>{ar ? '🚑 اتصل بالإسعاف — 180' : '🚑 Call Ambulance — 180'}</Text>
            </Pressable>
            <Pressable onPress={() => { Linking.openURL('https://wa.me/201113335999'); setSosModal(false); }} style={styles.sosBtn}>
              <Text style={styles.sosBtnTxt}>{ar ? '📤 مشاركة موقعك' : '📤 Share Live Location'}</Text>
            </Pressable>
            <Pressable onPress={() => setSosModal(false)} style={styles.sosCancelBtn}>
              <Text style={styles.sosCancelTxt}>{ar ? 'إلغاء' : 'Cancel'}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1, backgroundColor: '#0A1510' },
  etaChip: { position: 'absolute', top: 16, left: '25%', right: '25%', backgroundColor: 'rgba(13,13,13,0.9)', borderRadius: 12, paddingVertical: 8, paddingHorizontal: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(201,162,39,0.25)' },
  etaTxt: { color: C.white, fontSize: 14, fontWeight: '700' },
  backBtn: { position: 'absolute', top: 16, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 10, width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  backArrow: { color: C.white, fontSize: 20 },
  drawer: { backgroundColor: C.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 16, paddingBottom: 28, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderBottomWidth: 0, gap: 16 },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'center', marginBottom: 4 },
  driverRow: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  driverAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(201,162,39,0.4)' },
  driverInitials: { color: C.gold, fontSize: 18, fontWeight: '800' },
  driverInfo: { flex: 1, gap: 2 },
  driverName: { color: C.white, fontSize: 16, fontWeight: '700' },
  driverMeta: { color: C.gray, fontSize: 12, marginTop: 2 },
  actions: { flexDirection: 'row', gap: 10 },
  actionBtn: { flex: 1, height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center', gap: 3 },
  actionIco: { fontSize: 18 },
  actionLbl: { color: C.white, fontSize: 10, fontWeight: '600' },
  sosOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  sosModal: { backgroundColor: C.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, gap: 12 },
  sosTitle: { color: C.white, fontSize: 22, fontWeight: '800', textAlign: 'center' },
  sosSub: { color: C.gray, fontSize: 15, textAlign: 'center' },
  sosBtn: { backgroundColor: 'rgba(211,47,47,0.15)', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: 'rgba(211,47,47,0.3)' },
  sosBtnTxt: { color: C.white, fontSize: 15, fontWeight: '600', textAlign: 'center' },
  sosCancelBtn: { padding: 12, alignItems: 'center' },
  sosCancelTxt: { color: C.gray, fontSize: 15 },
});
