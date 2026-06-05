// JAGUAR LIMOUSINE — Auth & Onboarding Screens

function SplashScreen({ onNext }) {
  const [v, setV] = React.useState(false);
  React.useEffect(() => {
    const t1 = setTimeout(() => setV(true), 150);
    const t2 = setTimeout(() => onNext(), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  return (
    <div style={{ width:'100%', height:'100%', background:'#0D0D0D', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:24 }}>
      <div style={{ opacity:v?1:0, transform:v?'scale(1) translateY(0)':'scale(0.8) translateY(30px)', transition:'all 1s cubic-bezier(0.16,1,0.3,1)' }}>
        <img src="uploads/jaguar logo.jpg" style={{ width:180, height:180, objectFit:'contain', borderRadius:16 }} />
      </div>
      <div style={{ opacity:v?1:0, transform:v?'translateY(0)':'translateY(16px)', transition:'all 0.9s cubic-bezier(0.16,1,0.3,1) 0.4s', textAlign:'center' }}>
        <div style={{
          fontSize:11, letterSpacing:5, fontWeight:700, textTransform:'uppercase', fontFamily:F,
          background:`linear-gradient(90deg, ${JAG.gold}, ${JAG.goldLight}, ${JAG.gold})`,
          backgroundSize:'300% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          animation:'jagShimmer 3s linear infinite',
        }}>YOUR PREMIUM RIDE PARTNER</div>
      </div>
    </div>
  );
}

const SLIDES = [
  {
    bg:'linear-gradient(160deg,#1A4D2E 0%,#061610 100%)',
    title:'Book in Minutes', titleAr:'احجز في دقائق',
    body:'Choose your car, pick your time, and we handle the rest.',
    bodyAr:'اختر سيارتك، حدد وقتك، ونحن نتولى الباقي.',
    art: (
      <svg viewBox="0 0 200 140" width="200" height="140">
        <ellipse cx="100" cy="110" rx="80" ry="18" fill="rgba(201,162,39,0.06)"/>
        <rect x="30" y="70" width="140" height="36" rx="10" fill="rgba(46,125,79,0.5)"/>
        <ellipse cx="62" cy="66" rx="28" ry="16" fill="rgba(46,125,79,0.4)"/>
        <ellipse cx="130" cy="68" rx="22" ry="14" fill="rgba(46,125,79,0.3)"/>
        <circle cx="58" cy="107" r="13" fill="#111" stroke="#C9A227" strokeWidth="2.5"/>
        <circle cx="58" cy="107" r="5" fill="rgba(201,162,39,0.3)"/>
        <circle cx="140" cy="107" r="13" fill="#111" stroke="#C9A227" strokeWidth="2.5"/>
        <circle cx="140" cy="107" r="5" fill="rgba(201,162,39,0.3)"/>
        <rect x="20" y="78" width="18" height="10" rx="3" fill="#C9A227" opacity="0.9"/>
        <rect x="162" y="78" width="18" height="10" rx="3" fill="#C9A227" opacity="0.4"/>
        <circle cx="100" cy="40" r="22" fill="none" stroke="rgba(201,162,39,0.15)" strokeWidth="1.5"/>
        <circle cx="100" cy="40" r="14" fill="none" stroke="rgba(201,162,39,0.25)" strokeWidth="1.5"/>
        <text x="100" y="46" textAnchor="middle" fontSize="14" fill={JAG.gold}>★</text>
      </svg>
    ),
  },
  {
    bg:'linear-gradient(160deg,#0D2030 0%,#060C10 100%)',
    title:'Airport Transfers', titleAr:'خدمة المطار',
    body:'Meet & greet service at all Cairo Airport terminals.',
    bodyAr:'خدمة الاستقبال في جميع صالات مطار القاهرة.',
    art: (
      <svg viewBox="0 0 200 140" width="200" height="140">
        <rect x="20" y="90" width="160" height="30" rx="4" fill="rgba(46,125,79,0.3)"/>
        <rect x="35" y="76" width="130" height="16" rx="3" fill="rgba(46,125,79,0.25)"/>
        {[45,70,95,120,145].map((x,i)=> <rect key={i} x={x} y="78" width="10" height="12" rx="1.5" fill="rgba(201,162,39,0.35)"/>)}
        <g transform="translate(100,45) rotate(-20)">
          <rect x="-36" y="-7" width="72" height="14" rx="7" fill="rgba(46,125,79,0.7)"/>
          <polygon points="-12,-16 12,-16 10,0 -10,0" fill="rgba(46,125,79,0.5)"/>
          <polygon points="-10,4 10,4 7,18 -7,18" fill="rgba(46,125,79,0.4)"/>
          <circle cx="0" cy="0" r="4" fill={JAG.gold} opacity="0.9"/>
        </g>
        <circle cx="100" cy="88" r="6" fill={JAG.gold}/>
        <line x1="100" y1="94" x2="100" y2="102" stroke={JAG.gold} strokeWidth="2"/>
        <path d="M96,102 Q100,108 104,102" fill={JAG.gold}/>
      </svg>
    ),
  },
  {
    bg:'linear-gradient(160deg,#2A1E00 0%,#0D0A00 100%)',
    title:'Earn & Ride Free', titleAr:'اكسب نقاطاً واركب مجاناً',
    body:'Join Jaguar Rewards and unlock exclusive perks.',
    bodyAr:'انضم لمكافآت جاغوار واكتشف المزايا الحصرية.',
    art: (
      <svg viewBox="0 0 200 140" width="200" height="140">
        {[[20,20,0.15],[175,30,0.2],[15,110,0.18],[180,100,0.22],[60,130,0.12]].map(([x,y,o],i)=>(
          <text key={i} x={x} y={y} fontSize="13" fill={JAG.gold} opacity={o} textAnchor="middle">★</text>
        ))}
        <polygon points="100,20 112,52 148,52 120,72 130,105 100,85 70,105 80,72 52,52 88,52" fill={JAG.gold} opacity="0.65"/>
        <polygon points="100,32 109,56 134,56 115,70 122,95 100,80 78,95 85,70 66,56 91,56" fill="rgba(201,162,39,0.25)"/>
        <circle cx="100" cy="67" r="12" fill={JAG.gold} opacity="0.85"/>
        <text x="100" y="72" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#000" fontFamily={F}>★</text>
      </svg>
    ),
  },
];

function OnboardingScreen({ onNext, lang }) {
  const [slide, setSlide] = React.useState(0);
  const ar = lang === 'ar';
  const s = SLIDES[slide];
  return (
    <div style={{ width:'100%', height:'100%', background:s.bg, display:'flex', flexDirection:'column', transition:'background 0.5s ease', overflow:'hidden' }}>
      <div style={{ display:'flex', justifyContent: ar?'flex-start':'flex-end', padding:'12px 20px 0' }}>
        <button onClick={onNext} style={{ background:'none', border:'none', color:JAG.gray, fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:ar?FAR:F }}>
          {ar?'تخطي':'Skip'}
        </button>
      </div>
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ animation:'jagScaleIn 0.5s ease' }}>{s.art}</div>
      </div>
      <div style={{ padding:'0 28px 32px' }}>
        <h2 style={{ color:JAG.white, fontSize:26, fontWeight:800, fontFamily:ar?FAR:F, textAlign:'center', marginBottom:10, lineHeight:1.2, direction:ar?'rtl':'ltr' }}>
          {ar?s.titleAr:s.title}
        </h2>
        <p style={{ color:JAG.gray, fontSize:14, textAlign:'center', fontFamily:ar?FAR:F, lineHeight:1.6, marginBottom:28, direction:ar?'rtl':'ltr' }}>
          {ar?s.bodyAr:s.body}
        </p>
        <div style={{ display:'flex', justifyContent:'center', gap:8, marginBottom:24 }}>
          {SLIDES.map((_,i)=>(
            <div key={i} onClick={()=>setSlide(i)} style={{
              width:i===slide?28:8, height:8, borderRadius:4,
              background:i===slide?JAG.gold:'rgba(255,255,255,0.18)',
              cursor:'pointer', transition:'all 0.3s ease',
            }}/>
          ))}
        </div>
        <GoldBtn onClick={()=> slide<2 ? setSlide(s=>s+1) : onNext()}>
          {slide < 2 ? (ar?'التالي':'Next') : (ar?'ابدأ الآن':'Get Started')}
        </GoldBtn>
      </div>
    </div>
  );
}

function LanguageScreen({ onSelect }) {
  const [sel, setSel] = React.useState('en');
  return (
    <div style={{ width:'100%', height:'100%', background:JAG.bg, display:'flex', flexDirection:'column', padding:'32px 24px 32px', overflowY:'auto' }}>
      <img src="uploads/jaguar logo.jpg" style={{ width:80, height:80, objectFit:'contain', alignSelf:'center', marginBottom:28, borderRadius:10 }}/>
      <h1 style={{ color:JAG.white, fontSize:24, fontWeight:800, fontFamily:F, textAlign:'center', marginBottom:6 }}>Choose Your Language</h1>
      <p style={{ color:JAG.gray, fontSize:15, textAlign:'center', fontFamily:FAR, marginBottom:36 }}>اختر لغتك</p>
      <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:'auto' }}>
        {[{id:'en',flag:'🇬🇧',label:'English',sub:'Continue in English'},{id:'ar',flag:'🇪🇬',label:'العربية',sub:'الاستمرار بالعربية'}].map(opt=>(
          <div key={opt.id} onClick={()=>setSel(opt.id)} style={{
            background:sel===opt.id?'rgba(201,162,39,0.08)':JAG.surface,
            border:`${sel===opt.id?1.5:1}px solid ${sel===opt.id?JAG.gold:'rgba(255,255,255,0.08)'}`,
            borderRadius:16, padding:'18px 20px', display:'flex', alignItems:'center', gap:16, cursor:'pointer', transition:'all 0.2s',
          }}>
            <span style={{ fontSize:34 }}>{opt.flag}</span>
            <div style={{ flex:1 }}>
              <div style={{ color:JAG.white, fontSize:17, fontWeight:700, fontFamily:F }}>{opt.label}</div>
              <div style={{ color:JAG.gray, fontSize:13, fontFamily:F, marginTop:2 }}>{opt.sub}</div>
            </div>
            <div style={{ width:24, height:24, borderRadius:'50%', background:sel===opt.id?JAG.gold:'transparent', border:`1.5px solid ${sel===opt.id?JAG.gold:'rgba(255,255,255,0.2)'}`, display:'flex', alignItems:'center', justifyContent:'center', color:'#000', fontSize:13, fontWeight:700, transition:'all 0.2s' }}>
              {sel===opt.id?'✓':''}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop:32 }}>
        <GoldBtn onClick={()=>onSelect(sel)}>
          {sel==='ar'?'متابعة':'Continue'}
        </GoldBtn>
      </div>
    </div>
  );
}

function AuthGateScreen({ onPhone, onGuest, lang }) {
  const ar = lang==='ar';
  return (
    <div style={{ width:'100%', height:'100%', background:JAG.bg, display:'flex', flexDirection:'column', padding:'0 24px 40px', direction:ar?'rtl':'ltr', overflowY:'auto' }}>
      <div style={{ height:170, background:'linear-gradient(180deg,rgba(26,77,46,0.35) 0%,transparent 100%)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        <img src="uploads/jaguar logo.jpg" style={{ width:92, height:92, objectFit:'contain', borderRadius:12 }}/>
      </div>
      <div style={{ textAlign:'center', marginBottom:36 }}>
        <h1 style={{ color:JAG.white, fontSize:26, fontWeight:800, fontFamily:ar?FAR:F, marginBottom:8 }}>{ar?'مرحباً بعودتك':'Welcome Back'}</h1>
        <p style={{ color:JAG.gray, fontSize:15, fontFamily:ar?FAR:F }}>{ar?'سجّل الدخول لإدارة رحلاتك':'Sign in to manage your rides'}</p>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        <GreenBtn onClick={onPhone}>
          <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="white"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
            {ar?'المتابعة برقم الهاتف':'Continue with Phone'}
          </span>
        </GreenBtn>
        <OutlineBtn col="rgba(255,255,255,0.7)">
          <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            <svg viewBox="0 0 24 24" width="18" height="18"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            {ar?'المتابعة بجوجل':'Continue with Google'}
          </span>
        </OutlineBtn>
        <OutlineBtn col="rgba(255,255,255,0.7)">
          <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
            {ar?'المتابعة بآبل':'Continue with Apple'}
          </span>
        </OutlineBtn>
      </div>
      <button onClick={onGuest} style={{ background:'none', border:'none', color:JAG.gray, fontSize:14, fontFamily:ar?FAR:F, cursor:'pointer', marginTop:24, alignSelf:'center' }}>
        {ar?'المتابعة كضيف':'Continue as Guest →'}
      </button>
    </div>
  );
}

function PhoneScreen({ onSend, onBack, lang }) {
  const [phone, setPhone] = React.useState('');
  const ar = lang==='ar';
  return (
    <div style={{ width:'100%', height:'100%', background:JAG.bg, display:'flex', flexDirection:'column', padding:'20px 24px 40px', direction:ar?'rtl':'ltr', overflowY:'auto' }}>
      <button onClick={onBack} style={{ background:'none', border:'none', color:JAG.gold, fontSize:22, cursor:'pointer', alignSelf:ar?'flex-end':'flex-start', marginBottom:24, lineHeight:1 }}>
        {ar?'→':'←'}
      </button>
      <h1 style={{ color:JAG.white, fontSize:26, fontWeight:800, fontFamily:ar?FAR:F, marginBottom:8 }}>{ar?'أدخل رقم هاتفك':'Enter Your Number'}</h1>
      <p style={{ color:JAG.gray, fontSize:15, fontFamily:ar?FAR:F, marginBottom:32 }}>{ar?"سنرسل لك رمز التحقق":"We'll send you a verification code"}</p>
      <div style={{ display:'flex', gap:8, marginBottom:24 }}>
        <div style={{ width:88, height:52, background:JAG.surface2, border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', gap:6, flexShrink:0 }}>
          <span>🇪🇬</span><span style={{ color:JAG.white, fontSize:15, fontFamily:F }}>+20</span>
        </div>
        <Inp ph={ar?'رقم الهاتف':'Phone number'} val={phone} onChange={e=>setPhone(e.target.value)} type="tel" style={{ flex:1 }}/>
      </div>
      <GoldBtn onClick={()=>onSend(phone)} disabled={phone.length<7}>{ar?'إرسال الرمز':'Send Code'}</GoldBtn>
    </div>
  );
}

function OTPScreen({ phone, onVerify, onBack, lang }) {
  const [otp, setOtp] = React.useState(['','','','','','']);
  const [timer, setTimer] = React.useState(59);
  const refs = [React.useRef(),React.useRef(),React.useRef(),React.useRef(),React.useRef(),React.useRef()];
  const ar = lang==='ar';
  React.useEffect(() => {
    refs[0].current?.focus();
    const t = setInterval(()=>setTimer(n=>n>0?n-1:0), 1000);
    return ()=>clearInterval(t);
  }, []);
  const handleDigit = (i, val) => {
    const d = val.replace(/\D/,'').slice(-1);
    const next = [...otp]; next[i]=d; setOtp(next);
    if (d && i<5) refs[i+1].current?.focus();
    if (next.every(v=>v)) setTimeout(()=>onVerify(), 300);
  };
  return (
    <div style={{ width:'100%', height:'100%', background:JAG.bg, display:'flex', flexDirection:'column', padding:'20px 24px 40px', direction:ar?'rtl':'ltr', overflowY:'auto' }}>
      <button onClick={onBack} style={{ background:'none', border:'none', color:JAG.gold, fontSize:22, cursor:'pointer', alignSelf:ar?'flex-end':'flex-start', marginBottom:24, lineHeight:1 }}>
        {ar?'→':'←'}
      </button>
      <h1 style={{ color:JAG.white, fontSize:26, fontWeight:800, fontFamily:ar?FAR:F, marginBottom:8 }}>{ar?'أدخل رمز التحقق':'Verification Code'}</h1>
      <p style={{ color:JAG.gray, fontSize:15, fontFamily:ar?FAR:F, marginBottom:32 }}>{ar?`أرسلنا الرمز إلى +20 ${phone}`:`Sent to +20 ${phone}`}</p>
      <div style={{ display:'flex', gap:10, justifyContent:'center', marginBottom:32 }}>
        {otp.map((d,i)=>(
          <input key={i} ref={refs[i]} value={d} onChange={e=>handleDigit(i,e.target.value)}
            onKeyDown={e=>{if(e.key==='Backspace'&&!d&&i>0)refs[i-1].current?.focus();}}
            maxLength={1} type="tel"
            style={{ width:46, height:58, textAlign:'center', fontSize:24, fontWeight:800, fontFamily:F, background:JAG.surface2, border:`2px solid ${d?JAG.gold:'rgba(255,255,255,0.08)'}`, borderRadius:12, color:JAG.white, outline:'none', transition:'border-color 0.2s' }}
          />
        ))}
      </div>
      <div style={{ textAlign:'center', marginBottom:32 }}>
        {timer>0
          ? <span style={{ color:JAG.gray, fontSize:14, fontFamily:F }}>{ar?`إعادة الإرسال خلال 00:${String(timer).padStart(2,'0')}`:`Resend in 00:${String(timer).padStart(2,'0')}`}</span>
          : <button onClick={()=>setTimer(59)} style={{ background:'none', border:'none', color:JAG.gold, fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:F }}>{ar?'إعادة إرسال الرمز':'Resend Code'}</button>
        }
      </div>
      <GoldBtn onClick={onVerify} disabled={!otp.every(v=>v)}>{ar?'تحقق':'Verify'}</GoldBtn>
      <p style={{ color:JAG.gray, fontSize:12, textAlign:'center', fontFamily:F, marginTop:16 }}>
        {ar?'أدخل أي رمز للمتابعة':'Enter any 6 digits to continue'}
      </p>
    </div>
  );
}

Object.assign(window, { SplashScreen, OnboardingScreen, LanguageScreen, AuthGateScreen, PhoneScreen, OTPScreen });
