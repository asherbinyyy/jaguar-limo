import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { C } from '../constants';

type BadgeType = 'confirmed' | 'active' | 'cancelled' | 'pending' | 'luxury' | 'suv' | 'economy';

const MAP: Record<BadgeType, [string, string]> = {
  confirmed: ['rgba(56,142,60,0.2)', '#66BB6A'],
  active:    ['rgba(56,142,60,0.25)', '#4CAF50'],
  cancelled: ['rgba(211,47,47,0.2)', '#EF5350'],
  pending:   ['rgba(201,162,39,0.2)', C.gold],
  luxury:    ['rgba(201,162,39,0.15)', C.gold],
  suv:       ['rgba(46,125,79,0.18)', '#66BB6A'],
  economy:   ['rgba(138,138,138,0.2)', '#9E9E9E'],
};

interface Props {
  label: string;
  type: BadgeType | string;
}

export default function Badge({ label, type }: Props) {
  const [bg, color] = MAP[type as BadgeType] ?? ['rgba(138,138,138,0.2)', '#9E9E9E'];
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { borderRadius: 6, paddingHorizontal: 9, paddingVertical: 3, alignSelf: 'flex-start' },
  label: { fontSize: 11, fontWeight: '700' },
});
