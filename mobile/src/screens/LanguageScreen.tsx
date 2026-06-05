import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import GoldBtn from '../components/GoldBtn';
import { C } from '../constants';
import { Lang } from '../types';

interface Props { onSelect: (lang: Lang) => void }

const OPTIONS: { id: Lang; flag: string; label: string; sub: string }[] = [
  { id: 'en', flag: '🇬🇧', label: 'English',  sub: 'Continue in English' },
  { id: 'ar', flag: '🇪🇬', label: 'العربية', sub: 'الاستمرار بالعربية' },
];

export default function LanguageScreen({ onSelect }: Props) {
  const [sel, setSel] = useState<Lang>('en');

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />

      <Text style={styles.title}>Choose Your Language</Text>
      <Text style={styles.subtitle}>اختر لغتك</Text>

      <View style={styles.options}>
        {OPTIONS.map(opt => (
          <Pressable
            key={opt.id}
            onPress={() => setSel(opt.id)}
            style={[
              styles.option,
              sel === opt.id && styles.optionActive,
            ]}
          >
            <Text style={styles.flag}>{opt.flag}</Text>
            <View style={styles.optText}>
              <Text style={styles.optLabel}>{opt.label}</Text>
              <Text style={styles.optSub}>{opt.sub}</Text>
            </View>
            <View style={[styles.radio, sel === opt.id && styles.radioActive]}>
              {sel === opt.id ? <Text style={styles.check}>✓</Text> : null}
            </View>
          </Pressable>
        ))}
      </View>

      <GoldBtn onPress={() => onSelect(sel)} style={styles.cta}>
        {sel === 'ar' ? 'متابعة' : 'Continue'}
      </GoldBtn>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg, padding: 24, paddingTop: 32 },
  logo: { width: 80, height: 80, alignSelf: 'center', marginBottom: 28, borderRadius: 10 },
  title: { color: C.white, fontSize: 24, fontWeight: '800', textAlign: 'center', marginBottom: 6 },
  subtitle: { color: C.gray, fontSize: 15, textAlign: 'center', marginBottom: 36 },
  options: { gap: 14, flex: 1 },
  option: {
    backgroundColor: C.surface, borderRadius: 16, padding: 18,
    flexDirection: 'row', alignItems: 'center', gap: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  optionActive: { backgroundColor: 'rgba(201,162,39,0.08)', borderColor: C.gold, borderWidth: 1.5 },
  flag: { fontSize: 34 },
  optText: { flex: 1 },
  optLabel: { color: C.white, fontSize: 17, fontWeight: '700' },
  optSub: { color: C.gray, fontSize: 13, marginTop: 2 },
  radio: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  radioActive: { backgroundColor: C.gold, borderColor: C.gold },
  check: { color: '#000', fontSize: 13, fontWeight: '700' },
  cta: { marginTop: 32 },
});
