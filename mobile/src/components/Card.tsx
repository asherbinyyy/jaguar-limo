import React from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { C } from '../constants';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  gold?: boolean;
}

export default function Card({ children, style, onPress, gold }: Props) {
  const content = (
    <View style={[styles.card, gold && styles.gold, style]}>
      {children}
    </View>
  );
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}>
        {content}
      </Pressable>
    );
  }
  return content;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: C.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  gold: {
    borderColor: C.gold,
    borderWidth: 1.5,
  },
});
