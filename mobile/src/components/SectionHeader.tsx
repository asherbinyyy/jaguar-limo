import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { C } from '../constants';

interface Props {
  title: string;
  link?: string;
  onLink?: () => void;
}

export default function SectionHeader({ title, link, onLink }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {link ? (
        <Pressable onPress={onLink}>
          <Text style={styles.link}>{link}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { color: C.white, fontSize: 17, fontWeight: '700' },
  link: { color: C.gold, fontSize: 13, fontWeight: '600' },
});
