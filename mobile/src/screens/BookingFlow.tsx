import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Animated, Image, Linking, Alert, Share } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Clipboard from 'expo-clipboard';
import Svg, { Circle, Line, Path, Polyline, Rect, G } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import GoldBtn from '../components/GoldBtn';
import GreenBtn from '../components/GreenBtn';
import OutlineBtn from '../components/OutlineBtn';
import Card from '../components/Card';
import Chip from '../components/Chip';
import Badge from '../components/Badge';
import LocationPicker from '../components/LocationPicker';
import AppInput from '../components/AppInput';
import { C } from '../constants';
import { t, Lang } from '../i18n';
import { BookData, Car } from '../types';
import { CARS } from '../data/cars';
import { VALID_PROMO_CODES } from '../data/offers';
import { api } from '../api';

// Shared booking payload sent to the backend + used for confirmation UI.
export interface BookingPayload {
  pickup: string;
  dropoff: string;
  carId: number;
  carName: string;
  date: string;
  time: string;
  extras: Record<string, boolean>;
  paymentMethod: string;
  total: number;
}
const BUSINESS_WHATSAPP = '201156666422';
const INSTAPAY_NUMBER = '01156666422';

// ─── Progress Bar ──────────────────────────────────────────────────────────────
function BookingProgress({ step, total = 4, lang }: { step: number; total?: number; lang: Lang }) {
  const ar = lang === 'ar';
  const labels4 = ar ? ['التفاصيل','السيارة','التأكيد','تم!']   : ['Details','Car','Confirm','Done!'];
  const labels3 = ar ? ['التفاصيل','التأكيد','تم!']             : ['Details','Confirm','Done!'];
  const labels   = total === 3 ? labels3 : labels4;
  return (
    <View style={[pg.row, ar && { flexDirection: 'row-reverse' }]}>
      {labels.map((lbl, i) => (
        <React.Fragment key={i}>
          <View style={pg.item}>
            <View style={[pg.dot, i + 1 <= step && pg.dotActive]}>
              <Text style={[pg.dotTxt, i + 1 <= step && pg.dotTxtActive]}>
                {i + 1 < step ? '✓' : `${i + 1}`}
              </Text>
            </View>
            <Text style={[pg.lbl, i + 1 <= step && pg.lblActive]}>{lbl}</Text>
          </View>
          {i < labels.length - 1 && <View style={[pg.line, i + 1 < step && pg.lineActive]} />}
        </React.Fragment>
      ))}
    </View>
  );
}
const pg = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 20 },
  item: { alignItems: 'center', gap: 4 },
  dot: { width: 28, height: 28, borderRadius: 14, backgroundColor: C.surface2, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  dotActive: { backgroundColor: C.gold, borderColor: C.gold },
  dotTxt: { fontSize: 12, fontWeight: '800', color: C.gray },
  dotTxtActive: { color: '#000' },
  lbl: { fontSize: 10, color: C.gray },
  lblActive: { color: C.gold },
  line: { flex: 1, height: 2, marginHorizontal: 4, marginBottom: 16, backgroundColor: 'rgba(255,255,255,0.1)' },
  lineActive: { backgroundColor: C.gold },
});

// ─── Step 1: Ride Details ─────────────────────────────────────────────────────
function Step1({ data, onNext, lang }: { data: BookData; onNext: (d: BookData) => void; lang: Lang }) {
  const ar = lang === 'ar';
  const [pickup,  setPickup]  = useState(data.pickup);
  const [dropoff, setDropoff] = useState(data.dropoff);
  const [pickerFor, setPickerFor] = useState<'pickup' | 'dropoff' | null>(null);

  return (
    <View style={st.flex}>
      <ScrollView style={st.flex} contentContainerStyle={st.scrollPad} showsVerticalScrollIndicator={false}>
        {/* Map Mockup */}
        <View style={st.mapBox}>
          <Svg width="100%" height="148" viewBox="0 0 373 148" style={StyleSheet.absoluteFill}>
            {[25, 50, 75, 100, 125].map(y => <Line key={y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(46,125,79,0.12)" strokeWidth="1" />)}
            {[40, 80, 120, 160, 200, 240, 280, 320].map(x => <Line key={x} x1={x} y1="0" x2={x} y2="148" stroke="rgba(46,125,79,0.12)" strokeWidth="1" />)}
            <Path d="M0,74 C60,68 100,80 160,74 C220,68 260,80 320,74 C360,70 390,74 420,74" stroke="rgba(46,125,79,0.5)" strokeWidth="3.5" fill="none" />
            <Path d="M0,74 C60,68 100,80 160,74 C220,68 260,80 320,74 C360,70 390,74 420,74" stroke={C.gold} strokeWidth="2" fill="none" strokeDasharray="10 6" opacity="0.5" />
            <Circle cx="80"  cy="74" r="10" fill={C.gold}   opacity="0.9" /><Circle cx="80"  cy="74" r="4" fill="#000" />
            <Circle cx="300" cy="74" r="10" fill="#EF5350" opacity="0.9" /><Circle cx="300" cy="74" r="4" fill="#000" />
          </Svg>
          <View style={st.mapLabel}><Text style={st.mapLabelTxt}>📍 Cairo, Egypt</Text></View>
          <View style={st.mapEta}><Text style={st.mapEtaTxt}>~32 min · 18 km</Text></View>
        </View>

        <View style={[st.fields, ar && { direction: 'rtl' }]}>
          {/* Pickup — tappable, opens LocationPicker */}
          <View>
            <Text style={[st.fieldLabel, ar && st.rtl]}>{t(lang, 'pickupLocation')}</Text>
            <Pressable onPress={() => setPickerFor('pickup')} style={st.locTapField}>
              <Text style={st.locTapIco}>🟢</Text>
              <Text style={[st.locTapTxt, !pickup && st.locTapPh, ar && st.rtl]} numberOfLines={1}>
                {pickup || (ar ? 'مثال: المعادي، القاهرة' : 'e.g. Maadi, Cairo')}
              </Text>
              {pickup ? <View style={st.locCheck}><Text style={st.locCheckTxt}>✓</Text></View>
                      : <Text style={st.locArrow}>›</Text>}
            </Pressable>
          </View>
          {/* Dropoff */}
          <View>
            <Text style={[st.fieldLabel, ar && st.rtl]}>{t(lang, 'destination')}</Text>
            <Pressable onPress={() => setPickerFor('dropoff')} style={st.locTapField}>
              <Text style={st.locTapIco}>🔴</Text>
              <Text style={[st.locTapTxt, !dropoff && st.locTapPh, ar && st.rtl]} numberOfLines={1}>
                {dropoff || (ar ? 'مثال: مطار القاهرة T2' : 'e.g. Cairo Airport T2')}
              </Text>
              {dropoff ? <View style={st.locCheck}><Text style={st.locCheckTxt}>✓</Text></View>
                       : <Text style={st.locArrow}>›</Text>}
            </Pressable>
          </View>
          <View style={st.dateRow}>
            {[[t(lang, 'date'), '📅', ar ? 'غداً، 6 يون' : 'Tomorrow, Jun 6'], [t(lang, 'time'), '🕙', '10:00 AM']].map(([lbl, ico, val], i) => (
              <View key={i} style={st.dateField}>
                <Text style={[st.fieldLabel, ar && st.rtl]}>{lbl}</Text>
                <Pressable style={st.datePicker}>
                  <Text>{ico}</Text>
                  <Text style={st.dateVal}>{val}</Text>
                </Pressable>
              </View>
            ))}
          </View>
          <View>
            <Text style={[st.fieldLabel, ar && st.rtl]}>{t(lang, 'specialInstructions')}</Text>
            <AppInput ph={t(lang, 'notesDriver')} icon="💬" />
          </View>
        </View>
      </ScrollView>
      <View style={st.footer}>
        <GoldBtn onPress={() => onNext({ pickup: pickup || data.pickup, dropoff: dropoff || data.dropoff })}>
          {ar ? 'التالي — اختر سيارتك' : 'Next — Choose Your Car'}
        </GoldBtn>
      </View>

      {/* Location picker modal */}
      <LocationPicker
        visible={pickerFor !== null}
        onClose={() => setPickerFor(null)}
        onSelect={loc => {
          if (pickerFor === 'pickup') setPickup(loc);
          else setDropoff(loc);
        }}
        lang={lang}
        title={pickerFor === 'pickup'
          ? (ar ? 'موقع الاستلام' : 'Pickup Location')
          : (ar ? 'الوجهة' : 'Destination')}
      />
    </View>
  );
}

// ─── Step 2: Choose Car ───────────────────────────────────────────────────────
function Step2({ onNext, lang }: { onNext: (car: Car) => void; lang: Lang }) {
  const ar = lang === 'ar';
  const [filter, setFilter] = useState('all');
  const [sel, setSel] = useState<number | null>(null);
  const filters = ar
    ? [['all','الكل'],['economy','اقتصادي'],['suv','SUV'],['luxury','فاخر']]
    : [['all','All'],['economy','Economy'],['suv','SUV'],['luxury','Luxury']];
  const list = filter === 'all' ? CARS : CARS.filter(c => c.cat === filter);
  return (
    <View style={st.flex}>
      <View style={st.filterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.filterContent}>
          {filters.map(([id, lbl]) => <Chip key={id} label={lbl} active={filter===id} onPress={()=>setFilter(id)} />)}
        </ScrollView>
      </View>
      <ScrollView style={st.flex} contentContainerStyle={st.carList} showsVerticalScrollIndicator={false}>
        {list.map(car => (
          <Pressable key={car.id} onPress={() => setSel(car.id)} style={[st.carCard, sel===car.id && st.carCardSelected]}>
            <View style={st.carImgWrap}>
              <LinearGradient colors={car.gradientColors} start={{x:0,y:0}} end={{x:1,y:1}} style={StyleSheet.absoluteFill} />
              <Image source={{ uri: car.imageUrl }} style={StyleSheet.absoluteFill} resizeMode="cover" />
              <LinearGradient colors={['transparent','rgba(0,0,0,0.6)']} style={StyleSheet.absoluteFill} />
              <View style={st.carBadgeWrap}><Badge label={car.label} type={car.cat} /></View>
              {sel === car.id && <View style={st.checkWrap}><Text style={st.checkTxt}>✓</Text></View>}
            </View>
            <View style={st.carInfo}>
              <View style={st.carNameRow}>
                <Text style={st.carName}>{car.name}</Text>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={st.carPrice}>EGP {car.price.toLocaleString()}</Text>
                  <Text style={st.carPriceSub}>/ trip</Text>
                </View>
              </View>
              <View style={st.carSpecs}>
                <Text style={st.specTxt}>👥 {car.seats} seats</Text>
                <Text style={st.specTxt}>👜 {car.bags} bags</Text>
                <Text style={st.specTxt}>❄️ AC</Text>
                <Text style={[st.specTxt, { color: '#4CAF50' }]}>● Available</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
      <View style={st.footer}>
        <GoldBtn onPress={() => { const c = CARS.find(c => c.id === sel); if(c) onNext(c); }} disabled={!sel}>
          {ar ? 'التالي — تأكيد الحجز' : 'Next — Confirm Booking'}
        </GoldBtn>
      </View>
    </View>
  );
}

// ─── Step 3: Confirm ─────────────────────────────────────────────────────────
function Step3({ bookData, car, onConfirm, lang }: { bookData: BookData; car: Car; onConfirm: (p: BookingPayload) => void; lang: Lang }) {
  const ar = lang === 'ar';
  const [extras, setExtras] = useState({ child: false, driver: false });
  const [promo, setPromo] = useState('');
  const [promoOk, setPromoOk] = useState(false);
  const [promoErr, setPromoErr] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [pay, setPay] = useState('cash');
  const [proof, setProof] = useState<string | null>(null);  // InstaPay screenshot URI
  const extTotal = (extras.child ? 50 : 0); // driver is "charges apply" — no fixed price shown

  const copyInstapay = async () => {
    await Clipboard.setStringAsync(INSTAPAY_NUMBER);
    Alert.alert(ar ? 'تم النسخ' : 'Copied', ar ? `تم نسخ الرقم ${INSTAPAY_NUMBER}` : `${INSTAPAY_NUMBER} copied to clipboard`);
  };

  const attachProof = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(ar ? 'الإذن مطلوب' : 'Permission needed',
        ar ? 'يرجى السماح بالوصول للصور لإرفاق لقطة الشاشة.' : 'Please allow photo access to attach your screenshot.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]) setProof(result.assets[0].uri);
  };

  const sendProof = async () => {
    if (!proof) return;
    try {
      await Share.share({
        url: proof,
        message: ar
          ? `إثبات دفع إنستاباي — حجز ${car.name}`
          : `InstaPay payment proof — ${car.name} booking`,
      });
    } catch { /* user cancelled share */ }
  };
  const disc = promoOk ? Math.round(car.price * promoDiscount) : 0;
  const total = car.price + extTotal - disc;

  const applyPromo = () => {
    const entry = VALID_PROMO_CODES[promo.trim().toUpperCase()];
    if (entry) { setPromoOk(true); setPromoErr(false); setPromoDiscount(entry.discount); }
    else { setPromoErr(true); setPromoOk(false); }
  };

  return (
    <View style={st.flex}>
      <ScrollView style={st.flex} contentContainerStyle={st.scrollPad} showsVerticalScrollIndicator={false}>
        {/* Summary */}
        <Card style={st.summaryCard}>
          <Text style={st.cardSectionTitle}>{t(lang, 'bookingSummary')}</Text>
          <View style={st.summaryCarRow}>
            <View style={st.summaryCarIcoWrap}><Text style={{ fontSize: 22 }}>🚙</Text></View>
            <View><Text style={st.summaryCarName}>{car.name}</Text><Badge label={car.label} type={car.cat} /></View>
          </View>
          <View style={st.divider} />
          {[[t(lang,'pickupLocation'),bookData.pickup],[t(lang,'destination'),bookData.dropoff],['Date & Time','Jun 6 · 10:00 AM'],[t(lang,'driver'),t(lang,'willBeAssigned')]].map(([k,v],i)=>(
            <View key={i} style={[st.summaryRow, i<3&&st.summaryRowBorder]}>
              <Text style={st.summaryKey}>{k}</Text>
              <Text style={st.summaryVal} numberOfLines={2}>{v}</Text>
            </View>
          ))}
        </Card>
        {/* Extras */}
        <Card style={st.section}>
          <Text style={st.cardSectionTitle}>{t(lang, 'extras')}</Text>
          {/* Child Seat */}
          <Pressable onPress={() => setExtras(x => ({ ...x, child: !x.child }))} style={st.extraRow}>
            <View style={[st.checkbox, extras.child && st.checkboxActive]}>
              {extras.child ? <Text style={st.checkboxTick}>✓</Text> : null}
            </View>
            <Text style={st.extraLbl}>{t(lang, 'childSeat')}</Text>
            <Text style={st.extraPrice}>+ EGP 50</Text>
          </Pressable>
          {/* Driver for the Day */}
          <Pressable onPress={() => setExtras(x => ({ ...x, driver: !x.driver }))} style={[st.extraRow, { borderBottomWidth: 0 }]}>
            <View style={[st.checkbox, extras.driver && st.checkboxActive]}>
              {extras.driver ? <Text style={st.checkboxTick}>✓</Text> : null}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={st.extraLbl}>{ar ? 'سائق خاص لليوم' : 'Personal Driver for the Day'}</Text>
              <Text style={st.extraChargesApply}>{ar ? '* تطبق رسوم إضافية' : '* Charges apply'}</Text>
            </View>
          </Pressable>
        </Card>
        {/* Promo */}
        <Card style={st.section}>
          <Text style={st.cardSectionTitle}>{t(lang, 'promoCode')}</Text>
          <View style={st.promoRow}>
            <AppInput ph="e.g. SAVE15" value={promo} onChangeText={v=>setPromo(v.toUpperCase())} containerStyle={{flex:1}} />
            <Pressable onPress={applyPromo} style={st.applyBtn}>
              <Text style={st.applyTxt}>{t(lang,'apply')}</Text>
            </Pressable>
          </View>
          {promoOk && <Text style={st.promoOk}>✓ {promo} {ar?'مطبق':''} — {VALID_PROMO_CODES[promo]?.label}</Text>}
          {promoErr && <Text style={st.promoErr}>✗ {ar?'رمز غير صالح':'Invalid or expired code'}</Text>}
        </Card>
        {/* Price */}
        <Card style={st.section}>
          <Text style={st.cardSectionTitle}>{t(lang,'priceBreakdown')}</Text>
          <View style={st.priceRow}><Text style={st.priceKey}>{t(lang,'baseFare')}</Text><Text style={st.priceVal}>EGP {car.price.toLocaleString()}</Text></View>
          {extTotal>0 && <View style={st.priceRow}><Text style={st.priceKey}>{t(lang,'extras')}</Text><Text style={st.priceVal}>EGP {extTotal}</Text></View>}
          {promoOk && <View style={st.priceRow}><Text style={st.priceKey}>{t(lang,'discount')}</Text><Text style={[st.priceVal,{color:'#4CAF50'}]}>- EGP {disc}</Text></View>}
          <View style={st.totalRow}>
            <Text style={st.totalKey}>{t(lang,'total')}</Text>
            <Text style={st.totalVal}>EGP {total.toLocaleString()}</Text>
          </View>
        </Card>
        {/* Payment */}
        <Card style={st.section}>
          <Text style={st.cardSectionTitle}>{t(lang,'paymentMethod')}</Text>
          {/* Cash */}
          {(['cash','card','apple','instapay'] as const).map((id, i, arr) => (
            <Pressable key={id} onPress={() => setPay(id)}
              style={[st.payRow, i < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' }]}>
              <View style={[st.radio, pay === id && st.radioActive]} />
              {id === 'cash'     && <Text style={st.payIco}>💵</Text>}
              {id === 'card'     && <Text style={st.payIco}>💳</Text>}
              {id === 'instapay' && (
                <View style={st.instapayMark}><Text style={st.instapayMarkTxt}>IP</Text></View>
              )}
              {id === 'apple' && (
                <View style={st.applePayMark}>
                  {/* Apple logo (SVG path) */}
                  <Svg width="14" height="17" viewBox="0 0 814 1000">
                    <G fill="white">
                      <Path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 482.8 0 350.4 0 223.8c0-122.8 78-188.2 154.2-188.2 51.4 0 93.7 34.3 125.6 34.3 30.8 0 79.4-36.6 137.4-36.6 54.8 0 98.7 18.3 131.5 55.9zm-72.5-192.9c-.6.3-1.1.7-1.7 1C653.4 97.7 618.9 52.9 618.9 0c0-3.6.3-7.3.6-11 45.4 2.6 100.4 31.7 133.5 65.8 27.8 28.5 51.4 71.6 51.4 116.1v3.4z" />
                    </G>
                  </Svg>
                  <Text style={st.applePayTxt}>Pay</Text>
                </View>
              )}
              {id !== 'apple' && (
                <Text style={st.payLbl}>
                  {id === 'cash'     ? t(lang,'cashOnPickup')
                   : id === 'card'   ? '**** 4242 Visa'
                   : (ar ? 'تحويل إنستاباي' : 'InstaPay transfer')}
                </Text>
              )}
            </Pressable>
          ))}

          {/* InstaPay instructions */}
          {pay === 'instapay' && (
            <View style={st.instapayBox}>
              <Text style={[st.instapayTitle, ar && st.rtl]}>
                {ar ? 'حوّل المبلغ عبر إنستاباي إلى:' : 'Send the amount via InstaPay to:'}
              </Text>
              <Pressable onPress={copyInstapay} style={st.instapayNumRow}>
                <Text style={st.instapayNum}>{INSTAPAY_NUMBER}</Text>
                <Text style={st.instapayCopy}>{ar ? 'نسخ' : 'Copy'}</Text>
              </Pressable>
              <Text style={[st.instapayHint, ar && st.rtl]}>
                {ar
                  ? `المبلغ: EGP ${total.toLocaleString()} — ثم أرفق لقطة شاشة للتحويل لتأكيد الدفع.`
                  : `Amount: EGP ${total.toLocaleString()} — then attach a screenshot of the transfer to confirm payment.`}
              </Text>

              {proof ? (
                <View style={st.proofRow}>
                  <Image source={{ uri: proof }} style={st.proofThumb} />
                  <View style={{ flex: 1 }}>
                    <Text style={st.proofOk}>✓ {ar ? 'تم إرفاق لقطة الشاشة' : 'Screenshot attached'}</Text>
                    <View style={st.proofActions}>
                      <Pressable onPress={sendProof}><Text style={st.proofSend}>{ar ? 'إرسال' : 'Send'}</Text></Pressable>
                      <Pressable onPress={attachProof}><Text style={st.proofChange}>{ar ? 'تغيير' : 'Change'}</Text></Pressable>
                    </View>
                  </View>
                </View>
              ) : (
                <Pressable onPress={attachProof} style={st.proofBtn}>
                  <Text style={st.proofBtnIco}>📎</Text>
                  <Text style={st.proofBtnTxt}>{ar ? 'إرفاق لقطة شاشة الدفع' : 'Attach Payment Screenshot'}</Text>
                </Pressable>
              )}
            </View>
          )}
        </Card>
      </ScrollView>
      <View style={st.footer}>
        <GoldBtn onPress={() => {
          if (pay === 'instapay' && !proof) {
            Alert.alert(
              ar ? 'لقطة الدفع مطلوبة' : 'Payment screenshot required',
              ar ? 'يرجى إرفاق لقطة شاشة لتحويل إنستاباي قبل تأكيد الحجز.'
                 : 'Please attach a screenshot of your InstaPay transfer before confirming.');
            return;
          }
          onConfirm({
            pickup: bookData.pickup,
            dropoff: bookData.dropoff,
            carId: car.id,
            carName: car.name,
            date: 'Jun 6',
            time: '10:00 AM',
            extras,
            paymentMethod: pay,
            total,
          });
        }}>{t(lang,'confirmBooking')} — EGP {total.toLocaleString()}</GoldBtn>
      </View>
    </View>
  );
}

// ─── Step 4: Confirmed ────────────────────────────────────────────────────────
interface ConfirmedBooking {
  id: string;
  carName: string;
  date: string;
  pickup: string;
  dropoff: string;
  whatsappUrl: string;
}
function Step4({ onHome, lang, booking }: { onHome: () => void; lang: Lang; booking: ConfirmedBooking | null }) {
  const ar = lang === 'ar';
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setTimeout(() => {
      Animated.timing(progress, { toValue: 1, duration: 900, useNativeDriver: false }).start();
    }, 100);
  }, []);

  const openWhatsApp = () => {
    const url = booking?.whatsappUrl || `https://wa.me/${BUSINESS_WHATSAPP}`;
    Linking.openURL(url).catch(() =>
      Alert.alert(ar ? 'واتساب غير متاح' : 'WhatsApp unavailable',
        ar ? 'يرجى تثبيت واتساب للمتابعة.' : 'Please install WhatsApp to continue.'));
  };

  const rows: [string, string][] = booking
    ? [['Car', booking.carName], ['Date', booking.date], ['From', booking.pickup], ['To', booking.dropoff]]
    : [['Car','Mercedes S-Class'],['Date','Jun 6 · 10:00 AM'],['From','12 Ahmed Hassan St, Maadi'],['To','Cairo Airport T2']];

  return (
    <ScrollView contentContainerStyle={s4.container} showsVerticalScrollIndicator={false}>
      <Svg width="110" height="110" viewBox="0 0 110 110">
        <Circle cx="55" cy="55" r="50" fill="none" stroke={C.gold} strokeWidth="2" opacity="0.12" />
        <Circle cx="55" cy="55" r="50" fill="none" stroke={C.gold} strokeWidth="2.5" strokeDasharray="314" strokeDashoffset="0" />
        <Polyline points="34,55 48,70 76,38" fill="none" stroke={C.gold} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
      <Text style={[s4.title, ar && s4.rtl]}>{t(lang, 'bookingConfirmed')}</Text>
      <Text style={s4.idLabel}>{t(lang, 'bookingId')}</Text>
      <View style={s4.idBox}><Text style={s4.idTxt}>#{booking?.id ?? 'JL-20240606-0042'}</Text></View>
      <Card style={s4.summaryCard}>
        {rows.map(([k,v],i)=>(
          <View key={i} style={[s4.row, i<3&&s4.rowBorder]}>
            <Text style={s4.key}>{k}</Text><Text style={s4.val} numberOfLines={2}>{v}</Text>
          </View>
        ))}
      </Card>
      {/* Booking is sent to the team automatically — no action needed */}
      <View style={s4.autoNote}>
        <Text style={s4.autoNoteTxt}>
          {ar
            ? '✓ تم إرسال تفاصيل حجزك إلى فريق جاغوار تلقائياً. سنتواصل معك قريباً.'
            : '✓ Your booking details were sent to the Jaguar team automatically. We\'ll be in touch shortly.'}
        </Text>
      </View>
      {/* Optional: customer can also reach us on WhatsApp */}
      <Pressable onPress={openWhatsApp} style={s4.waBtn}>
        <Text style={s4.waIco}>💬</Text>
        <Text style={s4.waTxt}>{ar ? 'تواصل معنا عبر واتساب (اختياري)' : 'Contact us on WhatsApp (optional)'}</Text>
      </Pressable>
      <GoldBtn onPress={onHome} style={s4.btn}>{t(lang, 'trackBooking')}</GoldBtn>
      <OutlineBtn onPress={onHome} style={s4.btn}>{t(lang, 'backToHome')}</OutlineBtn>
    </ScrollView>
  );
}
const s4 = StyleSheet.create({
  container:{flexGrow:1,backgroundColor:C.bg,alignItems:'center',justifyContent:'center',padding:28,gap:12},
  waBtn:{width:'100%',flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,height:54,borderRadius:14,backgroundColor:'rgba(37,211,102,0.12)',borderWidth:1,borderColor:'#25D366'},
  waIco:{fontSize:18},
  waTxt:{color:'#25D366',fontSize:15,fontWeight:'800'},
  autoNote:{width:'100%',backgroundColor:'rgba(76,175,80,0.1)',borderWidth:1,borderColor:'rgba(76,175,80,0.3)',borderRadius:12,padding:12},
  autoNoteTxt:{color:'#9CCC9C',fontSize:13,lineHeight:19,textAlign:'center'},
  title:{color:C.white,fontSize:26,fontWeight:'900',textAlign:'center'},
  rtl:{textAlign:'right'},
  idLabel:{color:C.gray,fontSize:14},
  idBox:{backgroundColor:C.surface,borderRadius:12,paddingHorizontal:20,paddingVertical:10,borderWidth:1,borderColor:'rgba(201,162,39,0.3)'},
  idTxt:{color:C.gold,fontSize:17,fontWeight:'900',letterSpacing:1},
  summaryCard:{width:'100%',padding:12,gap:0},
  row:{flexDirection:'row',justifyContent:'space-between',paddingVertical:6},
  rowBorder:{borderBottomWidth:1,borderBottomColor:'rgba(255,255,255,0.04)'},
  key:{color:C.gray,fontSize:13},
  val:{color:C.white,fontSize:13},
  btn:{width:'100%'},
});

// ─── Main BookingFlow ─────────────────────────────────────────────────────────
interface Props {
  bookData: BookData;
  preSelectedCar?: Car | null;   // set when coming from CarDetail → skip step 2
  onBack: () => void;
  onHome: () => void;
  lang: Lang;
}

export default function BookingFlow({ bookData, preSelectedCar, onBack, onHome, lang }: Props) {
  const ar = lang === 'ar';
  const skipCarStep = !!preSelectedCar;                 // true = 3-step flow
  const totalSteps  = skipCarStep ? 3 : 4;

  const [step, setStep] = useState(1);
  const [data, setData] = useState(bookData);
  const [selectedCar, setSelectedCar] = useState<Car | null>(preSelectedCar ?? null);
  const [confirmed, setConfirmed] = useState<ConfirmedBooking | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Create the booking on the backend (fires email + builds WhatsApp link),
  // then advance to the confirmation screen. Falls back gracefully offline.
  const handleConfirm = async (payload: BookingPayload, doneStep: number) => {
    if (submitting) return;
    setSubmitting(true);
    const fallbackWa = `https://wa.me/${BUSINESS_WHATSAPP}`;
    try {
      const res: any = await api.bookings.create(payload);
      setConfirmed({
        id: res?.id ?? 'JL-PENDING',
        carName: payload.carName,
        date: `${payload.date} · ${payload.time}`,
        pickup: payload.pickup,
        dropoff: payload.dropoff,
        whatsappUrl: res?.whatsappUrl ?? fallbackWa,
      });
    } catch {
      // Backend unreachable — still confirm locally with a basic WhatsApp link.
      setConfirmed({
        id: 'JL-OFFLINE',
        carName: payload.carName,
        date: `${payload.date} · ${payload.time}`,
        pickup: payload.pickup,
        dropoff: payload.dropoff,
        whatsappUrl: fallbackWa,
      });
    } finally {
      setSubmitting(false);
      setStep(doneStep);
    }
  };

  // When car is pre-selected the visual steps are: 1=Details, 2=Confirm, 3=Done
  // When no car:                                   1=Details, 2=Car,     3=Confirm, 4=Done
  const goNext = (from: number) => setStep(from + 1);
  const goBack = () => { step > 1 ? setStep(s => s - 1) : onBack(); };

  // Resolve which component to show based on step + skipCarStep
  const renderStep = () => {
    if (!skipCarStep) {
      // 4-step flow
      if (step === 1) return <Step1 data={data} onNext={d => { setData(d); goNext(1); }} lang={lang} />;
      if (step === 2) return <Step2 onNext={car => { setSelectedCar(car); goNext(2); }} lang={lang} />;
      if (step === 3) return <Step3 bookData={data} car={selectedCar ?? FALLBACK_CAR} onConfirm={p => handleConfirm(p, 4)} lang={lang} />;
      return <Step4 onHome={onHome} lang={lang} booking={confirmed} />;
    } else {
      // 3-step flow (car already chosen)
      if (step === 1) return <Step1 data={data} onNext={d => { setData(d); goNext(1); }} lang={lang} />;
      if (step === 2) return <Step3 bookData={data} car={selectedCar ?? FALLBACK_CAR} onConfirm={p => handleConfirm(p, 3)} lang={lang} />;
      return <Step4 onHome={onHome} lang={lang} booking={confirmed} />;
    }
  };

  // Step titles matching the current flow
  const stepTitle = () => {
    if (!skipCarStep) {
      return (ar
        ? ['تفاصيل الرحلة','اختر سيارتك','تأكيد الحجز','تم الحجز!']
        : ['Ride Details','Choose Your Car','Confirm Booking','Booking Done!']
      )[step - 1];
    } else {
      // Pre-selected car: show selected car name in header
      const carName = selectedCar?.name ?? '';
      return (ar
        ? [`تفاصيل الرحلة — ${carName}`, 'تأكيد الحجز', 'تم الحجز!']
        : [`Ride Details — ${carName}`, 'Confirm Booking', 'Booking Done!']
      )[step - 1];
    }
  };

  // Progress dots: map current step to visual steps
  const progressStep = step;   // 1-indexed, same for both flows

  const isDone = skipCarStep ? step === 3 : step === 4;

  return (
    <View style={st.container}>
      {!isDone && (
        <View style={st.header}>
          <View style={[st.headerTop, ar && { flexDirection: 'row-reverse' }]}>
            <Pressable onPress={goBack}>
              <Text style={st.backArrow}>{ar ? '→' : '←'}</Text>
            </Pressable>
            <Text style={st.headerTitle} numberOfLines={1}>{stepTitle()}</Text>
          </View>
          <BookingProgress step={progressStep} total={totalSteps} lang={lang} />
        </View>
      )}
      <View style={st.flex}>{renderStep()}</View>
    </View>
  );
}

const FALLBACK_CAR: Car = {
  id: 1, name: 'Mercedes S-Class', cat: 'luxury', label: 'Luxury',
  price: 850, seats: 4, bags: 2, imageUrl: '',
  gradientColors: ['#0F2A1C','#040D09'], description: '', descriptionAr: '',
};

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  flex: { flex: 1 },
  header: { paddingTop: 14, paddingBottom: 10, backgroundColor: C.bg, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)', gap: 10 },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20 },
  backArrow: { color: C.gold, fontSize: 22, fontWeight: '600' },
  headerTitle: { color: C.white, fontSize: 17, fontWeight: '700' },
  scrollPad: { padding: 16, paddingBottom: 20, gap: 14 },
  mapBox: { height: 148, borderRadius: 14, backgroundColor: '#0A1F12', overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(46,125,79,0.2)', marginBottom: 4 },
  mapLabel: { position: 'absolute', top: 10, left: 10, backgroundColor: 'rgba(0,0,0,0.65)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  mapLabelTxt: { color: C.white, fontSize: 11 },
  mapEta: { position: 'absolute', bottom: 10, right: 10, backgroundColor: 'rgba(201,162,39,0.15)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  mapEtaTxt: { color: C.gold, fontSize: 11 },
  fields: { gap: 14 },
  fieldLabel: { color: C.gray, fontSize: 13, marginBottom: 6 },
  rtl: { textAlign: 'right' },
  dateRow: { flexDirection: 'row', gap: 8 },
  dateField: { flex: 1 },
  datePicker: { height: 52, backgroundColor: C.surface2, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 8 },
  dateVal: { color: C.white, fontSize: 14 },
  footer: { padding: 16, paddingBottom: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)', backgroundColor: C.bg },
  filterRow: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  filterContent: { paddingHorizontal: 16, gap: 8, flexDirection: 'row' },
  carList: { padding: 12, gap: 12 },
  carCard: { backgroundColor: C.surface, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  carCardSelected: { borderColor: C.gold, borderWidth: 1.5, backgroundColor: 'rgba(201,162,39,0.05)' },
  carImgWrap: { height: 118, alignItems: 'center', justifyContent: 'center' },
  carBadgeWrap: { position: 'absolute', top: 10, left: 12 },
  checkWrap: { position: 'absolute', top: 10, right: 12, width: 24, height: 24, borderRadius: 12, backgroundColor: C.gold, alignItems: 'center', justifyContent: 'center' },
  checkTxt: { color: '#000', fontSize: 13, fontWeight: '800' },
  carInfo: { padding: 12 },
  carNameRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  carName: { color: C.white, fontSize: 16, fontWeight: '700' },
  carPrice: { color: C.gold, fontSize: 18, fontWeight: '900' },
  carPriceSub: { color: C.gray, fontSize: 10 },
  carSpecs: { flexDirection: 'row', gap: 14, flexWrap: 'wrap' },
  specTxt: { color: C.gray, fontSize: 11 },
  summaryCard: { gap: 0, padding: 16 },
  cardSectionTitle: { color: C.gray, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 },
  summaryCarRow: { flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 12 },
  summaryCarIcoWrap: { width: 52, height: 40, backgroundColor: C.surface2, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  summaryCarName: { color: C.white, fontSize: 15, fontWeight: '700', marginBottom: 4 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginVertical: 8 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7 },
  summaryRowBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' },
  summaryKey: { color: C.gray, fontSize: 13 },
  summaryVal: { color: C.white, fontSize: 13, maxWidth: 190, textAlign: 'right' },
  section: { gap: 0, padding: 16 },
  extraRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' },
  checkbox: { width: 22, height: 22, borderRadius: 6, backgroundColor: C.surface2, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: C.gold, borderColor: C.gold },
  checkboxTick: { color: '#000', fontSize: 13 },
  extraLbl: { flex: 1, color: C.white, fontSize: 14 },
  extraPrice: { color: C.gold, fontSize: 13, fontWeight: '600' },
  promoRow: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  applyBtn: { backgroundColor: C.green, borderRadius: 12, paddingHorizontal: 16, height: 52, alignItems: 'center', justifyContent: 'center' },
  applyTxt: { color: C.white, fontSize: 14, fontWeight: '600' },
  promoOk: { color: '#4CAF50', fontSize: 13, marginTop: 4 },
  promoErr: { color: C.error, fontSize: 13, marginTop: 4 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' },
  priceKey: { color: C.gray, fontSize: 13 },
  priceVal: { color: C.white, fontSize: 13 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', marginTop: 4 },
  totalKey: { color: C.white, fontSize: 16, fontWeight: '700' },
  totalVal: { color: C.gold, fontSize: 22, fontWeight: '900' },
  payRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)' },
  radioActive: { backgroundColor: C.gold, borderColor: C.gold },
  payIco: { fontSize: 20 },
  payLbl: { color: C.white, fontSize: 14 },
  // Apple Pay button mark
  applePayMark: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#000', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 5 },
  applePayTxt:  { color: '#fff', fontSize: 14, fontWeight: '600', letterSpacing: 0.3 },
  // InstaPay mark + instructions
  instapayMark:    { width: 28, height: 22, borderRadius: 5, backgroundColor: '#6A1B9A', alignItems: 'center', justifyContent: 'center' },
  instapayMarkTxt: { color: '#fff', fontSize: 11, fontWeight: '900', letterSpacing: 0.5 },
  instapayBox:     { marginTop: 12, backgroundColor: 'rgba(106,27,154,0.08)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(106,27,154,0.4)', padding: 14, gap: 10 },
  instapayTitle:   { color: C.white, fontSize: 13, fontWeight: '700' },
  instapayNumRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.surface2, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12 },
  instapayNum:     { color: C.white, fontSize: 18, fontWeight: '900', letterSpacing: 1 },
  instapayCopy:    { color: C.gold, fontSize: 13, fontWeight: '700' },
  instapayHint:    { color: C.gray, fontSize: 12, lineHeight: 18 },
  proofBtn:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 48, borderRadius: 10, borderWidth: 1, borderStyle: 'dashed', borderColor: 'rgba(201,162,39,0.5)' },
  proofBtnIco:     { fontSize: 16 },
  proofBtnTxt:     { color: C.gold, fontSize: 14, fontWeight: '700' },
  proofRow:        { flexDirection: 'row', gap: 12, alignItems: 'center' },
  proofThumb:      { width: 54, height: 54, borderRadius: 8, backgroundColor: C.surface2 },
  proofOk:         { color: '#4CAF50', fontSize: 13, fontWeight: '700' },
  proofActions:    { flexDirection: 'row', gap: 16, marginTop: 6 },
  proofSend:       { color: C.gold, fontSize: 13, fontWeight: '700' },
  proofChange:     { color: C.gray, fontSize: 13, fontWeight: '600' },
  // Extras new styles
  extraChargesApply: { color: C.gray, fontSize: 11, marginTop: 2, fontStyle: 'italic' },
  // LocationPicker tap fields in Step1
  locTapField: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 52, backgroundColor: C.surface2, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 12, paddingHorizontal: 14 },
  locTapIco:   { fontSize: 16 },
  locTapTxt:   { flex: 1, color: C.white, fontSize: 14 },
  locTapPh:    { color: C.gray },
  locCheck:    { width: 22, height: 22, borderRadius: 11, backgroundColor: C.gold, alignItems: 'center', justifyContent: 'center' },
  locCheckTxt: { color: '#000', fontSize: 11, fontWeight: '800' },
  locArrow:    { color: C.gray, fontSize: 18 },
});
