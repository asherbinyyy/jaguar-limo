import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Ellipse, Rect, Polygon, Path, Text as SvgText, Line, G } from 'react-native-svg';
import GoldBtn from '../components/GoldBtn';
import { C } from '../constants';
import { t, Lang } from '../i18n';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    bg: ['#1A4D2E', '#061610'] as [string, string],
    titleKey: 'bookInMinutes' as const,
    bodyKey: 'bookInMinutesSub' as const,
    Art: () => (
      <Svg viewBox="0 0 200 140" width={200} height={140}>
        <Ellipse cx="100" cy="110" rx="80" ry="18" fill="rgba(201,162,39,0.06)" />
        <Rect x="30" y="70" width="140" height="36" rx="10" fill="rgba(46,125,79,0.5)" />
        <Ellipse cx="62" cy="66" rx="28" ry="16" fill="rgba(46,125,79,0.4)" />
        <Ellipse cx="130" cy="68" rx="22" ry="14" fill="rgba(46,125,79,0.3)" />
        <Circle cx="58" cy="107" r="13" fill="#111" stroke={C.gold} strokeWidth="2.5" />
        <Circle cx="58" cy="107" r="5" fill="rgba(201,162,39,0.3)" />
        <Circle cx="140" cy="107" r="13" fill="#111" stroke={C.gold} strokeWidth="2.5" />
        <Circle cx="140" cy="107" r="5" fill="rgba(201,162,39,0.3)" />
        <Rect x="20" y="78" width="18" height="10" rx="3" fill={C.gold} opacity="0.9" />
        <Rect x="162" y="78" width="18" height="10" rx="3" fill={C.gold} opacity="0.4" />
        <Circle cx="100" cy="40" r="22" fill="none" stroke="rgba(201,162,39,0.15)" strokeWidth="1.5" />
        <Circle cx="100" cy="40" r="14" fill="none" stroke="rgba(201,162,39,0.25)" strokeWidth="1.5" />
        <SvgText x="100" y="46" textAnchor="middle" fontSize="14" fill={C.gold}>★</SvgText>
      </Svg>
    ),
  },
  {
    bg: ['#0D2030', '#060C10'] as [string, string],
    titleKey: 'airportTransfers' as const,
    bodyKey: 'airportTransfersSub' as const,
    Art: () => (
      <Svg viewBox="0 0 200 140" width={200} height={140}>
        <Rect x="20" y="90" width="160" height="30" rx="4" fill="rgba(46,125,79,0.3)" />
        <Rect x="35" y="76" width="130" height="16" rx="3" fill="rgba(46,125,79,0.25)" />
        {[45, 70, 95, 120, 145].map((x, i) => (
          <Rect key={i} x={x} y="78" width="10" height="12" rx="1.5" fill="rgba(201,162,39,0.35)" />
        ))}
        <G transform="translate(100,45) rotate(-20)">
          <Rect x="-36" y="-7" width="72" height="14" rx="7" fill="rgba(46,125,79,0.7)" />
          <Polygon points="-12,-16 12,-16 10,0 -10,0" fill="rgba(46,125,79,0.5)" />
          <Polygon points="-10,4 10,4 7,18 -7,18" fill="rgba(46,125,79,0.4)" />
          <Circle cx="0" cy="0" r="4" fill={C.gold} opacity="0.9" />
        </G>
        <Circle cx="100" cy="88" r="6" fill={C.gold} />
        <Line x1="100" y1="94" x2="100" y2="102" stroke={C.gold} strokeWidth="2" />
      </Svg>
    ),
  },
  {
    bg: ['#2A1E00', '#0D0A00'] as [string, string],
    titleKey: 'earnAndRide' as const,
    bodyKey: 'earnAndRideSub' as const,
    Art: () => (
      <Svg viewBox="0 0 200 140" width={200} height={140}>
        {[[20,20,0.15],[175,30,0.2],[15,110,0.18],[180,100,0.22],[60,130,0.12]].map(([x,y,o],i)=>(
          <SvgText key={i} x={x} y={y} fontSize="13" fill={C.gold} opacity={o} textAnchor="middle">★</SvgText>
        ))}
        <Polygon points="100,20 112,52 148,52 120,72 130,105 100,85 70,105 80,72 52,52 88,52" fill={C.gold} opacity="0.65" />
        <Polygon points="100,32 109,56 134,56 115,70 122,95 100,80 78,95 85,70 66,56 91,56" fill="rgba(201,162,39,0.25)" />
        <Circle cx="100" cy="67" r="12" fill={C.gold} opacity="0.85" />
        <SvgText x="100" y="72" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#000">★</SvgText>
      </Svg>
    ),
  },
];

interface Props { onNext: () => void; lang: Lang }

export default function OnboardingScreen({ onNext, lang }: Props) {
  const [slide, setSlide] = useState(0);
  const ar = lang === 'ar';
  const s = SLIDES[slide];

  return (
    <LinearGradient colors={s.bg} start={{ x: 0, y: 0 }} end={{ x: 0.3, y: 1 }} style={styles.container}>
      <Pressable
        onPress={onNext}
        style={[styles.skipBtn, ar ? { left: 20, right: undefined } : { right: 20 }]}
      >
        <Text style={styles.skip}>{t(lang, 'skip')}</Text>
      </Pressable>

      <View style={styles.artWrap}>
        <s.Art />
      </View>

      <View style={styles.bottom}>
        <Text style={[styles.title, ar && styles.rtl]}>{t(lang, s.titleKey)}</Text>
        <Text style={[styles.body, ar && styles.rtl]}>{t(lang, s.bodyKey)}</Text>

        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <Pressable key={i} onPress={() => setSlide(i)}>
              <View style={[styles.dot, i === slide && styles.dotActive]} />
            </Pressable>
          ))}
        </View>

        <GoldBtn onPress={() => (slide < 2 ? setSlide(s => s + 1) : onNext())}>
          {slide < 2 ? t(lang, 'next') : t(lang, 'getStarted')}
        </GoldBtn>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  skipBtn: { position: 'absolute', top: 12, zIndex: 10 },
  skip: { color: C.gray, fontSize: 14, fontWeight: '600', padding: 8 },
  artWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  bottom: { padding: 28, paddingBottom: 40 },
  title: { color: C.white, fontSize: 26, fontWeight: '800', textAlign: 'center', marginBottom: 10, lineHeight: 32 },
  body: { color: C.gray, fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 28 },
  rtl: { textAlign: 'right' },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 24 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.18)' },
  dotActive: { width: 28, backgroundColor: C.gold },
});
