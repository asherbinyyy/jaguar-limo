import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Image } from 'react-native';
import { C } from '../constants';

interface Props { onNext: () => void }

export default function SplashScreen({ onNext }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  const transY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 900, delay: 150, useNativeDriver: true }),
      Animated.spring(scale,   { toValue: 1, delay: 150, useNativeDriver: true }),
      Animated.timing(transY,  { toValue: 0, duration: 900, delay: 150, useNativeDriver: true }),
    ]).start();
    const timer = setTimeout(onNext, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity, transform: [{ scale }, { translateY: transY }] }}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
      <Animated.View style={{ opacity, marginTop: 16 }}>
        <Text style={styles.tagline}>YOUR PREMIUM RIDE PARTNER</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', gap: 16 },
  logo: { width: 180, height: 180, borderRadius: 16 },
  tagline: { color: C.gold, fontSize: 11, letterSpacing: 5, fontWeight: '700', textTransform: 'uppercase' },
});
