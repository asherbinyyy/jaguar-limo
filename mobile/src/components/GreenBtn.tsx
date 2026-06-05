import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { C } from '../constants';

interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  sm?: boolean;
  style?: ViewStyle;
}

export default function GreenBtn({ children, onPress, sm, style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        sm && styles.sm,
        { backgroundColor: pressed ? '#153D24' : C.green },
        { transform: [{ scale: pressed ? 0.985 : 1 }] },
        style,
      ]}
    >
      <Text style={[styles.label, sm && styles.labelSm]}>{children}</Text>
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
  label: { fontSize: 16, fontWeight: '600', color: C.white },
  labelSm: { fontSize: 14 },
});
