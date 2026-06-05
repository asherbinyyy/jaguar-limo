import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import GoldBtn from '../components/GoldBtn';
import { C } from '../constants';
import { t, Lang } from '../i18n';

interface Props { phone: string; onVerify: () => void; onBack: () => void; lang: Lang }

export default function OTPScreen({ phone, onVerify, onBack, lang }: Props) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(59);
  const ref0 = useRef<TextInput>(null);
  const ref1 = useRef<TextInput>(null);
  const ref2 = useRef<TextInput>(null);
  const ref3 = useRef<TextInput>(null);
  const ref4 = useRef<TextInput>(null);
  const ref5 = useRef<TextInput>(null);
  const refs = [ref0, ref1, ref2, ref3, ref4, ref5];
  const ar = lang === 'ar';

  useEffect(() => {
    setTimeout(() => refs[0].current?.focus(), 300);
    const interval = setInterval(() => setTimer(n => (n > 0 ? n - 1 : 0)), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDigit = (i: number, val: string) => {
    const d = val.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[i] = d;
    setOtp(next);
    if (d && i < 5) refs[i + 1].current?.focus();
    if (next.every(v => v)) setTimeout(onVerify, 300);
  };

  const handleKeyPress = (i: number, key: string) => {
    if (key === 'Backspace' && !otp[i] && i > 0) {
      refs[i - 1].current?.focus();
    }
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={onBack} style={[styles.back, ar ? { alignSelf: 'flex-end' } : {}]}>
        <Text style={styles.backArrow}>{ar ? '→' : '←'}</Text>
      </Pressable>

      <Text style={[styles.title, ar && styles.rtl]}>{t(lang, 'verificationCode')}</Text>
      <Text style={[styles.sub, ar && styles.rtl]}>
        {t(lang, 'sentTo')} {phone}
      </Text>

      <View style={styles.boxes}>
        {otp.map((d, i) => (
          <TextInput
            key={i}
            ref={refs[i]}
            value={d}
            onChangeText={v => handleDigit(i, v)}
            onKeyPress={({ nativeEvent }) => handleKeyPress(i, nativeEvent.key)}
            maxLength={1}
            keyboardType="number-pad"
            selectionColor={C.gold}
            style={[styles.box, d ? styles.boxFilled : styles.boxEmpty]}
          />
        ))}
      </View>

      <View style={styles.resendRow}>
        {timer > 0 ? (
          <Text style={styles.timerText}>
            {t(lang, 'resendIn')} 00:{String(timer).padStart(2, '0')}
          </Text>
        ) : (
          <Pressable onPress={() => setTimer(59)}>
            <Text style={styles.resend}>{t(lang, 'resendCode')}</Text>
          </Pressable>
        )}
      </View>

      <GoldBtn onPress={onVerify} disabled={!otp.every(v => v)}>
        {t(lang, 'verify')}
      </GoldBtn>
      <Text style={styles.hint}>{t(lang, 'enterAny6')}</Text>
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
  boxes: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 32 },
  box: {
    width: 46, height: 58, textAlign: 'center',
    fontSize: 24, fontWeight: '800',
    backgroundColor: C.surface2, borderRadius: 12, color: C.white,
  },
  boxEmpty: { borderWidth: 2, borderColor: 'rgba(255,255,255,0.08)' },
  boxFilled: { borderWidth: 2, borderColor: C.gold },
  resendRow: { alignItems: 'center', marginBottom: 32 },
  timerText: { color: C.gray, fontSize: 14 },
  resend: { color: C.gold, fontSize: 14, fontWeight: '600' },
  hint: { color: C.gray, fontSize: 12, textAlign: 'center', marginTop: 16 },
});
