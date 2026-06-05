// JAGUAR LIMOUSINE — Fleet, Bookings, Offers, Profile, Loyalty, Notifications, Tracking

// ══════════════════════════════════════
// FLEET
// ══════════════════════════════════════
function FleetScreen({ navigate, lang }) {
  const ar = lang==='ar';
  const [filter, setFilter] = React.useState('all');
  const [detail, setDetail] = React.useState(null);
  if (detail) return <CarDetailScreen car={detail} onBack={()=>setDetail(null)} navigate={navigate} lang={lang}/>;
  const filterLabels = ar ? [['all','الكل'],['economy','اقتصادي'],['suv','SUV'],['luxury','فاخر']] : [['all','All'],['economy','Economy'],['suv','SUV'],['luxury','Luxury']];
  const list = filter==='all' ? CARS : CARS.filter(c=>c.cat===filter);
  return (
    <div style={{ width:'100%', height:'100%', background:JAG.bg, overflowY:'auto', paddingBottom:72, direction:ar?'rtl':'ltr' }}>
      <div style={{ padding:'16px 20px 12px' }}>
        <h1 style={{ color:JAG.white, fontSize:26, fontWeight:900, fontFamily:ar?FAR:F }}>{ar?'أسطولنا':'Our Fleet'}</h1>
        <p style={{ color:JAG.gray, fontSize:13, fontFamily:ar?FAR:F, marginTop:4 }}>{ar?'25+ سنة من الخدمة المتميزة':'25+ years of trusted rides'}</p>
      </div>
      <div style={{ padding:'0 16px 14px' }}>
        <div style={{ display:'flex', gap:8, overflowX:'auto', scrollbarWidth:'none' }}>
          {filterLabels.map(([id,lbl])=><Chip key={id} label={lbl} active={filter===id} onClick={()=>setFilter(id)}/>)}
        </div>
      </div>
      <div style={{ padding:'0 16px', display:'flex', flexDirection:'column', gap:14 }}>
        {list.map(car=>(
          <div key={car.id} onClick={()=>setDetail(car)} style={{ borderRadius:16, overflow:'hidden', cursor:'pointer', border:'1px solid rgba(255,255,255,0.07)', transition:'transform 0.2s' }}>
            <div style={{ height:170, background:`linear-gradient(150deg,${car.color} 0%,#080808 100%)`, position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ fontSize:80, opacity:0.5 }}>{car.icon}</span>
              <div style={{ position:'absolute', top:12, left:12 }}><Badge label={car.label} type={car.cat}/></div>
              <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'linear-gradient(transparent,rgba(0,0,0,0.75))', padding:'24px 14px 12px' }}>
                <div style={{ color:JAG.white, fontSize:18, fontWeight:800, fontFamily:F }}>{car.name}</div>
              </div>
              <div style={{ position:'absolute', bottom:12, right:12, background:JAG.gold, borderRadius:8, padding:'4px 10px' }}>
                <span style={{ color:'#000', fontSize:11, fontWeight:800, fontFamily:F }}>from EGP {car.price.toLocaleString()}/trip</span>
              </div>
            </div>
          </div>
        ))}
        <div style={{ height:8 }}/>
      </div>
    </div>
  );
}

function CarDetailScreen({ car, onBack, navigate, lang }) {
  const ar = lang==='ar';
  return (
    <div style={{ width:'100%', height:'100%', background:JAG.bg, overflowY:'auto', paddingBottom:80 }}>
      <div style={{ height:230, background:`linear-gradient(150deg,${car.color} 0%,#080808 100%)`, position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <span style={{ fontSize:100, opacity:0.5 }}>{car.icon}</span>
        <button onClick={onBack} style={{ position:'absolute', top:14, left:ar?'auto':14, right:ar?14:'auto', background:'rgba(0,0,0,0.55)', border:'none', borderRadius:10, width:38, height:38, display:'flex', alignItems:'center', justifyContent:'center', color:JAG.white, fontSize:20, cursor:'pointer' }}>{ar?'→':'←'}</button>
      </div>
      <div style={{ padding:'20px 20px', direction:ar?'rtl':'ltr' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
          <div>
            <h1 style={{ color:JAG.white, fontSize:24, fontWeight:900, fontFamily:F, marginBottom:6 }}>{car.name}</h1>
            <Badge label={car.label} type={car.cat}/>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ color:JAG.gold, fontSize:22, fontWeight:900, fontFamily:F }}>EGP {car.price.toLocaleString()}</div>
            <div style={{ color:JAG.gray, fontSize:12, fontFamily:F }}>/ trip</div>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, margin:'16px 0' }}>
          {[['👥',car.seats,ar?'مقاعد':'Seats'],['👜',car.bags,ar?'حقائب':'Bags'],['⚙️','Auto',ar?'ناقل':'Trans'],['❄️','Yes','AC'],['📅',2023,ar?'السنة':'Year'],['🛡️',ar?'مشمول':'Incl.',ar?'تأمين':'Insur.']].map(([ico,v,lbl],i)=>(
            <div key={i} style={{ background:JAG.surface, borderRadius:12, padding:'12px 6px', display:'flex', flexDirection:'column', alignItems:'center', gap:4, border:'1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize:20 }}>{ico}</span>
              <span style={{ color:JAG.white, fontSize:13, fontWeight:800, fontFamily:F }}>{v}</span>
              <span style={{ color:JAG.gray, fontSize:10, fontFamily:F }}>{lbl}</span>
            </div>
          ))}
        </div>
        <p style={{ color:JAG.gray, fontSize:14, fontFamily:ar?FAR:F, lineHeight:1.7, marginBottom:20 }}>
          {ar?'تجربة سفر فاخرة لا مثيل لها. مقاعد جلدية، سقف بانورامي، وراحة قصوى في كل رحلة.':'The pinnacle of luxury travel. Leather seats, panoramic roof, and whisper-quiet ride for the most discerning passengers.'}
        </p>
        <Card style={{ marginBottom:16 }}>
          <div style={{ color:JAG.white, fontSize:14, fontWeight:700, fontFamily:F, marginBottom:12 }}>{ar?'التوفر — يونيو 2025':'Availability — June 2025'}</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4 }}>
            {Array.from({length:30},(_,i)=>{
              const d=i+1, booked=[3,7,12,13,14,20,21].includes(d);
              return <div key={i} style={{ height:30, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', background:booked?'rgba(211,47,47,0.2)':'rgba(56,142,60,0.18)', color:booked?'#EF5350':'#66BB6A', fontSize:11, fontWeight:600, fontFamily:F }}>{d}</div>;
            })}
          </div>
          <div style={{ display:'flex', gap:14, marginTop:10 }}>
            <span style={{ color:'#66BB6A', fontSize:11, fontFamily:F }}>● {ar?'متاح':'Available'}</span>
            <span style={{ color:'#EF5350', fontSize:11, fontFamily:F }}>● {ar?'محجوز':'Booked'}</span>
          </div>
        </Card>
      </div>
      <div style={{ position:'sticky', bottom:72, left:0, right:0, padding:'12px 16px', background:JAG.bg, borderTop:'1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <div style={{ flexShrink:0 }}>
            <span style={{ color:JAG.gold, fontSize:19, fontWeight:900, fontFamily:F }}>EGP {car.price.toLocaleString()}</span>
            <span style={{ color:JAG.gray, fontSize:11, fontFamily:F }}> /trip</span>
          </div>
          <GoldBtn onClick={()=>navigate('booking')} style={{ flex:1, width:'auto' }}>{ar?'احجز هذه السيارة':'Book This Car'}</GoldBtn>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════
// MY BOOKINGS
// ══════════════════════════════════════
const BK_DATA = {
  upcoming:[
    {id:'JL-20240606-0042',route:'Maadi → Cairo Airport T2',date:'Jun 6, 10:00 AM',car:'Mercedes S-Class',status:'confirmed'},
    {id:'JL-20240610-0018',route:'Zamalek → New Cairo',date:'Jun 10, 2:30 PM',car:'BMW 7 Series',status:'confirmed'},
  ],
  active:[
    {id:'JL-20240605-0031',route:'Maadi → Cairo Airport T1',date:'Today, 3:15 PM',car:'Audi A8',driver:'Ahmed Hassan',plate:'ABC 1234'},
  ],
  past:[
    {id:'JL-20240602-0014',route:'New Cairo → Zamalek',date:'Jun 2',car:'BMW 7 Series',price:920,stars:5},
    {id:'JL-20240528-0009',route:'Maadi → Heliopolis',date:'May 28',car:'Toyota Camry',price:450,stars:0},
  ],
};

function MyBookingsScreen({ navigate, lang }) {
  const ar = lang==='ar';
  const [activeTab, setAT] = React.useState('upcoming');
  const tabs = ar?[['upcoming','القادمة'],['active','جارية'],['past','السابقة'],['cancelled','ملغاة']]:[['upcoming','Upcoming'],['active','Active'],['past','Past'],['cancelled','Cancelled']];
  return (
    <div style={{ width:'100%', height:'100%', background:JAG.bg, display:'flex', flexDirection:'column', direction:ar?'rtl':'ltr', paddingBottom:72 }}>
      <div style={{ padding:'16px 20px 0' }}>
        <h1 style={{ color:JAG.white, fontSize:26, fontWeight:900, fontFamily:ar?FAR:F, marginBottom:14 }}>{ar?'حجوزاتي':'My Bookings'}</h1>
        <div style={{ display:'flex', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
          {tabs.map(([id,lbl])=>(
            <button key={id} onClick={()=>setAT(id)} style={{ background:'none', border:'none', padding:'8px 10px', color:activeTab===id?JAG.gold:JAG.gray, fontSize:12, fontWeight:700, fontFamily:ar?FAR:F, cursor:'pointer', borderBottom:activeTab===id?`2px solid ${JAG.gold}`:'2px solid transparent', marginBottom:-1, transition:'all 0.2s', whiteSpace:'nowrap' }}>{lbl}</button>
          ))}
        </div>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'14px 16px' }}>
        {activeTab==='active' && BK_DATA.active.map(b=>(
          <div key={b.id} style={{ background:JAG.surface, borderRadius:16, padding:16, marginBottom:12, border:'1.5px solid rgba(76,175,80,0.35)', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:'linear-gradient(90deg,#4CAF50,transparent)', borderRadius:'16px 16px 0 0' }}/>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
              <Pulse color='#4CAF50'/>
              <span style={{ color:'#66BB6A', fontSize:11, fontWeight:800, fontFamily:F, textTransform:'uppercase', letterSpacing:0.5 }}>{ar?'السائق في الطريق':'Driver Assigned — En Route'}</span>
            </div>
            <div style={{ color:JAG.white, fontSize:15, fontWeight:700, fontFamily:ar?FAR:F, marginBottom:4 }}>{b.route}</div>
            <div style={{ color:JAG.gray, fontSize:12, marginBottom:12, fontFamily:F }}>{b.car} · {b.date}</div>
            <div style={{ display:'flex', alignItems:'center', gap:12, background:JAG.surface2, borderRadius:12, padding:'10px 12px', marginBottom:12 }}>
              <div style={{ width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg,#2E7D4F,#1A4D2E)', display:'flex', alignItems:'center', justifyContent:'center', color:JAG.gold, fontSize:14, fontWeight:800, fontFamily:F, flexShrink:0 }}>AH</div>
              <div style={{ flex:1 }}>
                <div style={{ color:JAG.white, fontSize:14, fontWeight:700, fontFamily:F }}>{b.driver}</div>
                <div style={{ color:JAG.gray, fontSize:11, fontFamily:F }}>{b.plate} · {b.car}</div>
              </div>
              <Stars n={5} size={11}/>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
              {(ar?['مؤكد','السائق','الطريق','وصل','اكتمل']:['Confirmed','Assigned','En Route','Arrived','Done']).map((s,i)=>(
                <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3, flex:1 }}>
                  <div style={{ width:10, height:10, borderRadius:'50%', background:i<3?'#4CAF50':'rgba(255,255,255,0.15)', boxShadow:i===2?'0 0 8px rgba(76,175,80,0.7)':'none', animation:i===2?'jagPulse 1.5s infinite':'none', transition:'all 0.3s' }}/>
                  <span style={{ color:i<3?'#4CAF50':JAG.gray, fontSize:8, fontFamily:F, textAlign:'center' }}>{s}</span>
                </div>
              ))}
            </div>
            <GoldBtn onClick={()=>navigate('tracking')} sm>{ar?'🗺 تتبع على الخريطة':'🗺 Track on Map'}</GoldBtn>
          </div>
        ))}
        {(activeTab==='upcoming'?BK_DATA.upcoming:activeTab==='past'?BK_DATA.past:[]).map(b=>(
          <div key={b.id} style={{ background:JAG.surface, borderRadius:16, padding:16, marginBottom:12, border:'1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
              <Badge label={activeTab==='upcoming'?(ar?'مؤكد':'Confirmed'):(ar?'مكتمل':'Completed')} type={activeTab==='upcoming'?'confirmed':'economy'}/>
              <span style={{ color:JAG.gray, fontSize:11, fontFamily:F }}>#{b.id.slice(-4)}</span>
            </div>
            <div style={{ color:JAG.white, fontSize:15, fontWeight:700, fontFamily:ar?FAR:F, marginBottom:4 }}>{b.route}</div>
            <div style={{ color:JAG.gray, fontSize:12, fontFamily:F, marginBottom:12 }}>{b.car} · {b.date}{b.price?` · EGP ${b.price.toLocaleString()}`:''}</div>
            {b.stars===0 && <div style={{ marginBottom:10 }}>
              <div style={{ color:JAG.gold, fontSize:12, marginBottom:5, fontFamily:F }}>{ar?'قيّم رحلتك':'Rate this trip'}</div>
              <div style={{ display:'flex', gap:4 }}>{[1,2,3,4,5].map(i=><span key={i} style={{ color:JAG.gold, fontSize:22, cursor:'pointer' }}>☆</span>)}</div>
            </div>}
            {b.stars>0 && <div style={{ marginBottom:10 }}><Stars n={b.stars} size={14}/></div>}
            <div style={{ display:'flex', gap:8 }}>
              <OutlineBtn sm style={{ flex:1 }}>{ar?'التفاصيل':'Details'}</OutlineBtn>
              {activeTab==='upcoming' && <OutlineBtn sm col={JAG.error} style={{ flex:1 }}>{ar?'إلغاء':'Cancel'}</OutlineBtn>}
              {b.price && <GoldBtn sm style={{ flex:1 }} onClick={()=>navigate('booking')}>{ar?'أعد الحجز':'Re-Book'}</GoldBtn>}
            </div>
          </div>
        ))}
        {activeTab==='cancelled' && (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'48px 0', textAlign:'center' }}>
            <span style={{ fontSize:44, marginBottom:12, opacity:0.35 }}>🚫</span>
            <div style={{ color:JAG.white, fontSize:16, fontWeight:700, fontFamily:F, marginBottom:6 }}>{ar?'لا توجد حجوزات ملغاة':'No cancelled bookings'}</div>
            <div style={{ color:JAG.gray, fontSize:13, fontFamily:F }}>{ar?'ستظهر هنا الحجوزات الملغاة':'Cancelled bookings will appear here'}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════
// OFFERS
// ══════════════════════════════════════
const OFFER_LIST = [
  {ico:'✈️',title:'Airport Special — 15% Off',sub:'Valid Mon–Thu, all terminals',code:'AIRPORT15',exp:'Jun 30',bg:'linear-gradient(135deg,#1A4D2E,#0D2818)'},
  {ico:'⭐',title:'Luxury Package — 10% Off',sub:'On all luxury car bookings',code:'LUXURY10',exp:'Jun 20',bg:'linear-gradient(135deg,#3A2800,#1A1000)'},
  {ico:'🗓️',title:'Monthly Plan — 20% Off',sub:'Subscribe for 30+ rides/month',code:'MONTHLY20',exp:'Limited',bg:'linear-gradient(135deg,#1A203A,#0A0D18)'},
  {ico:'🎂',title:'Birthday Bonus',sub:'500 pts on your birthday',code:'BDAY500',exp:'Always',bg:'linear-gradient(135deg,#2A1A3A,#0D0818)'},
];

function OffersScreen({ lang }) {
  const ar = lang==='ar';
  const [copied, setCopied] = React.useState(null);
  const [manual, setManual] = React.useState('');
  const [manMsg, setManMsg] = React.useState('');
  const copy = (code) => { setCopied(code); setTimeout(()=>setCopied(null),2000); };
  return (
    <div style={{ width:'100%', height:'100%', background:JAG.bg, overflowY:'auto', direction:ar?'rtl':'ltr', paddingBottom:72 }}>
      <div style={{ padding:'16px 20px 14px' }}>
        <h1 style={{ color:JAG.white, fontSize:26, fontWeight:900, fontFamily:ar?FAR:F }}>{ar?'العروض والخصومات':'Offers & Promos'}</h1>
      </div>
      {/* Featured */}
      <div style={{ margin:'0 16px 16px', background:'linear-gradient(135deg,#B8870F,#C9A227,#F0D080)', borderRadius:18, padding:22, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', right:-20, top:-20, width:100, height:100, borderRadius:'50%', background:'rgba(255,255,255,0.1)' }}/>
        <div style={{ color:'rgba(0,0,0,0.55)', fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:1.2, fontFamily:F }}>{ar?'العرض المميز':'FEATURED OFFER'}</div>
        <div style={{ color:'#000', fontSize:20, fontWeight:900, fontFamily:ar?FAR:F, margin:'6px 0 4px' }}>{ar?'عيد خاص — 20% خصم على كل الرحلات':'Eid Special — 20% off all rides'}</div>
        <div style={{ color:'rgba(0,0,0,0.6)', fontSize:12, fontFamily:F, marginBottom:14 }}>⏱ 2d 14h 30m {ar?'متبقية':'remaining'}</div>
        <div style={{ display:'flex', gap:8 }}>
          <div style={{ background:'rgba(0,0,0,0.15)', borderRadius:8, padding:'6px 12px', color:'#000', fontSize:13, fontWeight:800, fontFamily:F }}>EID20</div>
          <button onClick={()=>copy('EID20')} style={{ background:'rgba(0,0,0,0.2)', border:'none', borderRadius:8, padding:'6px 14px', color:'#000', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:F }}>
            {copied==='EID20'?(ar?'✓ تم':'✓ Copied!'):(ar?'نسخ':'Copy')}
          </button>
        </div>
      </div>
      {/* List */}
      <div style={{ padding:'0 16px', display:'flex', flexDirection:'column', gap:12, marginBottom:16 }}>
        {OFFER_LIST.map((o,i)=>(
          <div key={i} style={{ background:o.bg, borderRadius:16, padding:18, border:'1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display:'flex', gap:12, alignItems:'flex-start', marginBottom:12 }}>
              <span style={{ fontSize:28 }}>{o.ico}</span>
              <div style={{ flex:1 }}>
                <div style={{ color:JAG.white, fontSize:14, fontWeight:700, fontFamily:ar?FAR:F, marginBottom:4 }}>{o.title}</div>
                <div style={{ color:JAG.gray, fontSize:12, fontFamily:ar?FAR:F }}>{o.sub}</div>
              </div>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ display:'flex', gap:8 }}>
                <div style={{ background:'rgba(201,162,39,0.15)', borderRadius:6, padding:'3px 9px', color:JAG.gold, fontSize:11, fontWeight:800, fontFamily:F }}>{o.code}</div>
                <button onClick={()=>copy(o.code)} style={{ background:'rgba(255,255,255,0.07)', border:'none', borderRadius:6, padding:'3px 10px', color:copied===o.code?'#4CAF50':JAG.gray, fontSize:11, cursor:'pointer', fontFamily:F }}>
                  {copied===o.code?(ar?'✓ تم':'✓ Done'):(ar?'نسخ':'Copy')}
                </button>
              </div>
              <span style={{ color:JAG.gray, fontSize:11, fontFamily:F }}>{o.exp}</span>
            </div>
          </div>
        ))}
      </div>
      {/* Referral */}
      <div style={{ margin:'0 16px 16px', background:'linear-gradient(135deg,#C9A227,#8A6A10)', borderRadius:18, padding:20 }}>
        <div style={{ color:'rgba(0,0,0,0.55)', fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:1.2, fontFamily:F, marginBottom:6 }}>{ar?'ادعُ واكسب':'INVITE & EARN'}</div>
        <div style={{ color:'#000', fontSize:16, fontWeight:800, fontFamily:ar?FAR:F, marginBottom:4 }}>{ar?'اعطِ 50 جنيه، احصل على 50 جنيه':'Give 50 EGP, Get 50 EGP per referral'}</div>
        <div style={{ color:'rgba(0,0,0,0.55)', fontSize:12, fontFamily:F, marginBottom:14 }}>3 {ar?'أصدقاء انضموا — 150 جنيه مكتسب':'friends joined — EGP 150 earned'}</div>
        <div style={{ display:'flex', gap:8 }}>
          <div style={{ background:'rgba(0,0,0,0.15)', borderRadius:8, padding:'8px 14px', color:'#000', fontSize:16, fontWeight:900, fontFamily:F }}>AHMED50</div>
          <button onClick={()=>copy('AHMED50')} style={{ background:'rgba(0,0,0,0.18)', border:'none', borderRadius:8, padding:'8px 14px', color:'#000', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:F }}>{copied==='AHMED50'?'✓':(ar?'نسخ':'Copy')}</button>
          <button style={{ background:'rgba(0,0,0,0.18)', border:'none', borderRadius:8, padding:'8px 14px', color:'#000', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:F }}>{ar?'مشاركة':'Share'}</button>
        </div>
      </div>
      {/* Manual Code */}
      <div style={{ padding:'0 16px 24px' }}>
        <Card>
          <div style={{ color:JAG.white, fontSize:14, fontWeight:700, fontFamily:ar?FAR:F, marginBottom:12 }}>{ar?'لديك رمز خصم؟':'Have a promo code?'}</div>
          <div style={{ display:'flex', gap:8 }}>
            <Inp ph={ar?'أدخل الرمز':'Enter code'} val={manual} onChange={e=>setManual(e.target.value.toUpperCase())} style={{ flex:1 }}/>
            <button onClick={()=>{ setManMsg(manual==='SAVE15'?(ar?'✓ تم التطبيق!':'✓ Applied! 15% off'):(ar?'✗ رمز غير صالح':'✗ Invalid code')); }} style={{ background:JAG.gold, border:'none', borderRadius:12, padding:'0 16px', color:'#000', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:F, flexShrink:0 }}>{ar?'تطبيق':'Apply'}</button>
          </div>
          {manMsg && <div style={{ marginTop:8, color:manMsg.includes('✓')?'#4CAF50':JAG.error, fontSize:13, fontFamily:F }}>{manMsg}</div>}
        </Card>
      </div>
    </div>
  );
}

// ══════════════════════════════════════
// PROFILE
// ══════════════════════════════════════
function ProfileScreen({ navigate, lang }) {
  const ar = lang==='ar';
  return (
    <div style={{ width:'100%', height:'100%', background:JAG.bg, overflowY:'auto', direction:ar?'rtl':'ltr', paddingBottom:72 }}>
      <div style={{ padding:'16px 20px 20px', background:'linear-gradient(180deg,rgba(26,77,46,0.28) 0%,transparent 100%)' }}>
        <div style={{ display:'flex', gap:16, alignItems:'center' }}>
          <div style={{ width:68, height:68, borderRadius:'50%', background:'linear-gradient(135deg,#2E7D4F,#1A4D2E)', display:'flex', alignItems:'center', justifyContent:'center', color:JAG.gold, fontSize:22, fontWeight:900, fontFamily:F, border:`2px solid ${JAG.gold}`, flexShrink:0 }}>AE</div>
          <div>
            <div style={{ color:JAG.white, fontSize:19, fontWeight:800, fontFamily:ar?FAR:F }}>{ar?'أحمد الشربيني':'Ahmed El-Sherbiny'}</div>
            <div style={{ color:JAG.gray, fontSize:13, fontFamily:ar?FAR:F, marginTop:2 }}>{ar?'عضو منذ 2022':'Member since 2022'}</div>
            <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:4 }}>
              <span style={{ fontSize:12 }}>👑</span>
              <span style={{ color:JAG.gold, fontSize:13, fontWeight:700, fontFamily:F }}>{ar?'عضو ذهبي':'Gold Member'}</span>
              <span style={{ color:JAG.gray, fontSize:12 }}>· 1,240 pts</span>
            </div>
          </div>
        </div>
      </div>
      {[
        { title:ar?'حسابي':'MY ACCOUNT', rows:[
          {ico:'👤',lbl:ar?'تعديل الملف':'Edit Profile',arrow:true},
          {ico:'📍',lbl:ar?'عناوين محفوظة':'Saved Addresses',arrow:true},
          {ico:'💳',lbl:ar?'طرق الدفع':'Payment Methods',arrow:true},
          {ico:'🌐',lbl:ar?'اللغة':'Language',val:ar?'العربية':'English',arrow:true},
        ]},
        { title:ar?'المكافآت':'LOYALTY', rows:[
          {ico:'⭐',lbl:ar?'مكافآت جاغوار — 1,240 نقطة':'Jaguar Rewards — 1,240 pts',val:ar?'560 للبلاتيني':'560 to Platinum',arrow:true,gold:true,fn:()=>navigate('loyalty')},
        ]},
        { title:ar?'الشركات':'CORPORATE', rows:[
          {ico:'🏢',lbl:ar?'ترقية للحساب المؤسسي':'Upgrade to Corporate',arrow:true},
          {ico:'📊',lbl:ar?'الفواتير والتقارير':'Invoices & Reports',arrow:true},
        ]},
        { title:ar?'السلامة':'SAFETY', rows:[
          {ico:'🤝',lbl:ar?'جهات الاتصال الموثوقة':'Trusted Contacts',arrow:true},
          {ico:'🆘',lbl:ar?'أرقام الطوارئ':'Emergency Numbers',arrow:true},
        ]},
        { title:ar?'الدعم':'SUPPORT', rows:[
          {ico:'💬',lbl:ar?'تواصل معنا':'Contact Support',arrow:true},
          {ico:'❓',lbl:'FAQs',arrow:true},
          {ico:'⭐',lbl:ar?'قيّم التطبيق':'Rate the App',arrow:true},
          {ico:'📱',lbl:ar?'إصدار التطبيق':'App Version',val:'v1.0.0'},
        ]},
      ].map((sec,si)=>(
        <div key={si} style={{ padding:'8px 16px' }}>
          <div style={{ color:JAG.gray, fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:1, fontFamily:F, padding:'0 4px', marginBottom:8 }}>{sec.title}</div>
          <Card style={{ padding:'4px 12px' }}>
            {sec.rows.map((r,ri)=>(
              <div key={ri} onClick={r.fn} style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 4px', borderBottom:ri<sec.rows.length-1?'1px solid rgba(255,255,255,0.05)':'none', cursor:r.arrow?'pointer':'default' }}>
                <span style={{ fontSize:18, width:24, textAlign:'center' }}>{r.ico}</span>
                <span style={{ flex:1, color:r.gold?JAG.gold:JAG.white, fontSize:14, fontFamily:ar?FAR:F }}>{r.lbl}</span>
                {r.val && <span style={{ color:JAG.gray, fontSize:12, fontFamily:F }}>{r.val}</span>}
                {r.arrow && <span style={{ color:JAG.gray, fontSize:18, lineHeight:1 }}>{ar?'‹':'›'}</span>}
              </div>
            ))}
          </Card>
        </div>
      ))}
      <div style={{ padding:'12px 16px 24px' }}>
        <button style={{ width:'100%', height:52, background:'transparent', border:`1px solid rgba(211,47,47,0.4)`, borderRadius:12, color:JAG.error, fontSize:16, fontWeight:700, cursor:'pointer', fontFamily:ar?FAR:F }}>{ar?'تسجيل الخروج':'Log Out'}</button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════
// LOYALTY
// ══════════════════════════════════════
function LoyaltyScreen({ onBack, lang }) {
  const ar = lang==='ar';
  const rewards = [
    {lbl:ar?'رحلة اقتصادية مجانية':'Free Economy Ride',pts:500,ico:'🚕'},
    {lbl:ar?'ترقية للفئة الفاخرة':'Upgrade to Luxury',pts:800,ico:'🚙'},
    {lbl:ar?'قسيمة 50 جنيه خصم':'EGP 50 Discount',pts:400,ico:'🏷️'},
    {lbl:ar?'رحلة مطار مجانية':'Free Airport Transfer',pts:1200,ico:'✈️'},
  ];
  return (
    <div style={{ width:'100%', height:'100%', background:JAG.bg, overflowY:'auto', paddingBottom:20, direction:ar?'rtl':'ltr' }}>
      <div style={{ padding:'16px 20px 8px', display:'flex', alignItems:'center', gap:10 }}>
        <button onClick={onBack} style={{ background:'none', border:'none', color:JAG.gold, fontSize:22, cursor:'pointer', lineHeight:1 }}>{ar?'→':'←'}</button>
        <h1 style={{ color:JAG.white, fontSize:20, fontWeight:800, fontFamily:ar?FAR:F }}>{ar?'مكافآت جاغوار':'Jaguar Rewards'}</h1>
      </div>
      <div style={{ margin:'8px 16px 16px', background:'linear-gradient(135deg,#C9A227,#8A6A10 50%,#C9A227)', borderRadius:20, padding:24, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', right:-30, top:-30, width:130, height:130, borderRadius:'50%', background:'rgba(255,255,255,0.07)' }}/>
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ color:'rgba(0,0,0,0.5)', fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:1.5, fontFamily:F }}>{ar?'مستواك الحالي':'CURRENT TIER'}</div>
          <div style={{ color:'#000', fontSize:36, fontWeight:900, fontFamily:F, margin:'4px 0 8px' }}>{ar?'ذهبي':'GOLD'}</div>
          <div style={{ color:'rgba(0,0,0,0.55)', fontSize:13, fontFamily:F, marginBottom:6 }}>{ar?'نقاطك':'Your Points'}</div>
          <div style={{ color:'#000', fontSize:32, fontWeight:900, fontFamily:F, marginBottom:14 }}>1,240</div>
          <div style={{ background:'rgba(0,0,0,0.15)', borderRadius:4, height:8, marginBottom:6 }}>
            <div style={{ height:'100%', borderRadius:4, background:'rgba(0,0,0,0.4)', width:'41%', transition:'width 1s ease' }}/>
          </div>
          <div style={{ color:'rgba(0,0,0,0.6)', fontSize:12, fontFamily:F }}>{ar?'560 نقطة للوصول للبلاتيني':'560 pts to Platinum'}</div>
        </div>
      </div>
      {/* Tiers */}
      <div style={{ padding:'0 16px 16px' }}>
        <div style={{ color:JAG.white, fontSize:15, fontWeight:700, fontFamily:F, marginBottom:10 }}>{ar?'المستويات':'Tiers'}</div>
        <div style={{ display:'flex', gap:10 }}>
          {[{tier:ar?'فضي':'Silver',range:'0–999',bg:'#2A2A2A',perks:ar?'خصم 5%':'5% off',active:false},{tier:ar?'ذهبي':'Gold',range:'1000–2999',bg:'linear-gradient(135deg,#C9A227,#8A6A10)',perks:ar?'خصم 10%':'10% off',active:true},{tier:ar?'بلاتيني':'Platinum',range:'3000+',bg:'linear-gradient(135deg,#4A4A5A,#2A2A3A)',perks:ar?'خصم 15%':'15% off',active:false}].map((t,i)=>(
            <div key={i} style={{ flex:1, background:t.bg, borderRadius:12, padding:12, border:t.active?`1.5px solid ${JAG.gold}`:'1px solid rgba(255,255,255,0.08)', position:'relative' }}>
              {t.active && <div style={{ position:'absolute', top:-8, left:'50%', transform:'translateX(-50%)', background:JAG.gold, color:'#000', fontSize:9, fontWeight:900, fontFamily:F, padding:'2px 7px', borderRadius:8 }}>CURRENT</div>}
              <div style={{ color:t.active?'#000':JAG.white, fontSize:13, fontWeight:800, fontFamily:F, marginBottom:4 }}>{t.tier}</div>
              <div style={{ color:t.active?'rgba(0,0,0,0.55)':JAG.gray, fontSize:10, fontFamily:F, marginBottom:6 }}>{t.range} pts</div>
              <div style={{ color:t.active?'rgba(0,0,0,0.7)':JAG.gray, fontSize:11, fontFamily:F }}>{t.perks}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Rewards store */}
      <div style={{ padding:'0 16px 16px' }}>
        <div style={{ color:JAG.white, fontSize:15, fontWeight:700, fontFamily:F, marginBottom:10 }}>{ar?'متجر المكافآت':'Rewards Store'}</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {rewards.map((r,i)=>(
            <Card key={i} style={{ padding:14 }}>
              <div style={{ fontSize:28, marginBottom:8 }}>{r.ico}</div>
              <div style={{ color:JAG.white, fontSize:13, fontWeight:700, fontFamily:ar?FAR:F, marginBottom:4, lineHeight:1.3 }}>{r.lbl}</div>
              <div style={{ color:JAG.gold, fontSize:14, fontWeight:800, fontFamily:F, marginBottom:10 }}>{r.pts} pts</div>
              <button style={{ width:'100%', height:34, background:1240>=r.pts?JAG.gold:'transparent', border:`1px solid ${1240>=r.pts?JAG.gold:'rgba(255,255,255,0.15)'}`, borderRadius:8, color:1240>=r.pts?'#000':JAG.gray, fontSize:12, fontWeight:700, cursor:1240>=r.pts?'pointer':'not-allowed', fontFamily:F }}>
                {ar?'استبدل':'Redeem'}
              </button>
            </Card>
          ))}
        </div>
      </div>
      {/* History */}
      <div style={{ padding:'0 16px 24px' }}>
        <div style={{ color:JAG.white, fontSize:15, fontWeight:700, fontFamily:F, marginBottom:10 }}>{ar?'سجل النقاط':'Points History'}</div>
        <Card style={{ padding:'8px 14px' }}>
          {[['+ 100 pts',ar?'رحلة مكتملة — مدينة نصر للمطار':'Trip completed — Maadi to Airport','Jun 4',true],['+  150 pts',ar?'مكافأة رحلة مطار':'Airport transfer bonus','Jun 2',true],['- 400 pts',ar?'استبدال: قسيمة 50 جنيه':'Redeemed: EGP 50 voucher','May 28',false]].map(([pts,desc,date,pos],i,a)=>(
            <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 0', borderBottom:i<a.length-1?'1px solid rgba(255,255,255,0.05)':'none' }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background:pos?'rgba(56,142,60,0.2)':'rgba(211,47,47,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0 }}>{pos?'▲':'▼'}</div>
              <div style={{ flex:1 }}>
                <div style={{ color:pos?'#4CAF50':'#EF5350', fontSize:13, fontWeight:800, fontFamily:F }}>{pts}</div>
                <div style={{ color:JAG.gray, fontSize:11, fontFamily:ar?FAR:F, marginTop:1 }}>{desc}</div>
              </div>
              <span style={{ color:JAG.gray, fontSize:11, fontFamily:F }}>{date}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ══════════════════════════════════════
// NOTIFICATIONS
// ══════════════════════════════════════
function NotificationsScreen({ onBack, lang }) {
  const ar = lang==='ar';
  const notifs = [
    {ico:'🟢',title:ar?'تم تأكيد الحجز':'Booking Confirmed ✓',body:ar?'حجزك #JL-042 مؤكد ليوم 6 يونيو':'Your ride on Jun 6 is confirmed. #JL-042',time:ar?'الآن':'Just now',unread:true},
    {ico:'🚗',title:ar?'السائق معيّن':'Driver Assigned',body:ar?'أحمد حسان هو سائقك · ABC 1234':'Ahmed Hassan is your driver. Mercedes · ABC 1234',time:ar?'منذ دقيقتين':'2 min ago',unread:true},
    {ico:'📍',title:ar?'السائق قريب':'Driver is 5 min away',body:ar?'السائق على بعد 5 دقائق من موقعك':'Get ready! Track your driver live.',time:ar?'منذ 10 دقائق':'10 min ago',unread:true},
    {ico:'⭐',title:ar?'نقاط مكتسبة!':'You earned 100 points! ⭐',body:ar?'رصيدك الحالي: 1,240 نقطة':'Total balance: 1,240 pts. 560 to Platinum.',time:ar?'منذ ساعة':'1 hr ago',unread:false},
    {ico:'🎁',title:ar?'عرض جديد لك':'New Offer for You 🎁',body:ar?'عيد خاص: 20% خصم هذا الأسبوع':'Eid Special: 20% off this weekend',time:ar?'منذ 3 ساعات':'3 hrs ago',unread:false},
    {ico:'💳',title:ar?'تم الدفع':'Payment Received',body:ar?'تم خصم 765 جنيه بنجاح':'EGP 765 charged successfully',time:ar?'أمس':'Yesterday',unread:false},
  ];
  return (
    <div style={{ width:'100%', height:'100%', background:JAG.bg, display:'flex', flexDirection:'column', direction:ar?'rtl':'ltr' }}>
      <div style={{ padding:'16px 20px 12px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <button onClick={onBack} style={{ background:'none', border:'none', color:JAG.gold, fontSize:22, cursor:'pointer', lineHeight:1 }}>{ar?'→':'←'}</button>
          <h1 style={{ color:JAG.white, fontSize:20, fontWeight:800, fontFamily:ar?FAR:F }}>{ar?'الإشعارات':'Notifications'}</h1>
        </div>
        <button style={{ background:'none', border:'none', color:JAG.gold, fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:F }}>{ar?'قراءة الكل':'Mark all read'}</button>
      </div>
      <div style={{ flex:1, overflowY:'auto' }}>
        {notifs.map((n,i)=>(
          <div key={i} style={{ display:'flex', gap:14, padding:'14px 20px', borderBottom:'1px solid rgba(255,255,255,0.05)', background:n.unread?'rgba(201,162,39,0.03)':'transparent', cursor:'pointer' }}>
            <div style={{ width:44, height:44, borderRadius:'50%', background:JAG.surface2, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{n.ico}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4 }}>
                <span style={{ color:JAG.white, fontSize:14, fontWeight:700, fontFamily:ar?FAR:F }}>{n.title}</span>
                {n.unread && <div style={{ width:8, height:8, borderRadius:'50%', background:JAG.gold, flexShrink:0, marginTop:3, marginLeft:8 }}/>}
              </div>
              <div style={{ color:JAG.gray, fontSize:12, fontFamily:ar?FAR:F, lineHeight:1.5, marginBottom:4 }}>{n.body}</div>
              <div style={{ color:JAG.grayDark, fontSize:11, fontFamily:F }}>{n.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════
// LIVE TRACKING
// ══════════════════════════════════════
function TrackingScreen({ onBack, lang }) {
  const ar = lang==='ar';
  const [carX, setCarX] = React.useState(15);
  React.useEffect(()=>{
    const t = setInterval(()=>setCarX(x=>x<75?x+0.5:x), 80);
    return ()=>clearInterval(t);
  },[]);
  return (
    <div style={{ width:'100%', height:'100%', background:JAG.bg, display:'flex', flexDirection:'column', direction:ar?'rtl':'ltr' }}>
      {/* Map */}
      <div style={{ flex:1, background:'#0A1510', position:'relative', overflow:'hidden' }}>
        <svg width="100%" height="100%" style={{ position:'absolute',inset:0 }}>
          {/* Grid */}
          {[60,120,180,240,300,360,420,480].map(y=><line key={y} x1="0" y1={y} x2="500" y2={y} stroke="rgba(46,125,79,0.1)" strokeWidth="1"/>)}
          {[50,100,150,200,250,300,350].map(x=><line key={x} x1={x} y1="0" x2={x} y2="600" stroke="rgba(46,125,79,0.1)" strokeWidth="1"/>)}
          {/* Roads */}
          <path d="M0,200 Q100,190 200,200 Q300,210 400,200" stroke="rgba(46,125,79,0.35)" strokeWidth="5" fill="none"/>
          <path d="M150,0 Q160,100 150,200 Q140,300 150,400" stroke="rgba(46,125,79,0.25)" strokeWidth="4" fill="none"/>
          {/* Route */}
          <path d="M0,200 Q100,190 200,200 Q300,210 400,200" stroke={JAG.gold} strokeWidth="2.5" fill="none" strokeDasharray="12 6" opacity="0.6"/>
          {/* Destination pin */}
          <circle cx="340" cy="200" r="12" fill="#EF5350" opacity="0.9"/>
          <circle cx="340" cy="200" r="5" fill="#fff"/>
          {/* Animated car */}
          <g transform={`translate(${carX*3.7},200)`}>
            <circle cx="0" cy="0" r="14" fill={JAG.gold} opacity="0.2"/>
            <circle cx="0" cy="0" r="9" fill={JAG.gold}/>
            <text x="0" y="4" textAnchor="middle" fontSize="10">🚙</text>
          </g>
        </svg>
        {/* ETA chip */}
        <div style={{ position:'absolute', top:16, left:'50%', transform:'translateX(-50%)', background:'rgba(13,13,13,0.9)', borderRadius:12, padding:'8px 16px', backdropFilter:'blur(10px)', border:'1px solid rgba(201,162,39,0.25)' }}>
          <span style={{ color:JAG.white, fontSize:14, fontWeight:700, fontFamily:F }}>🕙 {ar?'يصل خلال 8 دقائق':'Arrives in 8 min'}</span>
        </div>
        {/* Back */}
        <button onClick={onBack} style={{ position:'absolute', top:16, left:ar?'auto':16, right:ar?16:'auto', background:'rgba(0,0,0,0.6)', border:'none', borderRadius:10, width:38, height:38, display:'flex', alignItems:'center', justifyContent:'center', color:JAG.white, fontSize:20, cursor:'pointer' }}>{ar?'→':'←'}</button>
      </div>
      {/* Bottom drawer */}
      <div style={{ background:JAG.surface, borderRadius:'24px 24px 0 0', padding:'16px 20px 20px', border:'1px solid rgba(255,255,255,0.08)', borderBottom:'none' }}>
        <div style={{ width:40, height:4, borderRadius:2, background:'rgba(255,255,255,0.2)', margin:'0 auto 16px' }}/>
        <div style={{ display:'flex', gap:14, alignItems:'center', marginBottom:16 }}>
          <div style={{ width:52, height:52, borderRadius:'50%', background:'linear-gradient(135deg,#2E7D4F,#1A4D2E)', display:'flex', alignItems:'center', justifyContent:'center', color:JAG.gold, fontSize:18, fontWeight:800, fontFamily:F, border:`2px solid rgba(201,162,39,0.4)`, flexShrink:0 }}>AH</div>
          <div style={{ flex:1 }}>
            <div style={{ color:JAG.white, fontSize:16, fontWeight:700, fontFamily:ar?FAR:F }}>Ahmed Hassan</div>
            <Stars n={5} size={12}/> <span style={{ color:JAG.gray, fontSize:11, fontFamily:F, marginLeft:4 }}>4.9</span>
            <div style={{ color:JAG.gray, fontSize:12, fontFamily:F, marginTop:2 }}>Cairo · ABC 1234 · Mercedes S-Class</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          {[{ico:'📞',lbl:ar?'اتصال':'Call',bg:JAG.success},{ico:'💬',lbl:'WhatsApp',bg:'#25D366'},{ico:'📤',lbl:ar?'مشاركة':'Share',bg:JAG.surface3},{ico:'🆘',lbl:'SOS',bg:JAG.error}].map((a,i)=>(
            <button key={i} style={{ flex:1, height:52, background:a.bg, border:'none', borderRadius:12, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:3, cursor:'pointer' }}>
              <span style={{ fontSize:18 }}>{a.ico}</span>
              <span style={{ color:JAG.white, fontSize:10, fontWeight:600, fontFamily:F }}>{a.lbl}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { FleetScreen, CarDetailScreen, MyBookingsScreen, OffersScreen, ProfileScreen, LoyaltyScreen, NotificationsScreen, TrackingScreen });
