import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';
import { C } from '../constants';
import { TabId } from '../types';
import { t, Lang } from '../i18n';

const HomeIcon = ({ color }: { color: string }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill={color}>
    <Path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </Svg>
);
const CarIcon = ({ color }: { color: string }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill={color}>
    <Path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
  </Svg>
);
const CalIcon = ({ color }: { color: string }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill={color}>
    <Path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
  </Svg>
);
const TagIcon = ({ color }: { color: string }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill={color}>
    <Path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z" />
  </Svg>
);
const PersonIcon = ({ color }: { color: string }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill={color}>
    <Path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </Svg>
);

const TABS: { id: TabId; icon: (c: string) => React.ReactNode }[] = [
  { id: 'home',     icon: c => <HomeIcon color={c} /> },
  { id: 'fleet',    icon: c => <CarIcon color={c} /> },
  { id: 'bookings', icon: c => <CalIcon color={c} /> },
  { id: 'offers',   icon: c => <TagIcon color={c} /> },
  { id: 'profile',  icon: c => <PersonIcon color={c} /> },
];

interface Props {
  tab: TabId;
  setTab: (id: TabId) => void;
  lang: Lang;
}

export default function TabBar({ tab, setTab, lang }: Props) {
  const insets = useSafeAreaInsets();
  const ar = lang === 'ar';
  const display = ar ? [...TABS].reverse() : TABS;

  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom || 8 }]}>
      {display.map(item => {
        const active = tab === item.id;
        const color = active ? C.gold : C.gray;
        return (
          <Pressable key={item.id} onPress={() => setTab(item.id)} style={styles.tab}>
            {item.icon(color)}
            <Text style={[styles.label, { color }]}>
              {t(lang, item.id as any)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: C.surface,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.07)',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    gap: 3,
  },
  label: { fontSize: 10, fontWeight: '600' },
});
