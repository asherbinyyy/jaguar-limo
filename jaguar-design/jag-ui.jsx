// JAGUAR LIMOUSINE — Design System & Core Components

const JAG = {
  bg: '#0D0D0D', surface: '#1A1A1A', surface2: '#232323', surface3: '#2A2A2A',
  green: '#1A4D2E', greenLight: '#2E7D4F',
  gold: '#C9A227', goldLight: '#F0D080',
  white: '#FFFFFF', gray: '#8A8A8A', grayDark: '#333',
  error: '#D32F2F', success: '#388E3C',
};
const F = '-apple-system, BlinkMacSystemFont, "SF Pro Display", Helvetica, sans-serif';
const FAR = '"SF Arabic", "Geeza Pro", -apple-system, sans-serif';

const TRANS = {
  en: {
    goodMorning:'Good morning', goldMember:'Gold Member',
    whereGoing:"Where are you going?", seeAvailable:'See Available Cars',
    pickupPh:'Enter pickup location', dropoffPh:'Enter drop-off location',
    bookAgain:'Book Again', seeAll:'See All', favorites:'Favorites',
    currentOffers:'Current Offers', viewRewards:'View Rewards',
    home:'Home', fleet:'Fleet', bookings:'Bookings', offers:'Offers', profile:'Profile',
    next:'Next', skip:'Skip', getStarted:'Get Started', continue:'Continue',
    sendCode:'Send Code', verify:'Verify', confirmBooking:'Confirm Booking',
    chooseYourCar:'Choose Your Car', rideDetails:'Ride Details',
    bookingConfirmed:'Booking Confirmed!', backToHome:'Back to Home',
    trackBooking:'Track Booking',
  },
  ar: {
    goodMorning:'صباح الخير', goldMember:'عضو ذهبي',
    whereGoing:'إلى أين تريد الذهاب؟', seeAvailable:'شاهد السيارات',
    pickupPh:'موقع الانطلاق', dropoffPh:'الوجهة',
    bookAgain:'أعد الحجز', seeAll:'عرض الكل', favorites:'المفضلة',
    currentOffers:'العروض الحالية', viewRewards:'مكافآتي',
    home:'الرئيسية', fleet:'أسطولنا', bookings:'حجوزاتي', offers:'العروض', profile:'حسابي',
    next:'التالي', skip:'تخطي', getStarted:'ابدأ الآن', continue:'متابعة',
    sendCode:'إرسال الرمز', verify:'تحقق', confirmBooking:'تأكيد الحجز',
    chooseYourCar:'اختر سيارتك', rideDetails:'تفاصيل الرحلة',
    bookingConfirmed:'تم الحجز بنجاح!', backToHome:'العودة للرئيسية',
    trackBooking:'تتبع الحجز',
  }
};
function tx(lang, key) { return (TRANS[lang]||TRANS.en)[key] || key; }

// ——— BUTTONS ———
function GoldBtn({ children, onClick, disabled, sm, style }) {
  const [p, setP] = React.useState(false);
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseDown={()=>setP(true)} onMouseUp={()=>setP(false)} onMouseLeave={()=>setP(false)}
      style={{
        background: disabled ? '#3D3010' : p ? '#A8871F' : JAG.gold,
        color: disabled ? '#666' : '#000',
        border:'none', borderRadius:12, height:sm?42:52, width:'100%',
        fontSize:sm?14:16, fontWeight:700, letterSpacing:0.2,
        cursor:disabled?'not-allowed':'pointer', fontFamily:F,
        transition:'all 0.12s', transform:p?'scale(0.985)':'scale(1)', ...style
      }}>
      {children}
    </button>
  );
}

function GreenBtn({ children, onClick, sm, style }) {
  const [p, setP] = React.useState(false);
  return (
    <button onClick={onClick}
      onMouseDown={()=>setP(true)} onMouseUp={()=>setP(false)} onMouseLeave={()=>setP(false)}
      style={{
        background: p ? '#153D24' : JAG.green, color: JAG.white,
        border:'none', borderRadius:12, height:sm?42:52, width:'100%',
        fontSize:sm?14:16, fontWeight:600,
        cursor:'pointer', fontFamily:F, transition:'all 0.12s',
        transform:p?'scale(0.985)':'scale(1)', ...style
      }}>
      {children}
    </button>
  );
}

function OutlineBtn({ children, onClick, sm, style, col }) {
  const c = col || JAG.gold;
  return (
    <button onClick={onClick}
      style={{
        background:'transparent', color:c, border:`1.5px solid ${c}`,
        borderRadius:12, height:sm?42:52, width:'100%',
        fontSize:sm?14:16, fontWeight:600,
        cursor:'pointer', fontFamily:F, transition:'all 0.12s', ...style
      }}>
      {children}
    </button>
  );
}

// ——— CARD ———
function Card({ children, style, onClick, gold }) {
  return (
    <div onClick={onClick} style={{
      background:JAG.surface, borderRadius:16, padding:16,
      border: gold ? `1.5px solid ${JAG.gold}` : '1px solid rgba(255,255,255,0.07)',
      boxShadow:'0 4px 20px rgba(0,0,0,0.3)',
      cursor:onClick?'pointer':'default', ...style
    }}>
      {children}
    </div>
  );
}

// ——— INPUT ———
function Inp({ ph, val, onChange, icon, type='text', style }) {
  const [f, setF] = React.useState(false);
  return (
    <div style={{ position:'relative' }}>
      {icon && <span style={{
        position:'absolute', left:14, top:'50%', transform:'translateY(-50%)',
        color:f?JAG.gold:JAG.gray, fontSize:15, pointerEvents:'none', zIndex:1
      }}>{icon}</span>}
      <input type={type} placeholder={ph} value={val} onChange={onChange}
        onFocus={()=>setF(true)} onBlur={()=>setF(false)}
        style={{
          width:'100%', height:52, background:JAG.surface2,
          border:`1.5px solid ${f?JAG.gold:'rgba(255,255,255,0.08)'}`,
          borderRadius:12, color:JAG.white, fontSize:15, fontFamily:F,
          outline:'none', padding:`0 16px 0 ${icon?'44px':'16px'}`,
          boxSizing:'border-box', transition:'border-color 0.2s', ...style
        }}
      />
    </div>
  );
}

// ——— CHIP ———
function Chip({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: active ? JAG.gold : 'transparent',
      color: active ? '#000' : JAG.gold,
      border:`1px solid ${active ? JAG.gold : 'rgba(201,162,39,0.35)'}`,
      borderRadius:8, padding:'7px 14px', fontSize:13, fontWeight:600,
      cursor:'pointer', whiteSpace:'nowrap', fontFamily:F,
      transition:'all 0.15s', flexShrink:0
    }}>{label}</button>
  );
}

// ——— BADGE ———
function Badge({ label, type }) {
  const map = {
    confirmed:['rgba(56,142,60,0.2)','#66BB6A'],
    active:['rgba(56,142,60,0.25)','#4CAF50'],
    cancelled:['rgba(211,47,47,0.2)','#EF5350'],
    pending:['rgba(201,162,39,0.2)',JAG.gold],
    luxury:['rgba(201,162,39,0.15)',JAG.gold],
    suv:['rgba(46,125,79,0.18)','#66BB6A'],
    economy:['rgba(138,138,138,0.2)','#9E9E9E'],
  };
  const [bg, color] = map[type] || ['rgba(138,138,138,0.2)','#9E9E9E'];
  return (
    <span style={{ background:bg, color, borderRadius:6, padding:'3px 9px', fontSize:11, fontWeight:700, fontFamily:F }}>
      {label}
    </span>
  );
}

// ——— SECTION HEADER ———
function SHdr({ title, link, onLink }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
      <span style={{ color:JAG.white, fontSize:17, fontWeight:700, fontFamily:F }}>{title}</span>
      {link && <button onClick={onLink} style={{ background:'none', border:'none', color:JAG.gold, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:F }}>{link}</button>}
    </div>
  );
}

// ——— STARS ———
function Stars({ n=5, size=14 }) {
  return <span style={{ color:JAG.gold, fontSize:size, letterSpacing:1 }}>{'★'.repeat(n)}{'☆'.repeat(5-n)}</span>;
}

// ——— PULSE DOT ———
function Pulse({ color='#4CAF50', size=8 }) {
  return <span style={{ display:'inline-block', width:size, height:size, borderRadius:'50%', background:color, flexShrink:0, animation:'jagPulse 1.5s ease-in-out infinite' }} />;
}

// ——— DIVIDER ———
function Divider({ my=12 }) {
  return <div style={{ height:1, background:'rgba(255,255,255,0.06)', margin:`${my}px 0` }} />;
}

// ——— BOTTOM TAB BAR ———
function TabBar({ tab, setTab, lang }) {
  const ar = lang === 'ar';
  const tabs = [
    { id:'home', en:'Home', ar:'الرئيسية',
      icon:<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg> },
    { id:'fleet', en:'Fleet', ar:'أسطولنا',
      icon:<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg> },
    { id:'bookings', en:'Bookings', ar:'حجوزاتي',
      icon:<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg> },
    { id:'offers', en:'Offers', ar:'العروض',
      icon:<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/></svg> },
    { id:'profile', en:'Profile', ar:'حسابي',
      icon:<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg> },
  ];
  const display = ar ? [...tabs].reverse() : tabs;
  return (
    <div style={{ position:'absolute', bottom:0, left:0, right:0, height:72, background:'#1A1A1A', borderTop:'1px solid rgba(255,255,255,0.07)', display:'flex', zIndex:100 }}>
      {display.map(item => (
        <button key={item.id} onClick={()=>setTab(item.id)} style={{
          flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
          gap:3, background:'none', border:'none', color:tab===item.id?JAG.gold:JAG.gray,
          cursor:'pointer', paddingBottom:8, fontFamily:ar?FAR:F, transition:'color 0.2s',
        }}>
          {item.icon}
          <span style={{ fontSize:10, fontWeight:600 }}>{ar?item.ar:item.en}</span>
        </button>
      ))}
    </div>
  );
}

// ——— PHONE FRAME ———
function PhoneFrame({ children }) {
  return (
    <div style={{
      width:393, height:852, background:'#1C1C1E', borderRadius:54,
      border:'10px solid #2E2E30', overflow:'hidden', position:'relative', flexShrink:0,
      boxShadow:'0 50px 130px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.06)',
    }}>
      {/* Dynamic Island */}
      <div style={{ position:'absolute', top:12, left:'50%', transform:'translateX(-50%)', width:120, height:34, background:'#000', borderRadius:20, zIndex:999 }} />
      {/* Status bar */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:54, display:'flex', alignItems:'flex-end', justifyContent:'space-between', padding:'0 26px 8px', zIndex:998, pointerEvents:'none' }}>
        <span style={{ color:'rgba(255,255,255,0.9)', fontSize:15, fontWeight:600, fontFamily:F }}>9:41</span>
        <div style={{ display:'flex', gap:5, alignItems:'center', color:'rgba(255,255,255,0.9)' }}>
          <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
            <rect x="0" y="4" width="3" height="7" rx="0.5" opacity="0.4"/><rect x="4.5" y="2.5" width="3" height="8.5" rx="0.5" opacity="0.6"/><rect x="9" y="1" width="3" height="10" rx="0.5" opacity="0.8"/><rect x="13.5" y="0" width="3" height="11" rx="0.5"/>
          </svg>
          <svg width="15" height="12" viewBox="0 0 15 12" fill="currentColor">
            <path d="M7.5 2C10 2 12.2 3 13.7 4.8L15 3.5C13.1 1.3 10.4 0 7.5 0S1.9 1.3 0 3.5L1.3 4.8C2.8 3 5 2 7.5 2z" opacity="0.4"/>
            <path d="M7.5 5C9.2 5 10.8 5.7 11.9 6.9L13.2 5.6C11.7 4 9.7 3 7.5 3S3.3 4 1.8 5.6L3.1 6.9C4.2 5.7 5.8 5 7.5 5z" opacity="0.7"/>
            <path d="M7.5 8c1 0 1.9.4 2.5 1L7.5 12 5 9c.6-.6 1.5-1 2.5-1z"/>
          </svg>
          <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
            <rect x="0.5" y="0.5" width="22" height="12" rx="3.5" stroke="white" strokeWidth="1" opacity="0.4"/>
            <rect x="2" y="2" width="18" height="9" rx="2" fill="white" opacity="0.9"/>
            <path d="M24 4.5v4a2 2 0 000-4z" fill="white" opacity="0.4"/>
          </svg>
        </div>
      </div>
      {/* Screen */}
      <div style={{ position:'absolute', top:54, left:0, right:0, bottom:34, overflow:'hidden' }}>
        {children}
      </div>
      {/* Home indicator */}
      <div style={{ position:'absolute', bottom:10, left:'50%', transform:'translateX(-50%)', width:134, height:5, background:'rgba(255,255,255,0.22)', borderRadius:3 }} />
    </div>
  );
}

const jagCSS = `
  @keyframes jagPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.7)} }
  @keyframes jagShimmer { 0%{background-position:-300% center} 100%{background-position:300% center} }
  @keyframes jagFadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes jagScaleIn { from{opacity:0;transform:scale(0.85)} to{opacity:1;transform:scale(1)} }
  @keyframes jagDraw { from{stroke-dashoffset:300} to{stroke-dashoffset:0} }
  input::placeholder{color:#555} input{caret-color:#C9A227}
  ::-webkit-scrollbar{display:none} *{-webkit-tap-highlight-color:transparent;box-sizing:border-box}
`;

Object.assign(window, { JAG, F, FAR, TRANS, tx, GoldBtn, GreenBtn, OutlineBtn, Card, Inp, Chip, Badge, SHdr, Stars, Pulse, Divider, TabBar, PhoneFrame, jagCSS });
