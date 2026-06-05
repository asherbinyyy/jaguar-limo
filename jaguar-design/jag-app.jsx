// JAGUAR LIMOUSINE — App Navigator + Root

function AppNavigator() {
  const [phase, setPhase] = React.useState('splash');
  const [lang, setLang]   = React.useState('en');
  const [phone, setPhone] = React.useState('');
  const [tab, setTab]     = React.useState('home');
  const [screen, setScreen] = React.useState(null); // 'booking'|'notifications'|'tracking'|'loyalty'
  const [bookStep, setBookStep] = React.useState(1);
  const [bookData, setBookData] = React.useState({ pickup:'', dropoff:'' });
  const [selectedCar, setSelectedCar] = React.useState(null);
  const [prevScreen, setPrev] = React.useState(null);

  const go = (s) => { setPrev(screen); setScreen(s); };

  const navigate = (dest) => {
    if (dest === 'toggleLang')   { setLang(l => l==='en'?'ar':'en'); return; }
    if (dest === 'notifications') { go('notifications'); return; }
    if (dest === 'tracking')     { go('tracking'); return; }
    if (dest === 'loyalty')      { go('loyalty'); return; }
    if (dest === 'booking')      { setBookStep(1); go('booking'); return; }
    if (dest === 'offersTab')    { setTab('offers'); return; }
    if (dest === 'back')         { setScreen(prevScreen); return; }
  };

  // ── PRE-APP PHASES ──
  if (phase==='splash') return <SplashScreen onNext={()=>setPhase('onboarding')}/>;
  if (phase==='onboarding') return <OnboardingScreen onNext={()=>setPhase('language')} lang={lang}/>;
  if (phase==='language') return <LanguageScreen onSelect={(l)=>{ setLang(l); setPhase('auth'); }}/>;
  if (phase==='auth') return <AuthGateScreen onPhone={()=>setPhase('phone')} onGuest={()=>setPhase('app')} lang={lang}/>;
  if (phase==='phone') return <PhoneScreen onSend={(p)=>{ setPhone(p); setPhase('otp'); }} onBack={()=>setPhase('auth')} lang={lang}/>;
  if (phase==='otp') return <OTPScreen phone={phone} onVerify={()=>setPhase('app')} onBack={()=>setPhase('phone')} lang={lang}/>;

  // ── FULL-SCREEN OVERLAYS ──
  if (screen==='notifications') return <NotificationsScreen onBack={()=>setScreen(null)} lang={lang}/>;
  if (screen==='tracking')      return <TrackingScreen onBack={()=>setScreen(null)} lang={lang}/>;
  if (screen==='loyalty')       return <LoyaltyScreen onBack={()=>setScreen(null)} lang={lang}/>;

  // ── BOOKING FLOW ──
  if (screen==='booking') {
    const ar = lang==='ar';
    const bookingHeader = (
      <div style={{ padding:'14px 20px 8px', background:JAG.bg, borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
          <button onClick={()=>{ bookStep>1 ? setBookStep(s=>s-1) : setScreen(null); }}
            style={{ background:'none', border:'none', color:JAG.gold, fontSize:22, cursor:'pointer', lineHeight:1 }}>
            {lang==='ar'?'→':'←'}
          </button>
          <span style={{ color:JAG.white, fontSize:17, fontWeight:700, fontFamily:lang==='ar'?FAR:F }}>
            {[ar?'تفاصيل الرحلة':'Ride Details', ar?'اختر سيارتك':'Choose Your Car', ar?'تأكيد الحجز':'Confirm Booking', ar?'تم الحجز!':'Booking Done!'][bookStep-1]}
          </span>
        </div>
        {bookStep < 4 && <BookingProgress step={bookStep} lang={lang}/>}
      </div>
    );
    return (
      <div style={{ width:'100%', height:'100%', background:JAG.bg, display:'flex', flexDirection:'column' }}>
        {bookStep < 4 && bookingHeader}
        <div style={{ flex:1, overflow:'hidden' }}>
          {bookStep===1 && <BookingStep1 data={bookData} onNext={d=>{ setBookData(d); setBookStep(2); }} lang={lang}/>}
          {bookStep===2 && <BookingStep2 onNext={car=>{ setSelectedCar(car); setBookStep(3); }} lang={lang}/>}
          {bookStep===3 && <BookingStep3 bookData={bookData} car={selectedCar||{name:'Mercedes S-Class',cat:'luxury',label:'Luxury',price:850,icon:'🚙'}} onConfirm={()=>setBookStep(4)} lang={lang}/>}
          {bookStep===4 && <BookingStep4 onHome={()=>{ setScreen(null); setTab('home'); }} lang={lang}/>}
        </div>
      </div>
    );
  }

  // ── MAIN APP WITH TABS ──
  return (
    <div style={{ width:'100%', height:'100%', background:JAG.bg, position:'relative' }}>
      <div style={{ position:'absolute', inset:0, bottom:72, overflow:'hidden' }}>
        {tab==='home'     && <HomeScreen lang={lang} navigate={navigate} setBookData={setBookData}/>}
        {tab==='fleet'    && <FleetScreen navigate={navigate} lang={lang}/>}
        {tab==='bookings' && <MyBookingsScreen navigate={navigate} lang={lang}/>}
        {tab==='offers'   && <OffersScreen lang={lang}/>}
        {tab==='profile'  && <ProfileScreen navigate={navigate} lang={lang}/>}
      </div>
      <TabBar tab={tab} setTab={setTab} lang={lang}/>
    </div>
  );
}

function JaguarApp() {
  return (
    <div style={{
      width:'100vw', height:'100vh',
      background:'radial-gradient(ellipse at 40% 20%, #0D2818 0%, #050505 65%)',
      display:'flex', alignItems:'center', justifyContent:'center',
      overflow:'hidden',
    }}>
      <style dangerouslySetInnerHTML={{ __html: jagCSS }}/>
      <PhoneFrame>
        <AppNavigator/>
      </PhoneFrame>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<JaguarApp/>);
