import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import Badge from '../components/Badge';
import Stars from '../components/Stars';
import GoldBtn from '../components/GoldBtn';
import OutlineBtn from '../components/OutlineBtn';
import PulseDot from '../components/PulseDot';
import { C } from '../constants';
import { t, Lang } from '../i18n';
import { BOOKINGS_DATA } from '../data/offers';
import BrandLogo from '../components/BrandLogo';

interface Props { lang: Lang; navigate: (d: string) => void }

export default function BookingsScreen({ lang, navigate }: Props) {
  const ar = lang === 'ar';
  const [activeTab, setActiveTab] = useState<'upcoming'|'active'|'past'|'cancelled'>('upcoming');

  const tabs = ar
    ? [['upcoming','القادمة'],['active','جارية'],['past','السابقة'],['cancelled','ملغاة']]
    : [['upcoming','Upcoming'],['active','Active'],['past','Past'],['cancelled','Cancelled']];

  return (
    <View style={[styles.container, ar && styles.rtlView]}>
      <BrandLogo />
      {/* Header + Tabs */}
      <View style={styles.header}>
        <Text style={[styles.title, ar && styles.rtl]}>{t(lang, 'myBookings')}</Text>
        <View style={styles.tabs}>
          {tabs.map(([id, lbl]) => (
            <Pressable key={id} onPress={() => setActiveTab(id as any)} style={styles.tabBtn}>
              <Text style={[styles.tabTxt, activeTab === id && styles.tabTxtActive]}>{lbl}</Text>
              <View style={[styles.tabLine, activeTab === id && styles.tabLineActive]} />
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Active Booking */}
        {activeTab === 'active' && BOOKINGS_DATA.active.map(b => (
          <View key={b.id} style={styles.activeCard}>
            <View style={styles.activeGradientTop} />
            <View style={styles.activeStatus}>
              <PulseDot color="#4CAF50" />
              <Text style={styles.activeTxt}>{t(lang, 'driverAssigned')}</Text>
            </View>
            <Text style={[styles.route, ar && styles.rtl]}>{b.route}</Text>
            <Text style={styles.cardSub}>{b.car} · {b.date}</Text>
            <View style={styles.driverRow}>
              <View style={styles.driverAvatar}><Text style={styles.driverInitials}>AH</Text></View>
              <View style={styles.driverInfo}>
                <Text style={styles.driverName}>{b.driver}</Text>
                <Text style={styles.driverMeta}>{b.plate} · {b.car}</Text>
              </View>
              <Stars n={5} size={11} />
            </View>
            {/* Progress Stepper */}
            <View style={styles.stepRow}>
              {(ar
                ? ['مؤكد','السائق','الطريق','وصل','اكتمل']
                : ['Confirmed','Assigned','En Route','Arrived','Done']
              ).map((s, i) => (
                <View key={i} style={styles.stepItem}>
                  <View style={[styles.stepDot, i < 3 && styles.stepDotActive, i === 2 && styles.stepDotCurrent]} />
                  <Text style={[styles.stepLbl, i < 3 && styles.stepLblActive]}>{s}</Text>
                </View>
              ))}
            </View>
            <GoldBtn onPress={() => navigate('tracking')} sm>{t(lang, 'trackMap')}</GoldBtn>
          </View>
        ))}

        {/* Upcoming / Past Bookings */}
        {(activeTab === 'upcoming' ? BOOKINGS_DATA.upcoming : activeTab === 'past' ? BOOKINGS_DATA.past : []).map(b => (
          <View key={b.id} style={styles.card}>
            <View style={styles.cardTop}>
              <Badge
                label={activeTab === 'upcoming' ? t(lang, 'confirmed') : t(lang, 'completed')}
                type={activeTab === 'upcoming' ? 'confirmed' : 'economy'}
              />
              <Text style={styles.cardId}>#{b.id.slice(-4)}</Text>
            </View>
            <Text style={[styles.route, ar && styles.rtl]}>{b.route}</Text>
            <Text style={styles.cardSub}>
              {b.car} · {b.date}{(b as any).price ? ` · EGP ${(b as any).price.toLocaleString()}` : ''}
            </Text>
            {(b as any).stars === 0 && (
              <View style={styles.rateRow}>
                <Text style={styles.rateLbl}>{t(lang, 'rateTrip')}</Text>
                <Stars n={0} size={22} onRate={() => {}} />
              </View>
            )}
            {(b as any).stars > 0 && <Stars n={(b as any).stars} size={14} />}
            <View style={styles.cardActions}>
              <OutlineBtn sm style={{ flex: 1 }}>{t(lang, 'details')}</OutlineBtn>
              {activeTab === 'upcoming' && (
                <OutlineBtn sm color={C.error} style={{ flex: 1 }}>{t(lang, 'cancel')}</OutlineBtn>
              )}
              {(b as any).price && (
                <GoldBtn sm style={{ flex: 1 }} onPress={() => navigate('booking')}>{t(lang, 'reBook')}</GoldBtn>
              )}
            </View>
          </View>
        ))}

        {/* Cancelled Empty */}
        {activeTab === 'cancelled' && (
          <View style={styles.empty}>
            <Text style={styles.emptyIco}>🚫</Text>
            <Text style={styles.emptyTitle}>{ar ? 'لا توجد حجوزات ملغاة' : 'No cancelled bookings'}</Text>
            <Text style={styles.emptySub}>{ar ? 'ستظهر هنا الحجوزات الملغاة' : 'Cancelled bookings will appear here'}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  rtlView: {},
  header: { padding: 16, paddingBottom: 0 },
  title: { color: C.white, fontSize: 26, fontWeight: '900', marginBottom: 14 },
  rtl: { textAlign: 'right' },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' },
  tabBtn: { paddingHorizontal: 10, paddingBottom: 8 },
  tabTxt: { color: C.gray, fontSize: 12, fontWeight: '700' },
  tabTxtActive: { color: C.gold },
  tabLine: { height: 2, marginTop: 6, backgroundColor: 'transparent' },
  tabLineActive: { backgroundColor: C.gold },
  scroll: { flex: 1 },
  scrollContent: { padding: 14, gap: 12 },
  activeCard: { backgroundColor: C.surface, borderRadius: 16, padding: 16, borderWidth: 1.5, borderColor: 'rgba(76,175,80,0.35)', overflow: 'hidden', gap: 10 },
  activeGradientTop: { position: 'absolute', top: 0, left: 0, right: 0, height: 3, backgroundColor: '#4CAF50', borderRadius: 16, opacity: 0.7 },
  activeStatus: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  activeTxt: { color: '#66BB6A', fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  route: { color: C.white, fontSize: 15, fontWeight: '700' },
  cardSub: { color: C.gray, fontSize: 12 },
  driverRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.surface2, borderRadius: 12, padding: 10 },
  driverAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center' },
  driverInitials: { color: C.gold, fontSize: 14, fontWeight: '800' },
  driverInfo: { flex: 1 },
  driverName: { color: C.white, fontSize: 14, fontWeight: '700' },
  driverMeta: { color: C.gray, fontSize: 11 },
  stepRow: { flexDirection: 'row', justifyContent: 'space-between' },
  stepItem: { flex: 1, alignItems: 'center', gap: 3 },
  stepDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.15)' },
  stepDotActive: { backgroundColor: '#4CAF50' },
  stepDotCurrent: { shadowColor: '#4CAF50', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.7, shadowRadius: 6 },
  stepLbl: { color: C.gray, fontSize: 8, textAlign: 'center' },
  stepLblActive: { color: '#4CAF50' },
  card: { backgroundColor: C.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', gap: 8 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardId: { color: C.gray, fontSize: 11 },
  rateRow: { gap: 5 },
  rateLbl: { color: C.gold, fontSize: 12 },
  cardActions: { flexDirection: 'row', gap: 8, marginTop: 4 },
  empty: { paddingVertical: 48, alignItems: 'center' },
  emptyIco: { fontSize: 44, marginBottom: 12, opacity: 0.35 },
  emptyTitle: { color: C.white, fontSize: 16, fontWeight: '700', marginBottom: 6 },
  emptySub: { color: C.gray, fontSize: 13 },
});
