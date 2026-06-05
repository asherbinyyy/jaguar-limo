import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GreenBtn from '../components/GreenBtn';
import OutlineBtn from '../components/OutlineBtn';
import { C } from '../constants';
import { t, Lang } from '../i18n';

interface Props { onPhone: () => void; onGuest: () => void; lang: Lang }

export default function AuthGateScreen({ onPhone, onGuest, lang }: Props) {
  const ar = lang === 'ar';
  return (
    <View style={[styles.container, ar && styles.rtl]}>
      <LinearGradient
        colors={['rgba(26,77,46,0.35)', 'transparent']}
        style={styles.hero}
      >
        <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
      </LinearGradient>

      <View style={styles.textWrap}>
        <Text style={[styles.title, ar && styles.textRtl]}>{t(lang, 'welcomeBack')}</Text>
        <Text style={[styles.sub, ar && styles.textRtl]}>{t(lang, 'signInManage')}</Text>
      </View>

      <View style={styles.btns}>
        <GreenBtn onPress={onPhone}>
          <Text style={styles.btnRow}>📞  {t(lang, 'continuePhone')}</Text>
        </GreenBtn>
        <OutlineBtn color="rgba(255,255,255,0.7)">
          <Text style={styles.btnRow}>🔵  {t(lang, 'continueGoogle')}</Text>
        </OutlineBtn>
        <OutlineBtn color="rgba(255,255,255,0.7)">
          <Text style={styles.btnRow}>🍎  {t(lang, 'continueApple')}</Text>
        </OutlineBtn>
      </View>

      <Pressable onPress={onGuest} style={styles.guestWrap}>
        <Text style={styles.guest}>{t(lang, 'continueGuest')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg, paddingHorizontal: 24, paddingBottom: 40 },
  rtl: {},
  hero: { height: 170, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 92, height: 92, borderRadius: 12 },
  textWrap: { marginBottom: 36, alignItems: 'center' },
  title: { color: C.white, fontSize: 26, fontWeight: '800', marginBottom: 8 },
  sub: { color: C.gray, fontSize: 15 },
  textRtl: { textAlign: 'right' },
  btns: { gap: 12 },
  btnRow: { fontSize: 15, fontWeight: '600', color: C.white },
  guestWrap: { alignItems: 'center', marginTop: 24 },
  guest: { color: C.gray, fontSize: 14 },
});
