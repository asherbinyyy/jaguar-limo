import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Linking, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../components/Card';
import BrandLogo from '../components/BrandLogo';
import { C } from '../constants';
import { t, Lang } from '../i18n';

interface Props { lang: Lang; navigate: (d: string) => void }

export default function ProfileScreen({ lang, navigate }: Props) {
  const ar = lang === 'ar';

  const call = (num: string) => Linking.openURL(`tel:${num}`);
  const email = (addr: string) => Linking.openURL(`mailto:${addr}`);

  const sections = [
    {
      title: t(lang, 'myAccount'),
      rows: [
        { ico:'👤', lbl: t(lang, 'editProfile'), arrow: true },
        { ico:'📍', lbl: t(lang, 'savedAddresses'), arrow: true },
        { ico:'💳', lbl: t(lang, 'paymentMethods'), arrow: true },
        { ico:'🌐', lbl: t(lang, 'language'), val: ar ? 'العربية' : 'English', arrow: true, fn: () => navigate('toggleLang') },
      ],
    },
    {
      title: t(lang, 'loyaltySection'),
      rows: [
        { ico:'⭐', lbl: t(lang, 'jaguarRewards'), val: ar ? '560 للبلاتيني' : '560 to Platinum', arrow: true, gold: true, fn: () => navigate('loyalty') },
      ],
    },
    {
      title: t(lang, 'corporate'),
      rows: [
        { ico:'🏢', lbl: t(lang, 'upgradeCorporate'), arrow: true },
        { ico:'📊', lbl: t(lang, 'invoicesReports'), arrow: true },
      ],
    },
    {
      title: t(lang, 'safety'),
      rows: [
        { ico:'🤝', lbl: t(lang, 'trustedContacts'), arrow: true },
        { ico:'🆘', lbl: t(lang, 'emergencyNumbers'), arrow: true },
      ],
    },
    {
      title: t(lang, 'companyInfo'),
      rows: [
        { ico:'🏆', lbl: t(lang, 'established'), arrow: false },
        { ico:'🛡️', lbl: t(lang, 'insuredFleet'), arrow: false },
        { ico:'🏢', lbl: t(lang, 'corporateClients'), arrow: false },
        { ico:'🕐', lbl: t(lang, 'support24'), arrow: false },
        { ico:'📍', lbl: t(lang, 'address'), val: t(lang, 'addressValue'), arrow: false },
        { ico:'📞', lbl: t(lang, 'callUs'), val: '+201113335999', arrow: true, fn: () => call('+201113335999') },
        { ico:'📧', lbl: t(lang, 'emailUs'), val: 'Info@jaguarlimousine.com', arrow: true, fn: () => email('Info@jaguarlimousine.com') },
      ],
    },
    {
      title: t(lang, 'support'),
      rows: [
        { ico:'💬', lbl: t(lang, 'contactSupport'), arrow: true, fn: () => Linking.openURL('https://wa.me/201113335999') },
        { ico:'⭐', lbl: t(lang, 'rateApp'), arrow: true },
        { ico:'📱', lbl: t(lang, 'appVersion'), val: 'v1.0.0' },
      ],
    },
  ];

  return (
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <BrandLogo />
      {/* Profile Header */}
      <LinearGradient colors={['rgba(26,77,46,0.28)', 'transparent']} style={styles.profileHeader}>
        <View style={[styles.profileRow, ar && styles.rowRtl]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarTxt}>AE</Text>
          </View>
          <View style={[styles.profileInfo, ar && { alignItems: 'flex-end' }]}>
            <Text style={styles.profileName}>{ar ? 'أحمد الشربيني' : 'Ahmed El-Sherbiny'}</Text>
            <Text style={styles.profileSince}>{ar ? 'عضو منذ 2022' : 'Member since 2022'}</Text>
            <View style={[styles.tierRow, ar && styles.rowRtl]}>
              <Text style={styles.crownIco}>👑</Text>
              <Text style={styles.tierTxt}>{ar ? 'عضو ذهبي' : 'Gold Member'}</Text>
              <Text style={styles.ptsSmall}>· 1,240 pts</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Sections */}
      {sections.map((sec, si) => (
        <View key={si} style={styles.section}>
          <Text style={styles.sectionTitle}>{sec.title}</Text>
          <Card style={styles.sectionCard}>
            {sec.rows.map((r, ri) => (
              <Pressable
                key={ri}
                onPress={r.fn}
                disabled={!r.arrow && !r.fn}
                style={[
                  styles.row,
                  ri < sec.rows.length - 1 && styles.rowBorder,
                  ar && styles.rowRtl,
                ]}
              >
                <Text style={styles.rowIco}>{r.ico}</Text>
                <Text style={[styles.rowLbl, (r as any).gold && { color: C.gold }, ar && { textAlign: 'right' }]} numberOfLines={1}>
                  {r.lbl}
                </Text>
                {(r as any).val ? (
                  <Text style={styles.rowVal} numberOfLines={1}>{(r as any).val}</Text>
                ) : null}
                {r.arrow ? <Text style={[styles.arrow, ar && { transform: [{ scaleX: -1 }] }]}>›</Text> : null}
              </Pressable>
            ))}
          </Card>
        </View>
      ))}

      {/* Logout */}
      <Pressable
        onPress={() => Alert.alert(ar ? 'تسجيل الخروج' : 'Log Out', ar ? 'هل تريد تسجيل الخروج؟' : 'Are you sure?', [
          { text: ar ? 'إلغاء' : 'Cancel', style: 'cancel' },
          { text: ar ? 'خروج' : 'Log Out', style: 'destructive', onPress: () => {} },
        ])}
        style={styles.logoutBtn}
      >
        <Text style={styles.logoutTxt}>{t(lang, 'logOut')}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: C.bg },
  content: { paddingBottom: 32 },
  profileHeader: { padding: 16, paddingBottom: 20 },
  profileRow: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  rowRtl: { flexDirection: 'row-reverse' },
  avatar: { width: 68, height: 68, borderRadius: 34, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: C.gold },
  avatarTxt: { color: C.gold, fontSize: 22, fontWeight: '900' },
  profileInfo: { flex: 1 },
  profileName: { color: C.white, fontSize: 19, fontWeight: '800' },
  profileSince: { color: C.gray, fontSize: 13, marginTop: 2 },
  tierRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  crownIco: { fontSize: 12 },
  tierTxt: { color: C.gold, fontSize: 13, fontWeight: '700' },
  ptsSmall: { color: C.gray, fontSize: 12 },
  section: { paddingHorizontal: 16, marginTop: 8 },
  sectionTitle: { color: C.gray, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, paddingHorizontal: 4 },
  sectionCard: { padding: 4, paddingHorizontal: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, paddingHorizontal: 4 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  rowIco: { fontSize: 18, width: 24, textAlign: 'center' },
  rowLbl: { flex: 1, color: C.white, fontSize: 14 },
  rowVal: { color: C.gray, fontSize: 12, maxWidth: 130 },
  arrow: { color: C.gray, fontSize: 20 },
  logoutBtn: { marginHorizontal: 16, marginTop: 12, height: 52, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(211,47,47,0.4)', alignItems: 'center', justifyContent: 'center' },
  logoutTxt: { color: C.error, fontSize: 16, fontWeight: '700' },
});
