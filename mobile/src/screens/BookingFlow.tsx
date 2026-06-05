import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Animated } from 'react-native';
import Svg, { Circle, Line, Path, Polyline } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import GoldBtn from '../components/GoldBtn';
import GreenBtn from '../components/GreenBtn';
import OutlineBtn from '../components/OutlineBtn';
import Card from '../components/Card';
import Chip from '../components/Chip';
import Badge from '../components/Badge';
import AppInput from '../components/AppInput';
import { C } from '../constants';
import { t, Lang } from '../i18n';
import { BookData, Car } from '../types';
import { CARS } from '../data/cars';
import { VALID_PROMO_CODES } from '../data/offers';

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
  const [pickup, setPickup] = useState(data.pickup);
  const [dropoff, setDropoff] = useState(data.dropoff);
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
            <Circle cx="80" cy="74" r="10" fill={C.gold} opacity="0.9" />
            <Circle cx="80" cy="74" r="4" fill="#000" />
            <Circle cx="300" cy="74" r="10" fill="#EF5350" opacity="0.9" />
            <Circle cx="300" cy="74" r="4" fill="#000" />
          </Svg>
          <View style={st.mapLabel}><Text style={st.mapLabelTxt}>📍 Cairo, Egypt</Text></View>
          <View style={st.mapEta}><Text style={st.mapEtaTxt}>~32 min · 18 km</Text></View>
        </View>

        <View style={[st.fields, ar && { direction: 'rtl' }]}>
          <View>
            <Text style={[st.fieldLabel, ar && st.rtl]}>{t(lang, 'pickupLocation')}</Text>
            <AppInput ph={ar ? 'مثال: المعادي' : 'e.g. Maadi, Cairo'} value={pickup} onChangeText={setPickup} icon="🟢" />
          </View>
          <View>
            <Text style={[st.fieldLabel, ar && st.rtl]}>{t(lang, 'destination')}</Text>
            <AppInput ph={ar ? 'مثال: مطار القاهرة' : 'e.g. Cairo Airport T2'} value={dropoff} onChangeText={setDropoff} icon="🔴" />
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
function Step3({ bookData, car, onConfirm, lang }: { bookData: BookData; car: Car; onConfirm: () => void; lang: Lang }) {
  const ar = lang === 'ar';
  const [extras, setExtras] = useState({ child: false, stop: false });
  const [promo, setPromo] = useState('');
  const [promoOk, setPromoOk] = useState(false);
  const [promoErr, setPromoErr] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [pay, setPay] = useState('cash');
  const extTotal = (extras.child ? 50 : 0) + (extras.stop ? 30 : 0);
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
          {[{k:'child',label:t(lang,'childSeat'),price:50},{k:'stop',label:t(lang,'extraStop'),price:30}].map(e=>(
            <Pressable key={e.k} onPress={()=>setExtras(x=>({...x,[e.k]:!(x as any)[e.k]}))} style={st.extraRow}>
              <View style={[st.checkbox, (extras as any)[e.k] && st.checkboxActive]}>
                {(extras as any)[e.k] ? <Text style={st.checkboxTick}>✓</Text> : null}
              </View>
              <Text style={st.extraLbl}>{e.label}</Text>
              <Text style={st.extraPrice}>+ EGP {e.price}</Text>
            </Pressable>
          ))}
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
          {[{id:'cash',lbl:t(lang,'cashOnPickup'),ico:'💵'},{id:'card',lbl:'**** 4242 Visa',ico:'💳'},{id:'apple',lbl:'Apple Pay',ico:'🍎'}].map(p=>(
            <Pressable key={p.id} onPress={()=>setPay(p.id)} style={st.payRow}>
              <View style={[st.radio, pay===p.id&&st.radioActive]} />
              <Text>{p.ico}</Text>
              <Text style={st.payLbl}>{p.lbl}</Text>
            </Pressable>
          ))}
        </Card>
      </ScrollView>
      <View style={st.footer}>
        <GoldBtn onPress={onConfirm}>{t(lang,'confirmBooking')} — EGP {total.toLocaleString()}</GoldBtn>
      </View>
    </View>
  );
}

// ─── Step 4: Confirmed ────────────────────────────────────────────────────────
function Step4({ onHome, lang }: { onHome: () => void; lang: Lang }) {
  const ar = lang === 'ar';
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setTimeout(() => {
      Animated.timing(progress, { toValue: 1, duration: 900, useNativeDriver: false }).start();
    }, 100);
  }, []);

  return (
    <View style={s4.container}>
      <Svg width="110" height="110" viewBox="0 0 110 110">
        <Circle cx="55" cy="55" r="50" fill="none" stroke={C.gold} strokeWidth="2" opacity="0.12" />
        <Circle cx="55" cy="55" r="50" fill="none" stroke={C.gold} strokeWidth="2.5" strokeDasharray="314" strokeDashoffset="0" />
        <Polyline points="34,55 48,70 76,38" fill="none" stroke={C.gold} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
      <Text style={[s4.title, ar && s4.rtl]}>{t(lang, 'bookingConfirmed')}</Text>
      <Text style={s4.idLabel}>{t(lang, 'bookingId')}</Text>
      <View style={s4.idBox}><Text style={s4.idTxt}>#JL-20240606-0042</Text></View>
      <Card style={s4.summaryCard}>
        {[['Car','Mercedes S-Class'],['Date','Jun 6 · 10:00 AM'],['From','12 Ahmed Hassan St, Maadi'],['To','Cairo Airport T2']].map(([k,v],i)=>(
          <View key={i} style={[s4.row, i<3&&s4.rowBorder]}>
            <Text style={s4.key}>{k}</Text><Text style={s4.val}>{v}</Text>
          </View>
        ))}
      </Card>
      <GoldBtn onPress={onHome} style={s4.btn}>{t(lang, 'trackBooking')}</GoldBtn>
      <OutlineBtn onPress={onHome} style={s4.btn}>{t(lang, 'backToHome')}</OutlineBtn>
    </View>
  );
}
const s4 = StyleSheet.create({
  container:{flex:1,backgroundColor:C.bg,alignItems:'center',justifyContent:'center',padding:28,gap:12},
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
      if (step === 3) return <Step3 bookData={data} car={selectedCar ?? FALLBACK_CAR} onConfirm={() => goNext(3)} lang={lang} />;
      return <Step4 onHome={onHome} lang={lang} />;
    } else {
      // 3-step flow (car already chosen)
      if (step === 1) return <Step1 data={data} onNext={d => { setData(d); goNext(1); }} lang={lang} />;
      if (step === 2) return <Step3 bookData={data} car={selectedCar ?? FALLBACK_CAR} onConfirm={() => goNext(2)} lang={lang} />;
      return <Step4 onHome={onHome} lang={lang} />;
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
  payRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)' },
  radioActive: { backgroundColor: C.gold, borderColor: C.gold },
  payLbl: { color: C.white, fontSize: 14 },
});
