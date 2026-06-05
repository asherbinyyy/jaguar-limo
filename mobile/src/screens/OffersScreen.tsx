import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Share } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../components/Card';
import AppInput from '../components/AppInput';
import { C } from '../constants';
import { t, Lang } from '../i18n';
import { OFFERS, VALID_PROMO_CODES } from '../data/offers';
import BrandLogo from '../components/BrandLogo';

interface Props { lang: Lang }

export default function OffersScreen({ lang }: Props) {
  const ar = lang === 'ar';
  const [copied, setCopied] = useState<string | null>(null);
  const [manual, setManual] = useState('');
  const [manMsg, setManMsg] = useState('');

  const copy = (code: string) => {
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const applyManual = () => {
    const upper = manual.trim().toUpperCase();
    if (VALID_PROMO_CODES[upper]) {
      setManMsg(ar ? `✓ تم التطبيق! ${VALID_PROMO_CODES[upper].label}` : `✓ Applied! ${VALID_PROMO_CODES[upper].label}`);
    } else {
      setManMsg(ar ? '✗ رمز غير صالح' : '✗ Invalid or expired code');
    }
  };

  const handleShare = () => {
    Share.share({ message: ar ? 'استخدم كودي AHMED50 واحصل على 50 جنيه خصم على أول رحلة!' : 'Use my code AHMED50 and get EGP 50 off your first ride with Jaguar Limousine!' });
  };

  return (
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <BrandLogo style={{ paddingTop: 0, paddingHorizontal: 0 }} />
      <Text style={[styles.title, ar && styles.rtl]}>{t(lang, 'offersAndPromos')}</Text>

      {/* Featured Banner */}
      <LinearGradient colors={['#B8870F', '#C9A227', '#F0D080']} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.featured}>
        <View style={styles.featuredCircle} />
        <Text style={styles.featuredLabel}>{t(lang, 'featuredOffer')}</Text>
        <Text style={styles.featuredTitle}>{t(lang, 'eidSpecial')}</Text>
        <Text style={styles.featuredTimer}>⏱ 2d 14h 30m {t(lang, 'remaining')}</Text>
        <View style={styles.codeRow}>
          <View style={styles.codePill}><Text style={styles.codeTxt}>EID20</Text></View>
          <Pressable onPress={() => copy('EID20')} style={styles.copyBtn}>
            <Text style={styles.copyTxt}>{copied === 'EID20' ? t(lang, 'copied') : t(lang, 'copy')}</Text>
          </Pressable>
        </View>
      </LinearGradient>

      {/* Offers List */}
      <View style={styles.list}>
        {OFFERS.map((o, i) => (
          <LinearGradient key={i} colors={o.bg} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.offerCard}>
            <View style={styles.offerTop}>
              <Text style={styles.offerIco}>{o.ico}</Text>
              <View style={styles.offerTexts}>
                <Text style={[styles.offerTitle, ar && styles.rtl]}>{ar ? o.titleAr : o.title}</Text>
                <Text style={[styles.offerSub, ar && styles.rtl]}>{ar ? o.subAr : o.sub}</Text>
              </View>
            </View>
            <View style={styles.offerBottom}>
              <View style={styles.offerCodeRow}>
                <View style={styles.offerCodePill}><Text style={styles.offerCode}>{o.code}</Text></View>
                <Pressable onPress={() => copy(o.code)} style={styles.offerCopyBtn}>
                  <Text style={[styles.offerCopyTxt, copied === o.code && { color: '#4CAF50' }]}>
                    {copied === o.code ? t(lang, 'copied') : t(lang, 'copy')}
                  </Text>
                </Pressable>
              </View>
              <Text style={styles.offerExp}>{o.exp}</Text>
            </View>
          </LinearGradient>
        ))}
      </View>

      {/* Referral */}
      <LinearGradient colors={['#C9A227', '#8A6A10']} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.referral}>
        <Text style={styles.refLabel}>{t(lang, 'inviteAndEarn')}</Text>
        <Text style={[styles.refTitle, ar && styles.rtl]}>{t(lang, 'giveAndGet')}</Text>
        <Text style={styles.refSub}>3 {ar ? 'أصدقاء انضموا — 150 جنيه مكتسب' : 'friends joined — EGP 150 earned'}</Text>
        <View style={styles.refCodeRow}>
          <View style={styles.refCodePill}><Text style={styles.refCode}>AHMED50</Text></View>
          <Pressable onPress={() => copy('AHMED50')} style={styles.refBtn}>
            <Text style={styles.refBtnTxt}>{copied === 'AHMED50' ? '✓' : t(lang, 'copy')}</Text>
          </Pressable>
          <Pressable onPress={handleShare} style={styles.refBtn}>
            <Text style={styles.refBtnTxt}>{t(lang, 'share')}</Text>
          </Pressable>
        </View>
      </LinearGradient>

      {/* Manual Code */}
      <Card style={styles.manualCard}>
        <Text style={[styles.manualTitle, ar && styles.rtl]}>{t(lang, 'havePromo')}</Text>
        <View style={styles.manualRow}>
          <AppInput
            ph={t(lang, 'enterCode')}
            value={manual}
            onChangeText={v => setManual(v.toUpperCase())}
            containerStyle={{ flex: 1 }}
          />
          <Pressable onPress={applyManual} style={styles.applyBtn}>
            <Text style={styles.applyTxt}>{t(lang, 'apply')}</Text>
          </Pressable>
        </View>
        {manMsg ? (
          <Text style={[styles.manMsg, { color: manMsg.includes('✓') ? '#4CAF50' : C.error }]}>{manMsg}</Text>
        ) : null}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: C.bg },
  content: { padding: 16, paddingBottom: 24, gap: 16 },
  title: { color: C.white, fontSize: 26, fontWeight: '900' },
  rtl: { textAlign: 'right' },
  featured: { borderRadius: 18, padding: 22, overflow: 'hidden' },
  featuredCircle: { position: 'absolute', right: -20, top: -20, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.1)' },
  featuredLabel: { color: 'rgba(0,0,0,0.55)', fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.2 },
  featuredTitle: { color: '#000', fontSize: 18, fontWeight: '900', marginVertical: 4 },
  featuredTimer: { color: 'rgba(0,0,0,0.6)', fontSize: 12, marginBottom: 14 },
  codeRow: { flexDirection: 'row', gap: 8 },
  codePill: { backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  codeTxt: { color: '#000', fontSize: 13, fontWeight: '800' },
  copyBtn: { backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 6 },
  copyTxt: { color: '#000', fontSize: 13, fontWeight: '700' },
  list: { gap: 12 },
  offerCard: { borderRadius: 16, padding: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', gap: 12 },
  offerTop: { flexDirection: 'row', gap: 12 },
  offerIco: { fontSize: 28 },
  offerTexts: { flex: 1 },
  offerTitle: { color: C.white, fontSize: 14, fontWeight: '700', marginBottom: 4 },
  offerSub: { color: C.gray, fontSize: 12 },
  offerBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  offerCodeRow: { flexDirection: 'row', gap: 8 },
  offerCodePill: { backgroundColor: 'rgba(201,162,39,0.15)', borderRadius: 6, paddingHorizontal: 9, paddingVertical: 3 },
  offerCode: { color: C.gold, fontSize: 11, fontWeight: '800' },
  offerCopyBtn: { backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 3 },
  offerCopyTxt: { color: C.gray, fontSize: 11 },
  offerExp: { color: C.gray, fontSize: 11 },
  referral: { borderRadius: 18, padding: 20, gap: 6 },
  refLabel: { color: 'rgba(0,0,0,0.55)', fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.2 },
  refTitle: { color: '#000', fontSize: 15, fontWeight: '800' },
  refSub: { color: 'rgba(0,0,0,0.55)', fontSize: 12, marginBottom: 8 },
  refCodeRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  refCodePill: { backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
  refCode: { color: '#000', fontSize: 16, fontWeight: '900' },
  refBtn: { backgroundColor: 'rgba(0,0,0,0.18)', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
  refBtnTxt: { color: '#000', fontSize: 13, fontWeight: '700' },
  manualCard: { gap: 12 },
  manualTitle: { color: C.white, fontSize: 14, fontWeight: '700' },
  manualRow: { flexDirection: 'row', gap: 8 },
  applyBtn: { backgroundColor: C.gold, borderRadius: 12, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center', height: 52 },
  applyTxt: { color: '#000', fontSize: 14, fontWeight: '700' },
  manMsg: { fontSize: 13 },
});
