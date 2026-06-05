import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { C } from '../constants';

interface Props {
  n?: number;
  size?: number;
  onRate?: (n: number) => void;
}

export default function Stars({ n = 5, size = 14, onRate }: Props) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Pressable key={i} onPress={() => onRate?.(i)} disabled={!onRate}>
          <Text style={{ color: C.gold, fontSize: size }}>
            {i <= n ? '★' : '☆'}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
