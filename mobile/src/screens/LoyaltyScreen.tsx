import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../components/Card';
import GoldBtn from '../components/GoldBtn';
import { C } from '../constants';
import { t, Lang } from '../i18n';

interface Props { onBack: () => void; lang: Lang }

const REWARDS = [
  { key: 'freeEconomyRide', pts: 500, ico: '🚕' },
  { key: 'upgradeToLuxury', pts: 800, ico: '🚙' },
  { key: 'egp50Discount', pts: 400, ico: '🏷️' },
  { key: 'freeAirportTransfer', pts: 1200, ico: '✈️' },
] as const;

const HISTORY = [
  { pts: '+100 pts', desc: 'Trip completed — Maadi to Airport', descAr: 'رحلة مكتملة — المعادي للمطار', date: 'Jun 4', pos: true },
  { pts: '+150 pts', desc: 'Airport transfer bonus', descAr: 'مكافأة رحلة مطار', date: 'Jun 2', pos: true },
  { pts: '- 400 pts', desc: 'Redeemed: EGP 50 voucher', descAr: 'استبدال: قسيمة 50 جنيه', date: 'May 28', pos: false },
];

const POINTS = 1240;

export default function LoyaltyScreen({ onBack, lang }: Props) {
  const ar = lang === 'ar';
  const [points] = useState(POINTS);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack}>
          <Text style={styles.back}>{ar ? '→' : '←'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{ar ? 'مكافآت جاغوار' : 'Jaguar Rewards'}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Hero Card */}
        <LinearGradient colors={['#C9A227', '#8A6A10', '#C9A227']} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.heroCard}>
          <View style={styles.heroCircle} />
          <Text style={styles.tierLabel}>{t(lang, 'currentTier')}</Text>
          <Text style={styles.tierName}>{t(lang, 'gold')}</Text>
          <Text style={styles.ptsLabel}>{t(lang, 'yourPoints')}</Text>
          <Text style={styles.pts}>{points.toLocaleString()}</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${(points / 3000) * 100}%` }]} />
          </View>
          <Text style={styles.ptsTo}>560 {t(lang, 'ptsTo')}</Text>
        </LinearGradient>

        {/* Tiers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t(lang, 'tiers')}</Text>
          <View style={styles.tiersRow}>
            {[
              { name: t(lang,'silver'), range:'0–999', active:false, colors:['#2A2A2A','#1A1A1A'] as [string,string], perk: ar?'خصم 5%':'5% off' },
              { name: t(lang,'gold'),   range:'1000–2999', active:true, colors:['#C9A227','#8A6A10'] as [string,string], perk: ar?'خصم 10%':'10% off' },
              { name: t(lang,'platinum'), range:'3000+', active:false, colors:['#4A4A5A','#2A2A3A'] as [string,string], perk: ar?'خصم 15%':'15% off' },
            ].map((tier, i) => (
              <View key={i} style={styles.tierCardWrap}>
                {tier.active && <View style={styles.currentBadge}><Text style={styles.currentBadgeTxt}>CURRENT</Text></View>}
                <LinearGradient colors={tier.colors} start={{x:0,y:0}} end={{x:1,y:1}} style={[styles.tierCard, tier.active && styles.tierCardActive]}>
                  <Text style={[styles.tierCardName, { color: tier.active ? '#000' : C.white }]}>{tier.name}</Text>
                  <Text style={[styles.tierCardRange, { color: tier.active ? 'rgba(0,0,0,0.55)' : C.gray }]}>{tier.range} pts</Text>
                  <Text style={[styles.tierCardPerk, { color: tier.active ? 'rgba(0,0,0,0.7)' : C.gray }]}>{tier.perk}</Text>
                </LinearGradient>
              </View>
            ))}
          </View>
        </View>

        {/* Rewards Store */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t(lang, 'rewardsStore')}</Text>
          <View style={styles.rewardsGrid}>
            {REWARDS.map((r, i) => (
              <Card key={i} style={styles.rewardCard}>
                <Text style={styles.rewardIco}>{r.ico}</Text>
                <Text style={[styles.rewardLbl, ar && styles.rtl]}>{t(lang, r.key)}</Text>
                <Text style={styles.rewardPts}>{r.pts} pts</Text>
                <Pressable
                  onPress={() => Alert.alert(ar ? 'تأكيد الاستبدال' : 'Confirm Redeem', `${r.pts} pts → ${t(lang, r.key)}`)}
                  style={[styles.redeemBtn, points >= r.pts && styles.redeemBtnActive]}
                >
                  <Text style={[styles.redeemTxt, points >= r.pts && styles.redeemTxtActive]}>
                    {t(lang, 'redeem')}
                  </Text>
                </Pressable>
              </Card>
            ))}
          </View>
        </View>

        {/* Points History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t(lang, 'pointsHistory')}</Text>
          <Card style={styles.historyCard}>
            {HISTORY.map((h, i) => (
              <View key={i} style={[styles.histRow, i < HISTORY.length - 1 && styles.histRowBorder]}>
                <View style={[styles.histIcon, { backgroundColor: h.pos ? 'rgba(56,142,60,0.2)' : 'rgba(211,47,47,0.2)' }]}>
                  <Text style={styles.histArrow}>{h.pos ? '▲' : '▼'}</Text>
                </View>
                <View style={styles.histInfo}>
                  <Text style={[styles.histPts, { color: h.pos ? '#4CAF50' : '#EF5350' }]}>{h.pts}</Text>
                  <Text style={[styles.histDesc, ar && styles.rtl]}>{ar ? h.descAr : h.desc}</Text>
                </View>
                <Text style={styles.histDate}>{h.date}</Text>
              </View>
            ))}
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16, paddingBottom: 8 },
  back: { color: C.gold, fontSize: 22, fontWeight: '600' },
  headerTitle: { color: C.white, fontSize: 20, fontWeight: '800' },
  content: { padding: 16, gap: 16, paddingBottom: 32 },
  heroCard: { borderRadius: 20, padding: 24, overflow: 'hidden', gap: 4 },
  heroCircle: { position: 'absolute', right: -30, top: -30, width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(255,255,255,0.07)' },
  tierLabel: { color: 'rgba(0,0,0,0.5)', fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.5 },
  tierName: { color: '#000', fontSize: 36, fontWeight: '900' },
  ptsLabel: { color: 'rgba(0,0,0,0.55)', fontSize: 13, marginTop: 4 },
  pts: { color: '#000', fontSize: 32, fontWeight: '900', marginBottom: 10 },
  progressTrack: { backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 4, height: 8, marginBottom: 6 },
  progressFill: { height: '100%', borderRadius: 4, backgroundColor: 'rgba(0,0,0,0.4)' },
  ptsTo: { color: 'rgba(0,0,0,0.6)', fontSize: 12 },
  section: { gap: 10 },
  sectionTitle: { color: C.white, fontSize: 15, fontWeight: '700' },
  tiersRow: { flexDirection: 'row', gap: 10 },
  tierCardWrap: { flex: 1, position: 'relative' },
  currentBadge: { position: 'absolute', top: -8, left: '50%', transform: [{ translateX: -24 }], backgroundColor: C.gold, borderRadius: 8, paddingHorizontal: 7, paddingVertical: 2, zIndex: 1 },
  currentBadgeTxt: { color: '#000', fontSize: 9, fontWeight: '900' },
  tierCard: { borderRadius: 12, padding: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', gap: 4 },
  tierCardActive: { borderColor: C.gold, borderWidth: 1.5 },
  tierCardName: { fontSize: 13, fontWeight: '800' },
  tierCardRange: { fontSize: 10 },
  tierCardPerk: { fontSize: 11 },
  rewardsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  rewardCard: { width: '47%', padding: 14, gap: 4 },
  rewardIco: { fontSize: 28, marginBottom: 4 },
  rewardLbl: { color: C.white, fontSize: 13, fontWeight: '700', lineHeight: 18 },
  rtl: { textAlign: 'right' },
  rewardPts: { color: C.gold, fontSize: 14, fontWeight: '800', marginBottom: 6 },
  redeemBtn: { paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', alignItems: 'center' },
  redeemBtnActive: { backgroundColor: C.gold, borderColor: C.gold },
  redeemTxt: { color: C.gray, fontSize: 12, fontWeight: '700' },
  redeemTxtActive: { color: '#000' },
  historyCard: { padding: 8, paddingHorizontal: 14, gap: 0 },
  histRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 11 },
  histRowBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  histIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  histArrow: { fontSize: 14 },
  histInfo: { flex: 1 },
  histPts: { fontSize: 13, fontWeight: '800' },
  histDesc: { color: C.gray, fontSize: 11, marginTop: 1 },
  histDate: { color: C.gray, fontSize: 11 },
});
