import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppInput from '../components/AppInput';
import SectionHeader from '../components/SectionHeader';
import PulseDot from '../components/PulseDot';
import { C } from '../constants';
import { t, Lang } from '../i18n';
import { BookData } from '../types';

// ─── Static data ──────────────────────────────────────────────────────────────
const REBOOK = [
  { route: 'Maadi → Cairo Airport T2', car: 'Mercedes S-Class', date: 'Jun 2' },
  { route: 'Zamalek → New Cairo',       car: 'Audi Q7',          date: 'May 28' },
];

const HOME_OFFERS = [
  { title: '15% Off Airport Rides',  sub: 'Code: AIRPORT15',    exp: 'Ends Jun 10', dark: true  },
  { title: 'Eid Special — 20% Off',  sub: 'All rides this week', exp: 'Ends Jun 8',  dark: false },
  { title: 'Monthly Plan Discount',  sub: '30 rides / month',    exp: 'Limited',     dark: true  },
];

type RentalType = 'daily' | 'hourly' | 'monthly';

interface Props {
  lang: Lang;
  navigate: (dest: string) => void;
  setBookData: (d: BookData) => void;
}

// ─── Duration Hero ─────────────────────────────────────────────────────────────
function DurationHero({ lang, onSearch }: { lang: Lang; onSearch: () => void }) {
  const ar = lang === 'ar';
  const [type, setType]       = useState<RentalType>('daily');
  const [location, setLocation] = useState('');

  // Daily state
  const [pickupDate,  setPickupDate]  = useState(ar ? 'الثلاثاء، 6 يونيو' : 'Tue, Jun 6');
  const [returnDate,  setReturnDate]  = useState(ar ? 'الجمعة، 9 يونيو'   : 'Fri, Jun 9');

  // Hourly state
  const [startTime,   setStartTime]   = useState('10:00 AM');
  const [hours,       setHours]       = useState(3);

  // Monthly state
  const [startMonth,  setStartMonth]  = useState(ar ? 'يونيو 2025'   : 'June 2025');
  const [months,      setMonths]      = useState(1);

  const TABS: { id: RentalType; en: string; ar: string }[] = [
    { id: 'daily',   en: 'Daily',   ar: 'يومي'   },
    { id: 'hourly',  en: 'Hourly',  ar: 'بالساعة' },
    { id: 'monthly', en: 'Monthly', ar: 'شهري'   },
  ];

  return (
    <LinearGradient
      colors={['#1A4D2E', '#0A2015', '#060E09']}
      start={{ x: 0, y: 0 }} end={{ x: 0.8, y: 1 }}
      style={s.hero}
    >
      {/* Header */}
      <View style={[s.heroHeader, ar && s.rowRtl]}>
        <View style={s.heroTitles}>
          <Text style={[s.heroLabel, ar && s.rtl]}>{ar ? 'اختر مدة الإيجار' : 'Select Rental Duration'}</Text>
          <Text style={[s.heroTitle, ar && s.rtl]}>{ar ? 'احجز سيارتك الآن' : 'Book Your Car'}</Text>
        </View>
        {/* Live car count badge */}
        <View style={s.carsBadge}>
          <Text style={s.carsBadgeNum}>9</Text>
          <Text style={s.carsBadgeSub}>{ar ? 'سيارات\nمتاحة' : 'cars\navail.'}</Text>
        </View>
      </View>

      {/* Type Tabs */}
      <View style={[s.tabsRow, ar && s.rowRtl]}>
        {TABS.map(tab => (
          <Pressable
            key={tab.id}
            onPress={() => setType(tab.id)}
            style={[s.typeTab, type === tab.id && s.typeTabActive]}
          >
            <Text style={[s.typeTabTxt, type === tab.id && s.typeTabTxtActive]}>
              {ar ? tab.ar : tab.en}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Location */}
      <AppInput
        ph={ar ? 'ابحث عن موقع الاستلام...' : 'Search pickup location...'}
        value={location}
        onChangeText={setLocation}
        icon="📍"
        style={s.locInput}
        containerStyle={s.locWrap}
      />

      {/* Duration fields — change per tab */}
      {type === 'daily' && (
        <View style={[s.datesRow, ar && s.rowRtl]}>
          <Pressable style={s.dateBox}>
            <Text style={s.dateBoxLabel}>{ar ? '📅 الاستلام' : '📅 Pick-up'}</Text>
            <Text style={s.dateBoxVal}>{pickupDate}</Text>
          </Pressable>
          <View style={s.dateDivider}>
            <Text style={s.dateDividerTxt}>→</Text>
          </View>
          <Pressable style={s.dateBox}>
            <Text style={s.dateBoxLabel}>{ar ? '📅 الإعادة' : '📅 Return'}</Text>
            <Text style={s.dateBoxVal}>{returnDate}</Text>
          </Pressable>
        </View>
      )}

      {type === 'hourly' && (
        <View style={[s.datesRow, ar && s.rowRtl]}>
          <Pressable style={s.dateBox}>
            <Text style={s.dateBoxLabel}>{ar ? '🕙 وقت البداية' : '🕙 Start Time'}</Text>
            <Text style={s.dateBoxVal}>{startTime}</Text>
          </Pressable>
          <View style={s.dateDivider}>
            <View style={s.stepperWrap}>
              <Pressable onPress={() => setHours(h => Math.max(1, h - 1))} style={s.stepBtn}>
                <Text style={s.stepBtnTxt}>−</Text>
              </Pressable>
              <View style={s.stepValue}>
                <Text style={s.stepValueNum}>{hours}</Text>
                <Text style={s.stepValueLbl}>{ar ? 'ساعة' : 'hr'}</Text>
              </View>
              <Pressable onPress={() => setHours(h => Math.min(24, h + 1))} style={s.stepBtn}>
                <Text style={s.stepBtnTxt}>+</Text>
              </Pressable>
            </View>
          </View>
          <View style={s.dateBox}>
            <Text style={s.dateBoxLabel}>{ar ? '⏱ الانتهاء تقريباً' : '⏱ Est. Return'}</Text>
            <Text style={s.dateBoxVal}>
              {(() => {
                const [h, period] = startTime.split(' ');
                const [hr] = h.split(':');
                const newHr = (parseInt(hr) + hours) % 12 || 12;
                const newPeriod = (parseInt(hr) + hours) >= 12 ? 'PM' : 'AM';
                return `${newHr}:00 ${newPeriod}`;
              })()}
            </Text>
          </View>
        </View>
      )}

      {type === 'monthly' && (
        <View style={[s.datesRow, ar && s.rowRtl]}>
          <Pressable style={s.dateBox}>
            <Text style={s.dateBoxLabel}>{ar ? '📅 تاريخ البداية' : '📅 Start Date'}</Text>
            <Text style={s.dateBoxVal}>{startMonth}</Text>
          </Pressable>
          <View style={s.dateDivider}>
            <View style={s.stepperWrap}>
              <Pressable onPress={() => setMonths(m => Math.max(1, m - 1))} style={s.stepBtn}>
                <Text style={s.stepBtnTxt}>−</Text>
              </Pressable>
              <View style={s.stepValue}>
                <Text style={s.stepValueNum}>{months}</Text>
                <Text style={s.stepValueLbl}>{ar ? 'شهر' : 'mo'}</Text>
              </View>
              <Pressable onPress={() => setMonths(m => Math.min(12, m + 1))} style={s.stepBtn}>
                <Text style={s.stepBtnTxt}>+</Text>
              </Pressable>
            </View>
          </View>
          <View style={s.dateBox}>
            <Text style={s.dateBoxLabel}>{ar ? '💰 تقدير السعر' : '💰 Est. Rate'}</Text>
            <Text style={s.dateBoxVal}>{ar ? `${months * 8500} ج.م` : `EGP ${(months * 8500).toLocaleString()}`}</Text>
          </View>
        </View>
      )}

      {/* CTA */}
      <Pressable onPress={onSearch} style={s.heroBtn}>
        <Text style={s.heroBtnTxt}>
          {ar ? '🚗 شاهد السيارات المتاحة' : '🚗 See Available Cars'}
        </Text>
      </Pressable>
    </LinearGradient>
  );
}

// ─── Main HomeScreen ────────────────────────────────────────────────────────────
export default function HomeScreen({ lang, navigate, setBookData }: Props) {
  const ar = lang === 'ar';

  const handleSearch = () => {
    setBookData({ pickup: 'Selected Location', dropoff: 'Destination' });
    navigate('booking');
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* ── Top Bar ── */}
      <View style={[styles.topBar, ar && styles.rowRtl]}>
        <View>
          <Text style={[styles.greeting, ar && styles.rtl]}>{t(lang, 'goodMorning')}</Text>
          <Text style={[styles.name, ar && styles.rtl]}>{ar ? 'أحمد الشربيني' : 'Ahmed El-Sherbiny'}</Text>
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

      {/* ── Active Booking Banner ── */}
      <LinearGradient
        colors={['#1A4D2E', '#0A1F12']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.activeBanner}
      >
        <PulseDot color="#4CAF50" />
        <View style={styles.bannerText}>
          <Text style={[styles.bannerTitle, ar && styles.rtl]}>{t(lang, 'driverOnWay')}</Text>
          <Text style={styles.bannerSub}>Ahmed Hassan · ABC 1234 · Mercedes S-Class</Text>
        </View>
        <Pressable onPress={() => navigate('tracking')} style={styles.trackBtn}>
          <Text style={styles.trackBtnTxt}>{ar ? 'تتبع' : 'Track'}</Text>
        </Pressable>
      </LinearGradient>

      {/* ── Duration Hero (NEW) ── */}
      <View style={styles.heroWrap}>
        <DurationHero lang={lang} onSearch={handleSearch} />
      </View>

      {/* ── Quick Rebook ── */}
      <View style={styles.section}>
        <SectionHeader title={t(lang, 'bookAgain')} link={t(lang, 'seeAll')} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
          {REBOOK.map((item, i) => (
            <View key={i} style={styles.rebookCard}>
              <Text style={[styles.rebookRoute, ar && styles.rtl]}>{item.route}</Text>
              <Text style={styles.rebookSub}>{item.car} · {item.date}</Text>
              <Pressable onPress={() => navigate('booking')} style={styles.rebookBtn}>
                <Text style={styles.rebookBtnTxt}>{t(lang, 'reBook')}</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* ── Saved Locations ── */}
      <View style={styles.section}>
        <SectionHeader title={t(lang, 'favorites')} />
        <View style={styles.favRow}>
          {(ar
            ? [['🏠', 'المنزل'], ['🏢', 'العمل'], ['✈️', 'المطار']]
            : [['🏠', 'Home'],   ['🏢', 'Work'],   ['✈️', 'Airport']]
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

      {/* ── Current Offers ── */}
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
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.offerCard}
            >
              <Text style={styles.offerTitle}>{o.title}</Text>
              <Text style={styles.offerSub}>{o.sub}</Text>
              <View style={styles.offerBottom}>
                <View style={styles.offerBadge}>
                  <Text style={styles.offerBadgeTxt}>{o.sub.split(' ').pop()}</Text>
                </View>
                <Text style={styles.offerExp}>{o.exp}</Text>
              </View>
            </LinearGradient>
          ))}
        </ScrollView>
      </View>

    </ScrollView>
  );
}

// ─── Hero local styles ─────────────────────────────────────────────────────────
const s = StyleSheet.create({
  hero: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(46,125,79,0.25)',
    gap: 14,
  },
  heroHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  rowRtl:      { flexDirection: 'row-reverse' },
  heroTitles:  { flex: 1 },
  heroLabel:   { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 4 },
  heroTitle:   { color: C.white, fontSize: 22, fontWeight: '900', lineHeight: 28 },
  rtl:         { textAlign: 'right' },
  carsBadge:   { backgroundColor: C.gold, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6, alignItems: 'center', minWidth: 52 },
  carsBadgeNum:{ color: '#000', fontSize: 22, fontWeight: '900', lineHeight: 24, textAlign: 'center' },
  carsBadgeSub:{ color: 'rgba(0,0,0,0.55)', fontSize: 9, fontWeight: '700', textAlign: 'center', lineHeight: 12 },

  // Tabs
  tabsRow:     { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 10, padding: 3, gap: 2 },
  typeTab:     { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  typeTabActive: { backgroundColor: C.gold },
  typeTabTxt:  { color: 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: '600' },
  typeTabTxtActive: { color: '#000', fontWeight: '700' },

  // Location
  locWrap:     {},
  locInput:    { backgroundColor: 'rgba(255,255,255,0.09)', borderColor: 'rgba(255,255,255,0.12)' },

  // Date / duration row
  datesRow:    { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dateBox:     { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  dateBoxLabel:{ color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: '600', marginBottom: 4 },
  dateBoxVal:  { color: C.white, fontSize: 13, fontWeight: '700' },
  dateDivider: { alignItems: 'center', justifyContent: 'center' },
  dateDividerTxt: { color: C.gold, fontSize: 16 },

  // Stepper (for hourly/monthly)
  stepperWrap: { alignItems: 'center', gap: 4 },
  stepBtn:     { width: 28, height: 28, borderRadius: 14, backgroundColor: C.gold, alignItems: 'center', justifyContent: 'center' },
  stepBtnTxt:  { color: '#000', fontSize: 16, fontWeight: '900', lineHeight: 20 },
  stepValue:   { alignItems: 'center' },
  stepValueNum:{ color: C.white, fontSize: 18, fontWeight: '900' },
  stepValueLbl:{ color: C.gold, fontSize: 10, fontWeight: '600' },

  // CTA Button
  heroBtn:     { backgroundColor: C.gold, borderRadius: 14, height: 54, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  heroBtnTxt:  { color: '#000', fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },
});

// ─── Screen-level styles ────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  scroll:       { flex: 1, backgroundColor: C.bg },
  content:      { paddingBottom: 24 },

  topBar:       { padding: 16, paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowRtl:       { flexDirection: 'row-reverse' },
  greeting:     { color: C.gray, fontSize: 13 },
  name:         { color: C.white, fontSize: 18, fontWeight: '800', marginTop: 2 },
  rtl:          { textAlign: 'right' },
  topRight:     { flexDirection: 'row', gap: 10, alignItems: 'center' },
  langBtn:      { backgroundColor: C.surface2, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: 'rgba(201,162,39,0.3)' },
  langTxt:      { color: C.gold, fontSize: 12, fontWeight: '700' },
  bellBtn:      { backgroundColor: C.surface2, borderRadius: 12, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  bellIcon:     { fontSize: 17 },
  bellBadge:    { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF5350', borderWidth: 1.5, borderColor: C.bg },

  activeBanner: { marginHorizontal: 16, marginBottom: 14, borderRadius: 14, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: 'rgba(76,175,80,0.25)' },
  bannerText:   { flex: 1 },
  bannerTitle:  { color: C.white, fontSize: 14, fontWeight: '700' },
  bannerSub:    { color: C.gray, fontSize: 12, marginTop: 2 },
  trackBtn:     { backgroundColor: C.gold, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  trackBtnTxt:  { color: '#000', fontSize: 12, fontWeight: '800' },

  heroWrap:     { marginHorizontal: 16, marginBottom: 20 },

  section:      { paddingHorizontal: 16, marginBottom: 20 },
  hScroll:      { gap: 12, paddingRight: 16 },

  rebookCard:   { backgroundColor: C.surface, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', minWidth: 188 },
  rebookRoute:  { color: C.white, fontSize: 13, fontWeight: '700', marginBottom: 4 },
  rebookSub:    { color: C.gray, fontSize: 11, marginBottom: 12 },
  rebookBtn:    { backgroundColor: 'rgba(201,162,39,0.1)', borderWidth: 1, borderColor: 'rgba(201,162,39,0.3)', borderRadius: 8, height: 34, alignItems: 'center', justifyContent: 'center' },
  rebookBtnTxt: { color: C.gold, fontSize: 12, fontWeight: '700' },

  favRow:       { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  favChip:      { backgroundColor: C.surface, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  favTxt:       { color: C.white, fontSize: 13, fontWeight: '600' },
  favAdd:       { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: 'rgba(201,162,39,0.4)', borderStyle: 'dashed' },
  favAddTxt:    { color: C.gold, fontSize: 13 },

  offerCard:    { minWidth: 200, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', gap: 4 },
  offerTitle:   { color: C.white, fontSize: 14, fontWeight: '700' },
  offerSub:     { color: C.gray, fontSize: 12 },
  offerBottom:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  offerBadge:   { backgroundColor: 'rgba(201,162,39,0.15)', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  offerBadgeTxt:{ color: C.gold, fontSize: 11, fontWeight: '700' },
  offerExp:     { color: C.gray, fontSize: 11 },
});
