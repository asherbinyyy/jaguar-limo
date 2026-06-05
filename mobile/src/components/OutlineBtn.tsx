import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { C } from '../constants';

interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  sm?: boolean;
  color?: string;
  style?: ViewStyle;
}

export default function OutlineBtn({ children, onPress, sm, color, style }: Props) {
  const c = color ?? C.gold;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        sm && styles.sm,
        { borderColor: c, opacity: pressed ? 0.75 : 1 },
        style,
      ]}
    >
      <Text style={[styles.label, sm && styles.labelSm, { color: c }]}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  sm: { height: 42 },
  label: { fontSize: 16, fontWeight: '600' },
  labelSm: { fontSize: 14 },
});
