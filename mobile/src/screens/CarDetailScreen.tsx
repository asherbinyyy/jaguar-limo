import React from 'react';
import { View, Text, ScrollView, Image, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Badge from '../components/Badge';
import GoldBtn from '../components/GoldBtn';
import Card from '../components/Card';
import { C } from '../constants';
import { t, Lang } from '../i18n';
import { Car } from '../types';

const BOOKED_DAYS = [3, 7, 12, 13, 14, 20, 21];

interface Props { car: Car; onBack: () => void; navigate: (d: string, payload?: any) => void; lang: Lang }

export default function CarDetailScreen({ car, onBack, navigate, lang }: Props) {
  const ar = lang === 'ar';

  const specs = [
    ['👥', String(car.seats), ar ? 'مقاعد' : 'Seats'],
    ['👜', String(car.bags), ar ? 'حقائب' : 'Bags'],
    ['⚙️', 'Auto', ar ? 'ناقل' : 'Trans'],
    ['❄️', 'Yes', 'AC'],
    ['📅', '2024', ar ? 'السنة' : 'Year'],
    ['🛡️', ar ? 'مشمول' : 'Incl.', ar ? 'تأمين' : 'Insur.'],
  ];

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <LinearGradient
          colors={car.gradientColors}
          start={{x:0,y:0}} end={{x:1,y:1}}
          style={StyleSheet.absoluteFill}
        />
        <Image source={{ uri: car.imageUrl }} style={styles.carImg} resizeMode="cover" />
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.55)']} style={StyleSheet.absoluteFill} />
        <Pressable onPress={onBack} style={[styles.backBtn, ar ? { right: 14, left: undefined } : { left: 14 }]}>
          <Text style={styles.backArrow}>{ar ? '→' : '←'}</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.name}>{car.name}</Text>
            <Badge label={car.label} type={car.cat} />
          </View>
          <View style={styles.priceWrap}>
            <Text style={styles.price}>EGP {car.price.toLocaleString()}</Text>
            <Text style={styles.perTrip}>/ trip</Text>
          </View>
        </View>

        <View style={styles.specsGrid}>
          {specs.map(([ico, val, lbl], i) => (
            <View key={i} style={styles.specCell}>
              <Text style={styles.specIco}>{ico}</Text>
              <Text style={styles.specVal}>{val}</Text>
              <Text style={styles.specLbl}>{lbl}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.desc, ar && styles.rtl]}>
          {ar ? car.descriptionAr : car.description}
        </Text>

        <Card style={styles.calCard}>
          <Text style={styles.calTitle}>{ar ? 'التوفر — يونيو 2025' : 'Availability — June 2025'}</Text>
          <View style={styles.calGrid}>
            {Array.from({ length: 30 }, (_, i) => {
              const d = i + 1;
              const booked = BOOKED_DAYS.includes(d);
              return (
                <View
                  key={i}
                  style={[styles.calDay, { backgroundColor: booked ? 'rgba(211,47,47,0.2)' : 'rgba(56,142,60,0.18)' }]}
                >
                  <Text style={[styles.calDayTxt, { color: booked ? '#EF5350' : '#66BB6A' }]}>{d}</Text>
                </View>
              );
            })}
          </View>
          <View style={styles.calLegend}>
            <Text style={styles.legendAvail}>● {ar ? 'متاح' : 'Available'}</Text>
            <Text style={styles.legendBooked}>● {ar ? 'محجوز' : 'Booked'}</Text>
          </View>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.footerPrice}>EGP {car.price.toLocaleString()}</Text>
          <Text style={styles.footerPer}>/trip</Text>
        </View>
        <GoldBtn onPress={() => navigate('booking', car)} style={styles.bookBtn}>
          {ar ? 'احجز هذه السيارة' : 'Book This Car'}
        </GoldBtn>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  hero: { height: 230, justifyContent: 'flex-end', overflow: 'hidden' },
  carImg: { ...StyleSheet.absoluteFillObject, opacity: 0.85 },
  backBtn: { position: 'absolute', top: 14, backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 10, width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  backArrow: { color: C.white, fontSize: 20 },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 100 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  name: { color: C.white, fontSize: 24, fontWeight: '900', marginBottom: 6 },
  priceWrap: { alignItems: 'flex-end' },
  price: { color: C.gold, fontSize: 22, fontWeight: '900' },
  perTrip: { color: C.gray, fontSize: 12 },
  specsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginVertical: 16 },
  specCell: { width: '30%', backgroundColor: C.surface, borderRadius: 12, padding: 12, alignItems: 'center', gap: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  specIco: { fontSize: 20 },
  specVal: { color: C.white, fontSize: 13, fontWeight: '800' },
  specLbl: { color: C.gray, fontSize: 10 },
  desc: { color: C.gray, fontSize: 14, lineHeight: 22, marginBottom: 20 },
  rtl: { textAlign: 'right' },
  calCard: { marginBottom: 16 },
  calTitle: { color: C.white, fontSize: 14, fontWeight: '700', marginBottom: 12 },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  calDay: { width: 30, height: 30, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  calDayTxt: { fontSize: 11, fontWeight: '600' },
  calLegend: { flexDirection: 'row', gap: 14, marginTop: 10 },
  legendAvail: { color: '#66BB6A', fontSize: 11 },
  legendBooked: { color: '#EF5350', fontSize: 11 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: C.bg, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)', flexDirection: 'row', alignItems: 'center', gap: 12 },
  footerPrice: { color: C.gold, fontSize: 19, fontWeight: '900' },
  footerPer: { color: C.gray, fontSize: 11 },
  bookBtn: { flex: 1 },
});
