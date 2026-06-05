import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { C } from '../constants';

interface Props {
  label: string;
  active: boolean;
  onPress: () => void;
}

export default function Chip({ label, active, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        { backgroundColor: active ? C.gold : 'transparent', borderColor: active ? C.gold : 'rgba(201,162,39,0.35)' },
      ]}
    >
      <Text style={[styles.label, { color: active ? '#000' : C.gold }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 7,
    flexShrink: 0,
  },
  label: { fontSize: 13, fontWeight: '600' },
});
