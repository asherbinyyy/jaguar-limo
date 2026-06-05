import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { C } from '../constants';

interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  sm?: boolean;
  style?: ViewStyle;
}

export default function GoldBtn({ children, onPress, disabled, sm, style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        sm && styles.sm,
        { backgroundColor: disabled ? '#3D3010' : pressed ? '#A8871F' : C.gold },
        { transform: [{ scale: pressed && !disabled ? 0.985 : 1 }] },
        style,
      ]}
    >
      <Text style={[styles.label, sm && styles.labelSm, { color: disabled ? '#666' : '#000' }]}>
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  sm: { height: 42 },
  label: { fontSize: 16, fontWeight: '700', letterSpacing: 0.2 },
  labelSm: { fontSize: 14 },
});
