import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import GoldBtn from '../components/GoldBtn';
import AppInput from '../components/AppInput';
import { C } from '../constants';
import { t, Lang } from '../i18n';

interface Props { onSend: (phone: string) => void; onBack: () => void; lang: Lang }

export default function PhoneScreen({ onSend, onBack, lang }: Props) {
  const [phone, setPhone] = useState('');
  const ar = lang === 'ar';

  return (
    <View style={[styles.container, ar && { direction: 'rtl' }]}>
      <Pressable onPress={onBack} style={[styles.back, ar ? { alignSelf: 'flex-end' } : {}]}>
        <Text style={styles.backArrow}>{ar ? '→' : '←'}</Text>
      </Pressable>

      <Text style={[styles.title, ar && styles.rtl]}>{t(lang, 'enterNumber')}</Text>
      <Text style={[styles.sub, ar && styles.rtl]}>{t(lang, 'sendCodeSub')}</Text>

      <View style={styles.row}>
        <View style={styles.code}>
          <Text style={styles.flag}>🇪🇬</Text>
          <Text style={styles.codeText}>+20</Text>
        </View>
        <AppInput
          ph={t(lang, 'phoneNumber')}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          containerStyle={{ flex: 1 }}
        />
      </View>

      <GoldBtn onPress={() => onSend(phone)} disabled={phone.length < 7}>
        {t(lang, 'sendCode')}
      </GoldBtn>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg, padding: 24, paddingTop: 20 },
  back: { marginBottom: 24 },
  backArrow: { color: C.gold, fontSize: 22, fontWeight: '600' },
  title: { color: C.white, fontSize: 26, fontWeight: '800', marginBottom: 8 },
  sub: { color: C.gray, fontSize: 15, marginBottom: 32 },
  rtl: { textAlign: 'right' },
  row: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  code: {
    width: 88, height: 52, backgroundColor: C.surface2,
    borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
  },
  flag: { fontSize: 18 },
  codeText: { color: C.white, fontSize: 15 },
});
