import React from 'react';
import { View, Image, StyleSheet, ViewStyle } from 'react-native';

/** Jaguar Limousine brand logo — shown at the top of every main screen. */
export default function BrandLogo({ style }: { style?: ViewStyle }) {
  return (
    <View style={[styles.bar, style]}>
      <Image
        source={require('../../assets/logo-transparent.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bar:  { alignItems: 'flex-start', paddingTop: 16, paddingBottom: 0, paddingHorizontal: 16 },
  logo: { width: 120, height: 62 },
});
