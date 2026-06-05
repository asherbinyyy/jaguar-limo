import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import LanguageScreen from './src/screens/LanguageScreen';
import AuthGateScreen from './src/screens/AuthGateScreen';
import PhoneScreen from './src/screens/PhoneScreen';
import OTPScreen from './src/screens/OTPScreen';
import HomeScreen from './src/screens/HomeScreen';
import FleetScreen from './src/screens/FleetScreen';
import CarDetailScreen from './src/screens/CarDetailScreen';
import BookingsScreen from './src/screens/BookingsScreen';
import OffersScreen from './src/screens/OffersScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import BookingFlow from './src/screens/BookingFlow';
import TrackingScreen from './src/screens/TrackingScreen';
import LoyaltyScreen from './src/screens/LoyaltyScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import TabBar from './src/components/TabBar';
import BrandLogo from './src/components/BrandLogo';

import { C } from './src/constants';
import { Phase, TabId, ScreenId, BookData, Lang } from './src/types';
import { Car } from './src/types';
import { Storage } from './src/storage';

export default function App() {
  const [phase, setPhase] = useState<Phase>('splash');
  const [lang, setLang] = useState<Lang>('en');
  const [phone, setPhone] = useState('');
  const [tab, setTab] = useState<TabId>('home');
  const [screen, setScreen] = useState<ScreenId>(null);
  const [bookData, setBookData] = useState<BookData>({ pickup: '', dropoff: '' });
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [prevScreen, setPrevScreen] = useState<ScreenId>(null);

  // Persist language preference
  useEffect(() => {
    Storage.getLang().then(l => { if (l === 'en' || l === 'ar') setLang(l as Lang); });
  }, []);

  const go = (s: ScreenId) => { setPrevScreen(screen); setScreen(s); };

  const navigate = (dest: string, payload?: any) => {
    switch (dest) {
      case 'toggleLang':
        const next: Lang = lang === 'en' ? 'ar' : 'en';
        setLang(next);
        Storage.setLang(next);
        break;
      case 'notifications': go('notifications'); break;
      case 'tracking':      go('tracking'); break;
      case 'loyalty':       go('loyalty'); break;
      case 'booking':
        // payload = Car when coming from CarDetail (skip car step)
        // payload = undefined when coming from Home (show car step)
        setSelectedCar(payload ?? null);
        go('booking');
        break;
      case 'carDetail':     setSelectedCar(payload); go('carDetail'); break;
      case 'offersTab':     setTab('offers'); break;
      case 'back':          setScreen(prevScreen); break;
    }
  };

  // ── PRE-APP PHASES ────────────────────────────────────────────────────────
  if (phase === 'splash') {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" />
        <View style={s.fill}>
          <SplashScreen onNext={() => setPhase('onboarding')} />
        </View>
      </SafeAreaProvider>
    );
  }

  if (phase === 'onboarding') {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" />
        <View style={s.fill}>
          <OnboardingScreen onNext={() => setPhase('language')} lang={lang} />
        </View>
      </SafeAreaProvider>
    );
  }

  if (phase === 'language') {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" />
        <View style={s.fill}>
          <LanguageScreen onSelect={l => { setLang(l); Storage.setLang(l); setPhase('auth'); }} />
        </View>
      </SafeAreaProvider>
    );
  }

  if (phase === 'auth') {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" />
        <SafeAreaView style={s.fill}>
          <AuthGateScreen onPhone={() => setPhase('phone')} onGuest={() => setPhase('app')} lang={lang} />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (phase === 'phone') {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" />
        <SafeAreaView style={s.fill}>
          <PhoneScreen onSend={p => { setPhone(p); setPhase('otp'); }} onBack={() => setPhase('auth')} lang={lang} />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (phase === 'otp') {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" />
        <SafeAreaView style={s.fill}>
          <OTPScreen phone={phone} onVerify={() => setPhase('app')} onBack={() => setPhase('phone')} lang={lang} />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  // ── MAIN APP ──────────────────────────────────────────────────────────────
  const renderOverlay = () => {
    if (screen === 'notifications') return <NotificationsScreen onBack={() => setScreen(null)} lang={lang} />;
    if (screen === 'tracking')      return <TrackingScreen onBack={() => setScreen(null)} lang={lang} />;
    if (screen === 'loyalty')       return <LoyaltyScreen onBack={() => setScreen(null)} lang={lang} />;
    if (screen === 'booking') return (
      <BookingFlow
        bookData={bookData}
        preSelectedCar={selectedCar}   // non-null = skip car-selection step
        onBack={() => setScreen(null)}
        onHome={() => { setScreen(null); setTab('home'); }}
        lang={lang}
      />
    );
    if (screen === 'carDetail' && selectedCar) return (
      <CarDetailScreen car={selectedCar} onBack={() => setScreen(null)} navigate={navigate} lang={lang} />
    );
    return null;
  };

  const overlay = renderOverlay();

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <SafeAreaView style={s.fill} edges={['top']}>
        {overlay ? (
          <View style={s.fill}>{overlay}</View>
        ) : (
          <View style={s.fill}>
            {tab !== 'profile' && <BrandLogo />}
            <View style={s.tabContent}>
              {tab === 'home'     && <HomeScreen lang={lang} navigate={navigate} setBookData={setBookData} />}
              {tab === 'fleet'    && <FleetScreen lang={lang} navigate={navigate} />}
              {tab === 'bookings' && <BookingsScreen lang={lang} navigate={navigate} />}
              {tab === 'offers'   && <OffersScreen lang={lang} />}
              {tab === 'profile'  && <ProfileScreen lang={lang} navigate={navigate} />}
            </View>
            <TabBar tab={tab} setTab={setTab} lang={lang} />
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  fill: { flex: 1, backgroundColor: C.bg },
  tabContent: { flex: 1 },
});
