import React, { useState } from 'react';
import { View, Text, ScrollView, Image, Pressable, StyleSheet, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Chip from '../components/Chip';
import Badge from '../components/Badge';
import { C } from '../constants';
import { t, Lang } from '../i18n';
import { CARS } from '../data/cars';
import { Car } from '../types';
import BrandLogo from '../components/BrandLogo';

interface Props { lang: Lang; navigate: (dest: string, payload?: any) => void }

export default function FleetScreen({ lang, navigate }: Props) {
  const ar = lang === 'ar';
  const [filter, setFilter] = useState<string>('all');

  const filterLabels = ar
    ? [['all', 'الكل'], ['economy', 'اقتصادي'], ['suv', 'SUV'], ['luxury', 'فاخر']]
    : [['all', 'All'], ['economy', 'Economy'], ['suv', 'SUV'], ['luxury', 'Luxury']];

  const list = filter === 'all' ? CARS : CARS.filter(c => c.cat === filter);

  const renderCar = ({ item: car }: { item: Car }) => (
    <Pressable onPress={() => navigate('carDetail', car)} style={styles.card}>
      <View style={styles.imgWrap}>
        <LinearGradient
          colors={car.gradientColors}
          start={{x:0,y:0}} end={{x:1,y:1}}
          style={StyleSheet.absoluteFill}
        />
        <Image
          source={{ uri: car.imageUrl }}
          style={styles.carImg}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.75)']}
          style={styles.imgOverlay}
        />
        <View style={styles.badgeWrap}>
          <Badge label={car.label} type={car.cat} />
        </View>
        <View style={styles.nameRow}>
          <Text style={styles.carName}>{car.name}</Text>
        </View>
        <View style={styles.priceBadge}>
          <Text style={styles.priceTxt}>from EGP {car.price.toLocaleString()}/trip</Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <BrandLogo />
      <View style={styles.header}>
        <Text style={[styles.title, ar && styles.rtl]}>{t(lang, 'ourFleet')}</Text>
        <Text style={[styles.sub, ar && styles.rtl]}>{t(lang, 'fleetSub')}</Text>
      </View>
      <View style={styles.filterWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {filterLabels.map(([id, lbl]) => (
            <Chip key={id} label={lbl} active={filter === id} onPress={() => setFilter(id)} />
          ))}
        </ScrollView>
      </View>
      <FlatList
        data={list}
        keyExtractor={c => String(c.id)}
        renderItem={renderCar}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: { padding: 16, paddingBottom: 12 },
  title: { color: C.white, fontSize: 26, fontWeight: '900' },
  sub: { color: C.gray, fontSize: 13, marginTop: 4 },
  rtl: { textAlign: 'right' },
  filterWrap: { paddingBottom: 14 },
  filters: { paddingHorizontal: 16, gap: 8, flexDirection: 'row' },
  list: { paddingHorizontal: 16, gap: 14, paddingBottom: 16 },
  card: { borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  imgWrap: { height: 170, justifyContent: 'flex-end' },
  carImg: { ...StyleSheet.absoluteFillObject, opacity: 0.85 },
  imgOverlay: { ...StyleSheet.absoluteFillObject },
  badgeWrap: { position: 'absolute', top: 12, left: 12 },
  nameRow: { padding: 14, paddingBottom: 12, paddingTop: 0 },
  carName: { color: C.white, fontSize: 18, fontWeight: '800' },
  priceBadge: { position: 'absolute', bottom: 12, right: 12, backgroundColor: C.gold, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  priceTxt: { color: '#000', fontSize: 11, fontWeight: '800' },
});
