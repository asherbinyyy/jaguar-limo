import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

interface Props {
  color?: string;
  size?: number;
}

export default function PulseDot({ color = '#4CAF50', size = 8 }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.8, duration: 700, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1,   duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.dot,
        { backgroundColor: color, width: size, height: size, borderRadius: size / 2, transform: [{ scale }] },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  dot: { flexShrink: 0 },
});
