import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SectionHeader from '../components/SectionHeader';
import PulseDot from '../components/PulseDot';
import LocationPicker from '../components/LocationPicker';
import { C } from '../constants';
import { t, Lang } from '../i18n';
import { BookData } from '../types';

const REBOOK = [
  { route: 'Maadi → Cairo Airport T2', car: 'Mercedes S-Class', date: 'Jun 2' },
  { route: 'Zamalek → New Cairo',       car: 'Audi Q7',          date: 'May 28' },
];
const HOME_OFFERS = [
  { title: '15% Off Airport Rides',  sub: 'Code: AIRPORT15',    exp: 'Ends Jun 10', dark: true  },
  { title: 'Eid Special — 20% Off',  sub: 'All rides this week', exp: 'Ends Jun 8',  dark: false },
  { title: 'Monthly Plan Discount',  sub: '30 rides / month',    exp: 'Limited',     dark: true  },
];

const TERMINALS = ['T1', 'T2', 'T3'];
type RentalType  = 'daily' | 'monthly' | 'airport';
type AirportDir  = 'from' | 'to';

interface Props {
  lang: Lang;
  navigate: (dest: string) => void;
  setBookData: (d: BookData) => void;
}

// ── Location tap-field ────────────────────────────────────────────────────────
function LocField({ value, placeholder, onPress, ar }: {
  value: string; placeholder: string; onPress: () => void; ar: boolean;
}) {
  return (
    <Pressable onPress={onPress} style={lf.wrap}>
      <Text style={lf.icon}>📍</Text>
      <Text style={[lf.txt, !value && lf.ph, ar && lf.rtl]} numberOfLines={1}>
        {value || placeholder}
      </Text>
      {value ? (
        <View style={lf.badge}>
          <Text style={lf.badgeTxt}>✓</Text>
        </View>
      ) : (
        <Text style={lf.arrow}>›</Text>
      )}
    </Pressable>
  );
}
const lf = StyleSheet.create({
  wrap:     { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(255,255,255,0.09)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 14, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.12)' },
  icon:     { fontSize: 16 },
  txt:      { flex: 1, color: C.white, fontSize: 14, fontWeight: '500' },
  ph:       { color: C.gray },
  rtl:      { textAlign: 'right' },
  badge:    { width: 22, height: 22, borderRadius: 11, backgroundColor: C.gold, alignItems: 'center', justifyContent: 'center' },
  badgeTxt: { color: '#000', fontSize: 11, fontWeight: '800' },
  arrow:    { color: C.gray, fontSize: 18 },
});

// ── Duration Hero ─────────────────────────────────────────────────────────────
function DurationHero({ lang, onSearch }: { lang: Lang; onSearch: (type: RentalType) => void }) {
  const ar = lang === 'ar';
  const [type, setType]           = useState<RentalType>('daily');
  const [location, setLocation]   = useState('');
  const [destination, setDest]    = useState('');
  const [pickerTarget, setTarget] = useState<'main' | 'dest' | null>(null);

  // Daily
  const [days, setDays]           = useState(4);
  const pickupDate                = ar ? 'الثلاثاء، 6 يونيو' : 'Tue, Jun 6';

  // Monthly
  const [months, setMonths]       = useState(1);
  const startMonth                = ar ? 'يونيو 2025' : 'June 2025';

  // Airport
  const [airDir, setAirDir]       = useState<AirportDir>('from');
  const [terminal, setTerminal]   = useState('T2');
  const [flightNo, setFlightNo]   = useState('');

  const returnLabel = (() => {
    const d = new Date(2025, 5, 6);
    d.setDate(d.getDate() + days);
    return d.toLocaleDateString(ar ? 'ar-EG' : 'en-US', { weekday: 'short', day: 'numeric', month: 'short' });
  })();

  const handleTabPress = (id: RentalType) => {
    setType(id);
    if (id === 'monthly') {
      setTimeout(() => Alert.alert(
        ar ? '🎁 عروض خاصة للإيجار الشهري' : '🎁 Monthly Rental Special Offers',
        ar
          ? '• عروض خاصة على الإيجار الشهري\n• سائق مخصص طوال الشهر\n• رحلة مطار مجانية شهرياً\n• أولوية الحجز والدعم 24/7\n\nتواصل معنا للحصول على عرض مخصص.'
          : '• Special offers on monthly rentals\n• Dedicated driver all month long\n• 1 free airport transfer per month\n• Priority booking & 24/7 support\n\nContact us for a custom quote.',
        [{ text: ar ? 'رائع! 👍' : 'Sounds great! 👍' }]
      ), 120);
    }
  };

  const TABS = [
    { id: 'daily'   as RentalType, en: 'Daily',          ar: 'يومي',        ico: '📅' },
    { id: 'monthly' as RentalType, en: 'Monthly',         ar: 'شهري',        ico: '🗓️' },
    { id: 'airport' as RentalType, en: 'Airport',         ar: 'المطار',      ico: '✈️' },
  ];

  // Airport direction labels
  const airFromLabel = ar ? 'من المطار' : 'From Airport';
  const airToLabel   = ar ? 'إلى المطار' : 'To Airport';

  return (
    <LinearGradient colors={['#1A4D2E','#0A2015','#060E09']} start={{x:0,y:0}} end={{x:0.8,y:1}} style={s.hero}>
      {/* Title */}
      <Text style={[s.heroLabel, ar && s.rtl]}>{ar ? 'اختر نوع الحجز' : 'Choose Booking Type'}</Text>
      <Text style={[s.heroTitle, ar && s.rtl]}>{ar ? 'احجز سيارتك الآن' : 'Book Your Car'}</Text>

      {/* Tabs */}
      <View style={[s.tabsRow, ar && {flexDirection:'row-reverse'}]}>
        {TABS.map(tab => (
          <Pressable key={tab.id} onPress={() => handleTabPress(tab.id)}
            style={[s.typeTab, type===tab.id && s.typeTabActive]}>
            <Text style={s.typeTabIco}>{tab.ico}</Text>
            <Text style={[s.typeTabTxt, type===tab.id && s.typeTabTxtActive]}>{ar ? tab.ar : tab.en}</Text>
          </Pressable>
        ))}
      </View>

      {/* ── DAILY ── */}
      {type === 'daily' && <>
        <LocField
          value={location} ar={ar}
          placeholder={ar ? 'موقع الاستلام...' : 'Pickup location...'}
          onPress={() => setTarget('main')}
        />
        <View style={[s.datesRow, ar && {flexDirection:'row-reverse'}]}>
          <View style={s.dateBox}>
            <Text style={s.dateBoxLbl}>{ar ? '📅 الاستلام' : '📅 Pick-up'}</Text>
            <Text style={s.dateBoxVal}>{pickupDate}</Text>
          </View>
          <Text style={s.dateSep}>→</Text>
          <View style={s.dateBox}>
            <Text style={s.dateBoxLbl}>{ar ? '📅 الإعادة' : '📅 Return'}</Text>
            <Text style={s.dateBoxVal}>{returnLabel}</Text>
          </View>
        </View>
        <View style={[s.stepCard, ar && {flexDirection:'row-reverse'}]}>
          <View style={{flex:1}}>
            <Text style={s.stepCardTitle}>{ar ? 'عدد الأيام' : 'Number of Days'}</Text>
            <Text style={s.stepCardNote}>{ar ? '● الحد الأدنى 4 أيام' : '● Minimum 4 days'}</Text>
          </View>
          <View style={s.stepControls}>
            <Pressable onPress={() => setDays(d => Math.max(4, d-1))} style={[s.stepBtn, days<=4 && s.stepBtnOff]}>
              <Text style={[s.stepBtnTxt, days<=4 && {color:C.gray}]}>−</Text>
            </Pressable>
            <View style={s.stepVal}>
              <Text style={s.stepNum}>{days}</Text>
              <Text style={s.stepUnit}>{ar ? 'أيام' : 'days'}</Text>
            </View>
            <Pressable onPress={() => setDays(d => Math.min(30, d+1))} style={s.stepBtn}>
              <Text style={s.stepBtnTxt}>+</Text>
            </Pressable>
          </View>
        </View>
      </>}

      {/* ── MONTHLY ── */}
      {type === 'monthly' && <>
        <LocField
          value={location} ar={ar}
          placeholder={ar ? 'موقع الاستلام...' : 'Pickup location...'}
          onPress={() => setTarget('main')}
        />
        <View style={[s.datesRow, ar && {flexDirection:'row-reverse'}]}>
          <View style={s.dateBox}>
            <Text style={s.dateBoxLbl}>{ar ? '📅 تاريخ البداية' : '📅 Start Date'}</Text>
            <Text style={s.dateBoxVal}>{startMonth}</Text>
          </View>
          <Text style={s.dateSep}>·</Text>
          <View style={[s.dateBox,{borderColor:'rgba(201,162,39,0.3)'}]}>
            <Text style={s.dateBoxLbl}>{ar ? '💰 التقدير الشهري' : '💰 Monthly Est.'}</Text>
            <Text style={[s.dateBoxVal,{color:C.gold}]}>{ar ? `${(months*8500).toLocaleString()} ج.م` : `EGP ${(months*8500).toLocaleString()}`}</Text>
          </View>
        </View>
        <View style={[s.stepCard, ar && {flexDirection:'row-reverse'}]}>
          <View style={{flex:1}}>
            <Text style={s.stepCardTitle}>{ar ? 'عدد الأشهر' : 'Number of Months'}</Text>
            <Text style={s.stepCardNote}>{ar ? '🎁 عروض خاصة متاحة' : '🎁 Special offers available'}</Text>
          </View>
          <View style={s.stepControls}>
            <Pressable onPress={() => setMonths(m => Math.max(1, m-1))} style={[s.stepBtn, months<=1 && s.stepBtnOff]}>
              <Text style={[s.stepBtnTxt, months<=1 && {color:C.gray}]}>−</Text>
            </Pressable>
            <View style={s.stepVal}>
              <Text style={s.stepNum}>{months}</Text>
              <Text style={s.stepUnit}>{ar ? (months===1?'شهر':'أشهر') : (months===1?'mo':'mos')}</Text>
            </View>
            <Pressable onPress={() => setMonths(m => Math.min(12, m+1))} style={s.stepBtn}>
              <Text style={s.stepBtnTxt}>+</Text>
            </Pressable>
          </View>
        </View>
      </>}

      {/* ── AIRPORT ── */}
      {type === 'airport' && <>
        {/* Direction toggle */}
        <View style={[s.dirRow, ar && {flexDirection:'row-reverse'}]}>
          <Pressable onPress={() => setAirDir('from')} style={[s.dirBtn, airDir==='from' && s.dirBtnActive]}>
            <Text style={s.dirIco}>🛬</Text>
            <Text style={[s.dirTxt, airDir==='from' && s.dirTxtActive]}>{airFromLabel}</Text>
            <Text style={[s.dirSub, airDir==='from' && {color:'rgba(0,0,0,0.6)'}]}>
              {ar ? 'المطار ← وجهتك' : 'Airport → Your Dest.'}
            </Text>
          </Pressable>
          <Pressable onPress={() => setAirDir('to')} style={[s.dirBtn, airDir==='to' && s.dirBtnActive]}>
            <Text style={s.dirIco}>🛫</Text>
            <Text style={[s.dirTxt, airDir==='to' && s.dirTxtActive]}>{airToLabel}</Text>
            <Text style={[s.dirSub, airDir==='to' && {color:'rgba(0,0,0,0.6)'}]}>
              {ar ? 'موقعك → المطار' : 'Your Location → Airport'}
            </Text>
          </Pressable>
        </View>

        {/* Terminal selector */}
        <View>
          <Text style={[s.fieldLbl, ar && s.rtl]}>
            {airDir === 'from'
              ? (ar ? 'صالة الوصول' : 'Arrival Terminal')
              : (ar ? 'صالة المغادرة' : 'Departure Terminal')}
          </Text>
          <View style={[s.termRow, ar && {flexDirection:'row-reverse'}]}>
            {TERMINALS.map(term => (
              <Pressable key={term} onPress={() => setTerminal(term)}
                style={[s.termBtn, terminal===term && s.termBtnActive]}>
                <Text style={[s.termBtnTxt, terminal===term && {color:'#000'}]}>{term}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Flight number */}
        <Pressable
          onPress={() => {/* flight number input — could open a sheet */}}
          style={[lf.wrap, { backgroundColor: 'rgba(255,255,255,0.07)' }]}
        >
          <Text style={lf.icon}>✈️</Text>
          <Text style={[lf.txt, !flightNo && lf.ph]}>{flightNo || (ar ? 'رقم الرحلة (اختياري)' : 'Flight Number (optional)')}</Text>
        </Pressable>

        {/* Pickup/Dropoff location */}
        <LocField
          value={destination} ar={ar}
          placeholder={airDir==='from'
            ? (ar ? 'الوجهة بعد المطار...' : 'Your destination after airport...')
            : (ar ? 'موقع الاستلام...'     : 'Your pickup location...')}
          onPress={() => setTarget('dest')}
        />

        {/* Meet & Greet info */}
        <View style={s.meetGreet}>
          <Text style={s.meetGreetIco}>🤝</Text>
          <Text style={[s.meetGreetTxt, ar && s.rtl]}>
            {ar ? 'خدمة الاستقبال مشمولة في جميع رحلات المطار' : 'Meet & Greet service included on all airport rides'}
          </Text>
        </View>
      </>}

      {/* CTA */}
      <Pressable onPress={() => onSearch(type)} style={s.heroBtn}>
        <Text style={s.heroBtnTxt}>
          {type==='airport'
            ? (ar ? '✈️ احجز رحلة المطار' : '✈️ Book Airport Transfer')
            : (ar ? 'شاهد السيارات المتاحة' : 'See Available Cars')}
        </Text>
      </Pressable>

      {/* Location picker modal */}
      <LocationPicker
        visible={pickerTarget !== null}
        onClose={() => setTarget(null)}
        onSelect={loc => {
          if (pickerTarget === 'main') setLocation(loc);
          else setDest(loc);
        }}
        lang={lang}
        title={
          pickerTarget === 'dest' && type === 'airport'
            ? (airDir==='from' ? (ar?'الوجهة':'Your Destination') : (ar?'موقع الاستلام':'Pickup Location'))
            : undefined
        }
      />
    </LinearGradient>
  );
}

// ── Main Screen ────────────────────────────────────────────────────────────────
export default function HomeScreen({ lang, navigate, setBookData }: Props) {
  const ar = lang === 'ar';

  const handleSearch = (type: RentalType) => {
    setBookData({
      pickup: type === 'airport' ? 'Cairo International Airport' : 'Selected Location',
      dropoff: type === 'airport' ? 'Your Destination' : 'Destination',
    });
    navigate('booking');
  };

  return (
    <ScrollView style={st.scroll} contentContainerStyle={st.content} showsVerticalScrollIndicator={false}>
      {/* Top Bar */}
      <View style={[st.topBar, ar && st.rowRtl]}>
        <View>
          <Text style={[st.greeting, ar && st.rtl]}>{t(lang,'goodMorning')}</Text>
          <Text style={[st.name, ar && st.rtl]}>{ar ? 'أحمد الشربيني' : 'Ahmed El-Sherbiny'}</Text>
        </View>
        <View style={[st.topRight, ar && st.rowRtl]}>
          <Pressable onPress={() => navigate('toggleLang')} style={st.langBtn}>
            <Text style={st.langTxt}>{ar ? 'EN' : 'عر'}</Text>
          </Pressable>
          <Pressable onPress={() => navigate('notifications')} style={st.bellBtn}>
            <Text style={st.bellIco}>🔔</Text>
            <View style={st.bellBadge}/>
          </Pressable>
        </View>
      </View>

      {/* Active Booking Banner */}
      <LinearGradient colors={['#1A4D2E','#0A1F12']} start={{x:0,y:0}} end={{x:1,y:1}} style={st.banner}>
        <PulseDot color="#4CAF50"/>
        <View style={{flex:1}}>
          <Text style={[st.bannerTitle, ar && st.rtl]}>{t(lang,'driverOnWay')}</Text>
          <Text style={st.bannerSub}>Ahmed Hassan · ABC 1234 · Mercedes S-Class</Text>
        </View>
        <Pressable onPress={() => navigate('tracking')} style={st.trackBtn}>
          <Text style={st.trackBtnTxt}>{ar ? 'تتبع' : 'Track'}</Text>
        </Pressable>
      </LinearGradient>

      {/* Duration Hero */}
      <View style={st.heroWrap}>
        <DurationHero lang={lang} onSearch={handleSearch}/>
      </View>

      {/* Quick Rebook */}
      <View style={st.section}>
        <SectionHeader title={t(lang,'bookAgain')} link={t(lang,'seeAll')}/>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.hScroll}>
          {REBOOK.map((item,i) => (
            <View key={i} style={st.rebookCard}>
              <Text style={[st.rebookRoute, ar && st.rtl]}>{item.route}</Text>
              <Text style={st.rebookSub}>{item.car} · {item.date}</Text>
              <Pressable onPress={() => navigate('booking')} style={st.rebookBtn}>
                <Text style={st.rebookBtnTxt}>{t(lang,'reBook')}</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Saved Locations */}
      <View style={st.section}>
        <SectionHeader title={t(lang,'favorites')}/>
        <View style={st.favRow}>
          {(ar?[['🏠','المنزل'],['🏢','العمل'],['✈️','المطار']]:[['🏠','Home'],['🏢','Work'],['✈️','Airport']]).map(([ico,lbl],i)=>(
            <Pressable key={i} style={st.favChip}><Text>{ico}</Text><Text style={st.favTxt}>{lbl}</Text></Pressable>
          ))}
          <Pressable style={st.favAdd}><Text style={st.favAddTxt}>+ {t(lang,'addNew')}</Text></Pressable>
        </View>
      </View>

      {/* Current Offers */}
      <View style={[st.section,{marginBottom:8}]}>
        <SectionHeader title={t(lang,'currentOffers')} link={t(lang,'seeAll')} onLink={() => navigate('offersTab')}/>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.hScroll}>
          {HOME_OFFERS.map((o,i) => (
            <LinearGradient key={i} colors={o.dark?['#1A4D2E','#0D2818']:['#3A2800','#1A1000']} start={{x:0,y:0}} end={{x:1,y:1}} style={st.offerCard}>
              <Text style={st.offerTitle}>{o.title}</Text>
              <Text style={st.offerSub}>{o.sub}</Text>
              <View style={st.offerBottom}>
                <View style={st.offerBadge}><Text style={st.offerBadgeTxt}>{o.sub.split(' ').pop()}</Text></View>
                <Text style={st.offerExp}>{o.exp}</Text>
              </View>
            </LinearGradient>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  hero:          {borderRadius:20,padding:18,borderWidth:1,borderColor:'rgba(46,125,79,0.25)',gap:12},
  heroLabel:     {color:'rgba(255,255,255,0.45)',fontSize:11,fontWeight:'600',textTransform:'uppercase',letterSpacing:1.2},
  heroTitle:     {color:C.white,fontSize:22,fontWeight:'900'},
  rtl:           {textAlign:'right'},
  tabsRow:       {flexDirection:'row',gap:6},
  typeTab:       {flex:1,paddingVertical:9,borderRadius:10,alignItems:'center',backgroundColor:'rgba(0,0,0,0.25)',borderWidth:1,borderColor:'rgba(255,255,255,0.07)',gap:3},
  typeTabActive: {backgroundColor:C.gold,borderColor:C.gold},
  typeTabIco:    {fontSize:14},
  typeTabTxt:    {color:'rgba(255,255,255,0.5)',fontSize:11,fontWeight:'600',textAlign:'center'},
  typeTabTxtActive:{color:'#000',fontWeight:'700'},
  // Direction
  dirRow:        {flexDirection:'row',gap:8},
  dirBtn:        {flex:1,backgroundColor:'rgba(0,0,0,0.25)',borderRadius:12,padding:12,borderWidth:1.5,borderColor:'rgba(255,255,255,0.1)',alignItems:'center',gap:3},
  dirBtnActive:  {backgroundColor:C.gold,borderColor:C.gold},
  dirIco:        {fontSize:20},
  dirTxt:        {color:'rgba(255,255,255,0.8)',fontSize:12,fontWeight:'700',textAlign:'center'},
  dirTxtActive:  {color:'#000'},
  dirSub:        {color:'rgba(255,255,255,0.4)',fontSize:9,textAlign:'center'},
  // Field label
  fieldLbl:      {color:'rgba(255,255,255,0.5)',fontSize:11,fontWeight:'600',marginBottom:6},
  // Dates
  datesRow:      {flexDirection:'row',alignItems:'center',gap:8},
  dateBox:       {flex:1,backgroundColor:'rgba(0,0,0,0.25)',borderRadius:12,padding:12,borderWidth:1,borderColor:'rgba(255,255,255,0.08)'},
  dateBoxLbl:    {color:'rgba(255,255,255,0.45)',fontSize:10,fontWeight:'600',marginBottom:4},
  dateBoxVal:    {color:C.white,fontSize:13,fontWeight:'700'},
  dateSep:       {color:C.gold,fontSize:16},
  // Stepper
  stepCard:      {flexDirection:'row',alignItems:'center',justifyContent:'space-between',backgroundColor:'rgba(0,0,0,0.2)',borderRadius:14,padding:14,borderWidth:1,borderColor:'rgba(255,255,255,0.07)'},
  stepCardTitle: {color:C.white,fontSize:14,fontWeight:'700'},
  stepCardNote:  {color:C.gray,fontSize:11,marginTop:3},
  stepControls:  {flexDirection:'row',alignItems:'center',gap:12},
  stepBtn:       {width:34,height:34,borderRadius:17,backgroundColor:C.gold,alignItems:'center',justifyContent:'center'},
  stepBtnOff:    {backgroundColor:C.surface3,borderWidth:1,borderColor:'rgba(255,255,255,0.1)'},
  stepBtnTxt:    {color:'#000',fontSize:18,fontWeight:'900',lineHeight:22},
  stepVal:       {alignItems:'center',minWidth:42},
  stepNum:       {color:C.white,fontSize:22,fontWeight:'900'},
  stepUnit:      {color:C.gold,fontSize:11,fontWeight:'600'},
  // Terminal
  termRow:       {flexDirection:'row',gap:8},
  termBtn:       {flex:1,height:44,borderRadius:10,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,0.25)',borderWidth:1,borderColor:'rgba(255,255,255,0.1)'},
  termBtnActive: {backgroundColor:C.gold,borderColor:C.gold},
  termBtnTxt:    {color:C.gray,fontSize:14,fontWeight:'700'},
  // Meet greet
  meetGreet:     {flexDirection:'row',alignItems:'center',gap:8,backgroundColor:'rgba(56,142,60,0.15)',borderRadius:10,padding:10,borderWidth:1,borderColor:'rgba(56,142,60,0.3)'},
  meetGreetIco:  {fontSize:16},
  meetGreetTxt:  {flex:1,color:'#81C784',fontSize:12,fontWeight:'500'},
  // CTA
  heroBtn:       {backgroundColor:C.gold,borderRadius:14,height:54,alignItems:'center',justifyContent:'center'},
  heroBtnTxt:    {color:'#000',fontSize:16,fontWeight:'800',letterSpacing:0.3},
});

const st = StyleSheet.create({
  scroll:        {flex:1,backgroundColor:C.bg},
  content:       {paddingBottom:24},
  topBar:        {padding:16,paddingBottom:10,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  rowRtl:        {flexDirection:'row-reverse'},
  greeting:      {color:C.gray,fontSize:13},
  name:          {color:C.white,fontSize:18,fontWeight:'800',marginTop:2},
  rtl:           {textAlign:'right'},
  topRight:      {flexDirection:'row',gap:10,alignItems:'center'},
  langBtn:       {backgroundColor:C.surface2,borderRadius:8,paddingHorizontal:10,paddingVertical:5,borderWidth:1,borderColor:'rgba(201,162,39,0.3)'},
  langTxt:       {color:C.gold,fontSize:12,fontWeight:'700'},
  bellBtn:       {backgroundColor:C.surface2,borderRadius:12,width:40,height:40,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'rgba(255,255,255,0.07)'},
  bellIco:       {fontSize:17},
  bellBadge:     {position:'absolute',top:8,right:8,width:8,height:8,borderRadius:4,backgroundColor:'#EF5350',borderWidth:1.5,borderColor:C.bg},
  banner:        {marginHorizontal:16,marginBottom:14,borderRadius:14,padding:12,flexDirection:'row',alignItems:'center',gap:12,borderWidth:1,borderColor:'rgba(76,175,80,0.25)'},
  bannerTitle:   {color:C.white,fontSize:14,fontWeight:'700'},
  bannerSub:     {color:C.gray,fontSize:12,marginTop:2},
  trackBtn:      {backgroundColor:C.gold,borderRadius:8,paddingHorizontal:12,paddingVertical:6},
  trackBtnTxt:   {color:'#000',fontSize:12,fontWeight:'800'},
  heroWrap:      {marginHorizontal:16,marginBottom:20},
  section:       {paddingHorizontal:16,marginBottom:20},
  hScroll:       {gap:12,paddingRight:16},
  rebookCard:    {backgroundColor:C.surface,borderRadius:14,padding:14,borderWidth:1,borderColor:'rgba(255,255,255,0.07)',minWidth:188},
  rebookRoute:   {color:C.white,fontSize:13,fontWeight:'700',marginBottom:4},
  rebookSub:     {color:C.gray,fontSize:11,marginBottom:12},
  rebookBtn:     {backgroundColor:'rgba(201,162,39,0.1)',borderWidth:1,borderColor:'rgba(201,162,39,0.3)',borderRadius:8,height:34,alignItems:'center',justifyContent:'center'},
  rebookBtnTxt:  {color:C.gold,fontSize:12,fontWeight:'700'},
  favRow:        {flexDirection:'row',flexWrap:'wrap',gap:8},
  favChip:       {backgroundColor:C.surface,borderRadius:10,paddingHorizontal:14,paddingVertical:8,flexDirection:'row',alignItems:'center',gap:6,borderWidth:1,borderColor:'rgba(255,255,255,0.07)'},
  favTxt:        {color:C.white,fontSize:13,fontWeight:'600'},
  favAdd:        {borderRadius:10,paddingHorizontal:14,paddingVertical:8,borderWidth:1,borderColor:'rgba(201,162,39,0.4)',borderStyle:'dashed'},
  favAddTxt:     {color:C.gold,fontSize:13},
  offerCard:     {minWidth:200,borderRadius:14,padding:16,borderWidth:1,borderColor:'rgba(255,255,255,0.05)',gap:4},
  offerTitle:    {color:C.white,fontSize:14,fontWeight:'700'},
  offerSub:      {color:C.gray,fontSize:12},
  offerBottom:   {flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:8},
  offerBadge:    {backgroundColor:'rgba(201,162,39,0.15)',borderRadius:6,paddingHorizontal:8,paddingVertical:3},
  offerBadgeTxt: {color:C.gold,fontSize:11,fontWeight:'700'},
  offerExp:      {color:C.gray,fontSize:11},
});
