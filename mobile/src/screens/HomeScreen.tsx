import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppInput from '../components/AppInput';
import Chip from '../components/Chip';
import SectionHeader from '../components/SectionHeader';
import PulseDot from '../components/PulseDot';
import { C } from '../constants';
import { t, Lang } from '../i18n';
import { BookData } from '../types';

const REBOOK = [
  { route: 'Maadi → Cairo Airport T2', car: 'Mercedes S-Class', date: 'Jun 2' },
  { route: 'Zamalek → New Cairo', car: 'Audi Q7', date: 'May 28' },
];
const HOME_OFFERS = [
  { title: '15% Off Airport Rides', sub: 'Code: AIRPORT15', exp: 'Ends Jun 10', dark: true },
  { title: 'Eid Special — 20% Off', sub: 'All rides this weekend', exp: 'Ends Jun 8', dark: false },
  { title: 'Monthly Plan Discount', sub: '30 rides / month', exp: 'Limited time', dark: true },
];

interface Props {
  lang: Lang;
  navigate: (dest: string) => void;
  setBookData: (d: BookData) => void;
}

export default function HomeScreen({ lang, navigate, setBookData }: Props) {
  const ar = lang === 'ar';
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [chip, setChip] = useState(0);
  const chips = ar
    ? ['المطار', 'بالساعة', 'ذهاب فقط', 'شهري', 'شركات']
    : ['Airport Transfer', 'Hourly', 'One-Way', 'Monthly', 'Corporate'];

  const handleBook = () => {
    setBookData({
      pickup: pickup || '12 Ahmed Hassan St, Maadi',
      dropoff: dropoff || 'Cairo International Airport T2',
    });
    navigate('booking');
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Bar */}
      <View style={[styles.topBar, ar && styles.rowRtl]}>
        <View>
          <Text style={styles.greeting}>{t(lang, 'goodMorning')}</Text>
          <Text style={styles.name}>{ar ? 'أحمد الشربيني' : 'Ahmed El-Sherbiny'}</Text>
          <Text style={styles.tier}>★ {t(lang, 'goldMember')}</Text>
        </View>
        <View style={[styles.topRight, ar && styles.rowRtl]}>
          <Pressable onPress={() => navigate('toggleLang')} style={styles.langBtn}>
            <Text style={styles.langTxt}>{ar ? 'EN' : 'عر'}</Text>
          </Pressable>
          <Pressable onPress={() => navigate('notifications')} style={styles.bellBtn}>
            <Text style={styles.bellIcon}>🔔</Text>
            <View style={styles.bellBadge} />
          </Pressable>
        </View>
      </View>

      {/* Active Booking Banner */}
      <LinearGradient colors={['#1A4D2E', '#0A1F12']} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.activeBanner}>
        <PulseDot color="#4CAF50" />
        <View style={styles.bannerText}>
          <Text style={styles.bannerTitle}>{t(lang, 'driverOnWay')}</Text>
          <Text style={styles.bannerSub}>Ahmed Hassan · ABC 1234 · Mercedes S-Class</Text>
        </View>
        <Pressable onPress={() => navigate('tracking')} style={styles.trackBtn}>
          <Text style={styles.trackBtnTxt}>{ar ? 'تتبع' : 'Track'}</Text>
        </Pressable>
      </LinearGradient>

      {/* Quick Book Hero */}
      <LinearGradient
        colors={['#1A4D2E', '#0A2015', '#060E09']}
        start={{x:0,y:0}} end={{x:0.7,y:1}}
        style={styles.hero}
      >
        <Text style={[styles.heroTitle, ar && styles.rtl]}>{t(lang, 'whereGoing')}</Text>
        <AppInput
          ph={t(lang, 'pickupPh')}
          value={pickup}
          onChangeText={setPickup}
          icon="📍"
          containerStyle={styles.inputWrap}
          style={styles.heroInput}
        />
        <View style={styles.swapRow}>
          <View style={styles.line} />
          <Pressable
            onPress={() => { const tmp = pickup; setPickup(dropoff); setDropoff(tmp); }}
            style={styles.swapBtn}
          >
            <Text style={styles.swapIcon}>⇅</Text>
          </Pressable>
          <View style={styles.line} />
        </View>
        <AppInput
          ph={t(lang, 'dropoffPh')}
          value={dropoff}
          onChangeText={setDropoff}
          icon="📍"
          containerStyle={styles.inputWrap}
          style={styles.heroInput}
        />
        <View style={styles.dateRow}>
          {[['📅', ar ? 'غداً' : 'Tomorrow'], ['🕙', '10:00 AM']].map(([ico, lbl], i) => (
            <Pressable key={i} style={styles.datePill}>
              <Text>{ico}</Text>
              <Text style={styles.dateTxt}>{lbl}</Text>
            </Pressable>
          ))}
        </View>
        <Pressable onPress={handleBook} style={styles.heroBtn}>
          <Text style={styles.heroBtnTxt}>{t(lang, 'seeAvailable')}</Text>
        </Pressable>
      </LinearGradient>

      {/* Ride Type Chips */}
      <Text style={[styles.secTitle, ar && styles.rtl, { paddingHorizontal: 16, marginBottom: 8 }]}>
        {t(lang, 'rideType')}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {chips.map((c, i) => <Chip key={i} label={c} active={chip === i} onPress={() => setChip(i)} />)}
      </ScrollView>

      {/* Quick Rebook */}
      <View style={styles.section}>
        <SectionHeader title={t(lang, 'bookAgain')} link={t(lang, 'seeAll')} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
          {REBOOK.map((item, i) => (
            <View key={i} style={styles.rebookCard}>
              <Text style={styles.rebookRoute}>{item.route}</Text>
              <Text style={styles.rebookSub}>{item.car} · {item.date}</Text>
              <Pressable onPress={() => navigate('booking')} style={styles.rebookBtn}>
                <Text style={styles.rebookBtnTxt}>{t(lang, 'reBook')}</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Favorites */}
      <View style={styles.section}>
        <SectionHeader title={t(lang, 'favorites')} />
        <View style={styles.favRow}>
          {(ar
            ? [['🏠', 'المنزل'], ['🏢', 'العمل'], ['✈️', 'المطار']]
            : [['🏠', 'Home'], ['🏢', 'Work'], ['✈️', 'Airport']]
          ).map(([ico, lbl], i) => (
            <Pressable key={i} style={styles.favChip}>
              <Text>{ico}</Text>
              <Text style={styles.favTxt}>{lbl}</Text>
            </Pressable>
          ))}
          <Pressable style={styles.favAdd}>
            <Text style={styles.favAddTxt}>+ {t(lang, 'addNew')}</Text>
          </Pressable>
        </View>
      </View>

      {/* Loyalty Card */}
      <View style={styles.section}>
        <LinearGradient
          colors={['#C9A227', '#8A6A10', '#C9A227']}
          start={{x:0,y:0}} end={{x:1,y:1}}
          style={styles.loyaltyCard}
        >
          <View style={styles.loyaltyTop}>
            <View>
              <Text style={styles.loyaltyLabel}>{ar ? 'مكافآت جاغوار' : 'Jaguar Rewards'}</Text>
              <Text style={styles.loyaltyTier}>{ar ? 'ذهبي' : 'GOLD'}</Text>
            </View>
            <View style={styles.loyaltyRight}>
              <Text style={styles.loyaltyPtsLabel}>{ar ? 'نقاطي' : 'Points'}</Text>
              <Text style={styles.loyaltyPts}>1,240</Text>
            </View>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '41%' }]} />
          </View>
          <View style={[styles.loyaltyBottom, ar && styles.rowRtl]}>
            <Text style={styles.loyaltyPtsTo}>{t(lang, 'ptsToPlat')}</Text>
            <Pressable onPress={() => navigate('loyalty')} style={styles.rewardsBtn}>
              <Text style={styles.rewardsBtnTxt}>{t(lang, 'viewRewards')} →</Text>
            </Pressable>
          </View>
        </LinearGradient>
      </View>

      {/* Current Offers */}
      <View style={[styles.section, { marginBottom: 8 }]}>
        <SectionHeader
          title={t(lang, 'currentOffers')}
          link={t(lang, 'seeAll')}
          onLink={() => navigate('offersTab')}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
          {HOME_OFFERS.map((o, i) => (
            <LinearGradient
              key={i}
              colors={o.dark ? ['#1A4D2E', '#0D2818'] : ['#3A2800', '#1A1000']}
              start={{x:0,y:0}} end={{x:1,y:1}}
              style={styles.offerCard}
            >
              <Text style={styles.offerTitle}>{o.title}</Text>
              <Text style={styles.offerSub}>{o.sub}</Text>
              <Text style={styles.offerExp}>{o.exp}</Text>
            </LinearGradient>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: C.bg },
  content: { paddingBottom: 16 },
  topBar: { padding: 16, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  rowRtl: { flexDirection: 'row-reverse' },
  greeting: { color: C.gray, fontSize: 13 },
  name: { color: C.white, fontSize: 20, fontWeight: '800', marginTop: 2 },
  tier: { color: C.gold, fontSize: 12, fontWeight: '600', marginTop: 3 },
  topRight: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  langBtn: { backgroundColor: C.surface2, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: 'rgba(201,162,39,0.3)' },
  langTxt: { color: C.gold, fontSize: 12, fontWeight: '700' },
  bellBtn: { backgroundColor: C.surface2, borderRadius: 12, width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  bellIcon: { fontSize: 18 },
  bellBadge: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF5350', borderWidth: 1.5, borderColor: C.bg },
  activeBanner: { marginHorizontal: 16, marginBottom: 14, borderRadius: 14, padding: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: 'rgba(76,175,80,0.25)' },
  bannerText: { flex: 1 },
  bannerTitle: { color: C.white, fontSize: 14, fontWeight: '700' },
  bannerSub: { color: C.gray, fontSize: 12, marginTop: 2 },
  trackBtn: { backgroundColor: C.gold, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  trackBtnTxt: { color: '#000', fontSize: 12, fontWeight: '800' },
  hero: { marginHorizontal: 16, marginBottom: 16, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: 'rgba(46,125,79,0.25)' },
  heroTitle: { color: C.white, fontSize: 20, fontWeight: '800', marginBottom: 16 },
  inputWrap: { marginBottom: 0 },
  heroInput: { backgroundColor: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.1)' },
  swapRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  line: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.08)' },
  swapBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: C.gold, alignItems: 'center', justifyContent: 'center', marginHorizontal: 10 },
  swapIcon: { color: '#000', fontSize: 16 },
  dateRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  datePill: { flex: 1, height: 44, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  dateTxt: { color: C.white, fontSize: 13 },
  heroBtn: { marginTop: 14, backgroundColor: C.gold, borderRadius: 12, height: 52, alignItems: 'center', justifyContent: 'center' },
  heroBtnTxt: { color: '#000', fontSize: 16, fontWeight: '700' },
  secTitle: { color: C.white, fontSize: 15, fontWeight: '700' },
  rtl: { textAlign: 'right' },
  chips: { paddingHorizontal: 16, paddingBottom: 16, gap: 8, flexDirection: 'row' },
  section: { paddingHorizontal: 16, marginBottom: 16 },
  hScroll: { gap: 12, paddingRight: 16 },
  rebookCard: { backgroundColor: C.surface, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', minWidth: 188 },
  rebookRoute: { color: C.white, fontSize: 13, fontWeight: '700', marginBottom: 4 },
  rebookSub: { color: C.gray, fontSize: 11, marginBottom: 12 },
  rebookBtn: { backgroundColor: 'rgba(201,162,39,0.1)', borderWidth: 1, borderColor: 'rgba(201,162,39,0.3)', borderRadius: 8, height: 34, alignItems: 'center', justifyContent: 'center' },
  rebookBtnTxt: { color: C.gold, fontSize: 12, fontWeight: '700' },
  favRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  favChip: { backgroundColor: C.surface, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  favTxt: { color: C.white, fontSize: 13, fontWeight: '600' },
  favAdd: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: 'rgba(201,162,39,0.4)', borderStyle: 'dashed' },
  favAddTxt: { color: C.gold, fontSize: 13 },
  loyaltyCard: { borderRadius: 18, padding: 20, overflow: 'hidden' },
  loyaltyTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  loyaltyLabel: { color: 'rgba(0,0,0,0.55)', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.2 },
  loyaltyTier: { color: '#000', fontSize: 28, fontWeight: '900', lineHeight: 34 },
  loyaltyRight: { alignItems: 'flex-end' },
  loyaltyPtsLabel: { color: 'rgba(0,0,0,0.55)', fontSize: 11 },
  loyaltyPts: { color: '#000', fontSize: 28, fontWeight: '900' },
  progressTrack: { backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 4, height: 6, marginBottom: 7 },
  progressFill: { height: '100%', borderRadius: 4, backgroundColor: 'rgba(0,0,0,0.45)' },
  loyaltyBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  loyaltyPtsTo: { color: 'rgba(0,0,0,0.65)', fontSize: 12 },
  rewardsBtn: { backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5 },
  rewardsBtnTxt: { color: '#000', fontSize: 12, fontWeight: '700' },
  offerCard: { minWidth: 200, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  offerTitle: { color: C.white, fontSize: 14, fontWeight: '700', marginBottom: 4 },
  offerSub: { color: C.gray, fontSize: 12, marginBottom: 10 },
  offerExp: { color: C.gray, fontSize: 11 },
});
