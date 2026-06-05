import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, ViewStyle, TextInputProps } from 'react-native';
import { C } from '../constants';

interface Props extends TextInputProps {
  /** Shorthand for `placeholder` — matches design naming */
  ph?: string;
  icon?: string;
  containerStyle?: ViewStyle;
}

export default function AppInput({ ph, icon, containerStyle, style, ...props }: Props) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={[styles.wrap, containerStyle]}>
      {icon ? (
        <Text style={[styles.icon, { color: focused ? C.gold : C.gray }]}>{icon}</Text>
      ) : null}
      <TextInput
        placeholder={ph}
        placeholderTextColor={C.gray}
        selectionColor={C.gold}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          styles.input,
          { paddingLeft: icon ? 44 : 16, borderColor: focused ? C.gold : 'rgba(255,255,255,0.08)' },
          style,
        ]}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'relative' },
  icon: {
    position: 'absolute',
    left: 14,
    top: 16,
    fontSize: 16,
    zIndex: 1,
  },
  input: {
    height: 52,
    backgroundColor: C.surface2,
    borderWidth: 1.5,
    borderRadius: 12,
    color: C.white,
    fontSize: 15,
    paddingRight: 16,
  },
});
