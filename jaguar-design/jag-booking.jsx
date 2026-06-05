// JAGUAR LIMOUSINE — Booking Flow

const CARS = [
  { id:1, name:'Mercedes S-Class', cat:'luxury', label:'Luxury', price:850, seats:4, bags:2, icon:'🚙', color:'#0F2A1C' },
  { id:2, name:'BMW 7 Series',     cat:'luxury', label:'Luxury', price:920, seats:4, bags:2, icon:'🚘', color:'#0F1C2A' },
  { id:3, name:'Cadillac Escalade',cat:'suv',    label:'SUV',   price:1100,seats:7, bags:4, icon:'🚐', color:'#1C0F2A' },
  { id:4, name:'Audi A8',          cat:'luxury', label:'Luxury', price:780, seats:4, bags:2, icon:'🚗', color:'#2A1010' },
  { id:5, name:'Toyota Camry',     cat:'economy',label:'Economy',price:450, seats:4, bags:2, icon:'🚕', color:'#101A2A' },
];

function BookingProgress({ step, lang }) {
  const ar = lang==='ar';
  const labels = ar ? ['التفاصيل','السيارة','التأكيد','تم!'] : ['Details','Car','Confirm','Done!'];
  return (
    <div style={{ display:'flex', alignItems:'center', padding:'0 20px', direction:ar?'rtl':'ltr' }}>
      {labels.map((lbl,i)=>(
        <React.Fragment key={i}>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
            <div style={{ width:28, height:28, borderRadius:'50%', background:i+1<=step?JAG.gold:JAG.surface2, border:i+1<=step?'none':'1.5px solid rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:i+1<=step?'#000':JAG.gray, transition:'all 0.3s' }}>
              {i+1<step?'✓':i+1}
            </div>
            <span style={{ fontSize:10, color:i+1<=step?JAG.gold:JAG.gray, fontFamily:F }}>{lbl}</span>
          </div>
          {i<3 && <div style={{ flex:1, height:2, margin:'0 4px', marginBottom:16, background:i+1<step?JAG.gold:'rgba(255,255,255,0.1)', transition:'background 0.3s' }}/>}
        </React.Fragment>
      ))}
    </div>
  );
}

function BookingStep1({ data, onNext, lang }) {
  const ar = lang==='ar';
  const [pickup, setPickup] = React.useState(data.pickup||'');
  const [dropoff, setDropoff] = React.useState(data.dropoff||'');
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
      <div style={{ flex:1, overflowY:'auto', padding:'16px 20px' }}>
        {/* Map mockup */}
        <div style={{ height:148, borderRadius:14, marginBottom:18, background:'#0A1F12', position:'relative', overflow:'hidden', border:'1px solid rgba(46,125,79,0.2)' }}>
          <svg width="100%" height="148" style={{ position:'absolute',inset:0 }}>
            {[25,50,75,100,125].map(y=><line key={y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(46,125,79,0.12)" strokeWidth="1"/>)}
            {[40,80,120,160,200,240,280,320].map(x=><line key={x} x1={x} y1="0" x2={x} y2="148" stroke="rgba(46,125,79,0.12)" strokeWidth="1"/>)}
            <path d="M0,74 C60,68 100,80 160,74 C220,68 260,80 320,74 C360,70 390,74 420,74" stroke="rgba(46,125,79,0.5)" strokeWidth="3.5" fill="none"/>
            <path d="M0,74 C60,68 100,80 160,74 C220,68 260,80 320,74 C360,70 390,74 420,74" stroke={JAG.gold} strokeWidth="2" fill="none" strokeDasharray="10 6" opacity="0.5"/>
            <circle cx="80" cy="74" r="10" fill={JAG.gold} opacity="0.9"/>
            <circle cx="80" cy="74" r="4" fill="#000"/>
            <circle cx="300" cy="74" r="10" fill="#EF5350" opacity="0.9"/>
            <circle cx="300" cy="74" r="4" fill="#000"/>
          </svg>
          <div style={{ position:'absolute', top:10, left:10, background:'rgba(0,0,0,0.65)', borderRadius:8, padding:'4px 10px', color:JAG.white, fontSize:11, fontFamily:F }}>📍 Cairo, Egypt</div>
          <div style={{ position:'absolute', bottom:10, right:10, background:'rgba(201,162,39,0.15)', borderRadius:8, padding:'4px 10px', color:JAG.gold, fontSize:11, fontFamily:F }}>~32 min · 18 km</div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:14, direction:ar?'rtl':'ltr' }}>
          <div>
            <label style={{ color:JAG.gray, fontSize:13, fontFamily:F, display:'block', marginBottom:6 }}>{ar?'موقع الانطلاق':'Pickup Location'}</label>
            <Inp ph={ar?'مثال: مدينة نصر':'e.g. Maadi, Cairo'} val={pickup} onChange={e=>setPickup(e.target.value)} icon="🟢"/>
          </div>
          <div>
            <label style={{ color:JAG.gray, fontSize:13, fontFamily:F, display:'block', marginBottom:6 }}>{ar?'الوجهة':'Destination'}</label>
            <Inp ph={ar?'مثال: مطار القاهرة':'e.g. Cairo Airport T2'} val={dropoff} onChange={e=>setDropoff(e.target.value)} icon="🔴"/>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            {[[ar?'التاريخ':'Date','📅',ar?'غداً، 6 يون':'Tomorrow, Jun 6'],[ar?'الوقت':'Time','🕙','10:00 AM']].map(([lbl,ico,val],i)=>(
              <div key={i} style={{ flex:1 }}>
                <label style={{ color:JAG.gray, fontSize:13, fontFamily:F, display:'block', marginBottom:6 }}>{lbl}</label>
                <div style={{ height:52, background:JAG.surface2, borderRadius:12, border:'1px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center', padding:'0 14px', gap:8, cursor:'pointer' }}>
                  <span>{ico}</span><span style={{ color:JAG.white, fontSize:14, fontFamily:F }}>{val}</span>
                </div>
              </div>
            ))}
          </div>
          <div>
            <label style={{ color:JAG.gray, fontSize:13, fontFamily:F, display:'block', marginBottom:6 }}>{ar?'ملاحظات (اختياري)':'Special instructions (optional)'}</label>
            <Inp ph={ar?'أي تعليمات خاصة؟':'Any notes for the driver?'} icon="💬"/>
          </div>
        </div>
      </div>
      <div style={{ padding:'12px 20px 16px', borderTop:'1px solid rgba(255,255,255,0.06)', background:JAG.bg }}>
        <GoldBtn onClick={()=>onNext({ pickup:pickup||data.pickup, dropoff:dropoff||data.dropoff })}>{ar?'التالي — اختر سيارتك':'Next — Choose Your Car'}</GoldBtn>
      </div>
    </div>
  );
}

function BookingStep2({ onNext, lang }) {
  const ar = lang==='ar';
  const [filter, setFilter] = React.useState('all');
  const [sel, setSel] = React.useState(null);
  const filters = ar ? [['all','الكل'],['economy','اقتصادي'],['suv','SUV'],['luxury','فاخر']] : [['all','All'],['economy','Economy'],['suv','SUV'],['luxury','Luxury']];
  const list = filter==='all' ? CARS : CARS.filter(c=>c.cat===filter);
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
      <div style={{ padding:'10px 16px 10px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display:'flex', gap:8, overflowX:'auto', scrollbarWidth:'none' }}>
          {filters.map(([id,lbl])=><Chip key={id} label={lbl} active={filter===id} onClick={()=>setFilter(id)}/>)}
        </div>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'12px 16px' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {list.map(car=>(
            <div key={car.id} onClick={()=>setSel(car.id)} style={{ background:sel===car.id?'rgba(201,162,39,0.05)':JAG.surface, borderRadius:16, overflow:'hidden', border:sel===car.id?`1.5px solid ${JAG.gold}`:'1px solid rgba(255,255,255,0.07)', cursor:'pointer', transition:'all 0.2s' }}>
              <div style={{ height:118, background:`linear-gradient(135deg,${car.color} 0%,#080808 100%)`, display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
                <span style={{ fontSize:60, opacity:0.55 }}>{car.icon}</span>
                <div style={{ position:'absolute', top:10, left:12 }}><Badge label={car.label} type={car.cat}/></div>
                {sel===car.id && <div style={{ position:'absolute', top:10, right:12, width:24, height:24, borderRadius:'50%', background:JAG.gold, display:'flex', alignItems:'center', justifyContent:'center', color:'#000', fontSize:13, fontWeight:800 }}>✓</div>}
              </div>
              <div style={{ padding:'12px 14px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                  <div style={{ color:JAG.white, fontSize:16, fontWeight:700, fontFamily:F }}>{car.name}</div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ color:JAG.gold, fontSize:18, fontWeight:900, fontFamily:F }}>EGP {car.price.toLocaleString()}</div>
                    <div style={{ color:JAG.gray, fontSize:10, fontFamily:F }}>/ trip</div>
                  </div>
                </div>
                <div style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
                  {[`👥 ${car.seats} seats`,`👜 ${car.bags} bags`,'❄️ AC','📶 WiFi','● Available'].map((s,i)=>(
                    <span key={i} style={{ color:i===4?'#4CAF50':JAG.gray, fontSize:11, fontFamily:F }}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding:'12px 16px 16px', borderTop:'1px solid rgba(255,255,255,0.06)', background:JAG.bg }}>
        <GoldBtn onClick={()=>onNext(CARS.find(c=>c.id===sel))} disabled={!sel}>{ar?'التالي — تأكيد الحجز':'Next — Confirm Booking'}</GoldBtn>
      </div>
    </div>
  );
}

function BookingStep3({ bookData, car, onConfirm, lang }) {
  const ar = lang==='ar';
  const [extras, setExtras] = React.useState({ child:false, stop:false });
  const [promo, setPromo] = React.useState('');
  const [promoOk, setPromoOk] = React.useState(false);
  const [promoErr, setPromoErr] = React.useState(false);
  const [pay, setPay] = React.useState('cash');
  const extTotal = (extras.child?50:0)+(extras.stop?30:0);
  const disc = promoOk ? Math.round(car.price*0.15) : 0;
  const total = car.price + extTotal - disc;
  const applyPromo = () => {
    if (promo.trim().toUpperCase()==='SAVE15') { setPromoOk(true); setPromoErr(false); }
    else { setPromoErr(true); setPromoOk(false); }
  };
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
      <div style={{ flex:1, overflowY:'auto', padding:'12px 16px' }}>
        {/* Summary */}
        <Card style={{ marginBottom:12 }}>
          <div style={{ color:JAG.gray, fontSize:11, textTransform:'uppercase', letterSpacing:0.8, fontFamily:F, marginBottom:10 }}>{ar?'ملخص الرحلة':'BOOKING SUMMARY'}</div>
          <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:12 }}>
            <div style={{ width:52, height:40, background:JAG.surface2, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>{car.icon}</div>
            <div><div style={{ color:JAG.white, fontSize:15, fontWeight:700, fontFamily:F, marginBottom:4 }}>{car.name}</div><Badge label={car.label} type={car.cat}/></div>
          </div>
          <Divider my={8}/>
          {[[ar?'الانطلاق':'Pickup', bookData.pickup],[ar?'الوجهة':'Drop-off', bookData.dropoff],[ar?'التاريخ والوقت':'Date & Time','Jun 6 · 10:00 AM'],[ar?'السائق':'Driver',ar?'سيتم التعيين':'Will be assigned']].map(([k,v],i)=>(
            <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:i<3?'1px solid rgba(255,255,255,0.04)':'none' }}>
              <span style={{ color:JAG.gray, fontSize:13, fontFamily:F }}>{k}</span>
              <span style={{ color:JAG.white, fontSize:13, fontFamily:F, maxWidth:190, textAlign:'right' }}>{v}</span>
            </div>
          ))}
        </Card>
        {/* Extras */}
        <Card style={{ marginBottom:12 }}>
          <div style={{ color:JAG.gray, fontSize:11, textTransform:'uppercase', letterSpacing:0.8, fontFamily:F, marginBottom:10 }}>{ar?'إضافات اختيارية':'EXTRAS (OPTIONAL)'}</div>
          {[{k:'child',label:ar?'مقعد أطفال':'Child Seat',price:50},{k:'stop',label:ar?'توقف إضافي':'Extra Stop',price:30}].map(e=>(
            <div key={e.k} onClick={()=>setExtras(x=>({...x,[e.k]:!x[e.k]}))} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.04)', cursor:'pointer' }}>
              <div style={{ width:22, height:22, borderRadius:6, background:extras[e.k]?JAG.gold:JAG.surface2, border:`1.5px solid ${extras[e.k]?JAG.gold:'rgba(255,255,255,0.15)'}`, display:'flex', alignItems:'center', justifyContent:'center', color:'#000', fontSize:13, flexShrink:0, transition:'all 0.15s' }}>{extras[e.k]?'✓':''}</div>
              <span style={{ flex:1, color:JAG.white, fontSize:14, fontFamily:F }}>{e.label}</span>
              <span style={{ color:JAG.gold, fontSize:13, fontWeight:600, fontFamily:F }}>+ EGP {e.price}</span>
            </div>
          ))}
        </Card>
        {/* Promo */}
        <Card style={{ marginBottom:12 }}>
          <div style={{ color:JAG.gray, fontSize:11, textTransform:'uppercase', letterSpacing:0.8, fontFamily:F, marginBottom:10 }}>{ar?'رمز الخصم':'PROMO CODE'}</div>
          <div style={{ display:'flex', gap:8 }}>
            <Inp ph="e.g. SAVE15" val={promo} onChange={e=>setPromo(e.target.value.toUpperCase())} style={{ flex:1 }}/>
            <button onClick={applyPromo} style={{ background:JAG.green, border:'none', borderRadius:12, padding:'0 16px', color:JAG.white, fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:F, flexShrink:0 }}>{ar?'تطبيق':'Apply'}</button>
          </div>
          {promoOk && <div style={{ color:'#4CAF50', fontSize:13, marginTop:8, fontFamily:F }}>✓ SAVE15 {ar?'مطبق — خصم 15%':'applied — 15% off'}</div>}
          {promoErr && <div style={{ color:JAG.error, fontSize:13, marginTop:8, fontFamily:F }}>✗ {ar?'رمز غير صالح':'Invalid or expired code'}</div>}
        </Card>
        {/* Price */}
        <Card style={{ marginBottom:12 }}>
          <div style={{ color:JAG.gray, fontSize:11, textTransform:'uppercase', letterSpacing:0.8, fontFamily:F, marginBottom:10 }}>{ar?'تفاصيل السعر':'PRICE BREAKDOWN'}</div>
          {[[ar?'الأجرة الأساسية':'Base fare', car.price, false], extTotal>0&&[ar?'إضافات':'Extras',extTotal,false], promoOk&&[ar?'خصم (SAVE15)':'Discount (SAVE15)',-disc,true]].filter(Boolean).map(([lbl,amt,neg],i)=>(
            <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ color:JAG.gray, fontSize:13, fontFamily:F }}>{lbl}</span>
              <span style={{ color:neg?'#4CAF50':JAG.white, fontSize:13, fontFamily:F }}>{neg?'- ':''}EGP {Math.abs(amt).toLocaleString()}</span>
            </div>
          ))}
          <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 0 4px', borderTop:'1px solid rgba(255,255,255,0.1)', marginTop:4 }}>
            <span style={{ color:JAG.white, fontSize:16, fontWeight:700, fontFamily:F }}>{ar?'الإجمالي':'Total'}</span>
            <span style={{ color:JAG.gold, fontSize:22, fontWeight:900, fontFamily:F }}>EGP {total.toLocaleString()}</span>
          </div>
        </Card>
        {/* Payment */}
        <Card style={{ marginBottom:16 }}>
          <div style={{ color:JAG.gray, fontSize:11, textTransform:'uppercase', letterSpacing:0.8, fontFamily:F, marginBottom:10 }}>{ar?'طريقة الدفع':'PAYMENT METHOD'}</div>
          {[{id:'cash',lbl:ar?'كاش عند الاستلام':'Cash on pickup',ico:'💵'},{id:'card',lbl:'**** 4242 Visa',ico:'💳'},{id:'apple',lbl:'Apple Pay',ico:'🍎'}].map(p=>(
            <div key={p.id} onClick={()=>setPay(p.id)} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.04)', cursor:'pointer' }}>
              <div style={{ width:20, height:20, borderRadius:'50%', border:`2px solid ${pay===p.id?JAG.gold:'rgba(255,255,255,0.2)'}`, background:pay===p.id?JAG.gold:'transparent', flexShrink:0, transition:'all 0.15s' }}/>
              <span style={{ fontSize:18 }}>{p.ico}</span>
              <span style={{ color:JAG.white, fontSize:14, fontFamily:F }}>{p.lbl}</span>
            </div>
          ))}
        </Card>
      </div>
      <div style={{ padding:'12px 16px 16px', borderTop:'1px solid rgba(255,255,255,0.06)', background:JAG.bg }}>
        <GoldBtn onClick={onConfirm}>{ar?'تأكيد الحجز':'Confirm Booking'} — EGP {total.toLocaleString()}</GoldBtn>
      </div>
    </div>
  );
}

function BookingStep4({ onHome, lang }) {
  const ar = lang==='ar';
  const [anim, setAnim] = React.useState(false);
  React.useEffect(()=>{ setTimeout(()=>setAnim(true),100); },[]);
  return (
    <div style={{ width:'100%', height:'100%', background:JAG.bg, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'24px 28px', textAlign:'center' }}>
      <div style={{ marginBottom:28 }}>
        <svg width="110" height="110" viewBox="0 0 110 110">
          <circle cx="55" cy="55" r="50" fill="none" stroke={JAG.gold} strokeWidth="2" opacity="0.12"/>
          <circle cx="55" cy="55" r="50" fill="none" stroke={JAG.gold} strokeWidth="2.5" strokeDasharray="314" strokeDashoffset={anim?0:314} style={{ transition:'stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)', transform:'rotate(-90deg)', transformOrigin:'50% 50%' }}/>
          <polyline points="34,55 48,70 76,38" fill="none" stroke={JAG.gold} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="70" strokeDashoffset={anim?0:70} style={{ transition:'stroke-dashoffset 0.55s ease 0.7s' }}/>
        </svg>
      </div>
      <h1 style={{ color:JAG.white, fontSize:26, fontWeight:900, fontFamily:ar?FAR:F, marginBottom:8 }}>{ar?'تم الحجز بنجاح!':'Booking Confirmed!'}</h1>
      <p style={{ color:JAG.gray, fontSize:14, fontFamily:F, marginBottom:10 }}>{ar?'رقم الحجز':'Booking ID'}</p>
      <div style={{ background:JAG.surface, borderRadius:12, padding:'10px 20px', marginBottom:28, border:`1px solid rgba(201,162,39,0.3)` }}>
        <span style={{ color:JAG.gold, fontSize:17, fontWeight:900, fontFamily:F, letterSpacing:1 }}>#JL-20240606-0042</span>
      </div>
      <Card style={{ width:'100%', marginBottom:24, padding:'12px 16px' }}>
        {[[ar?'السيارة':'Car','Mercedes S-Class'],[ar?'التاريخ':'Date','Jun 6 · 10:00 AM'],[ar?'من':'From','12 Ahmed Hassan St, Maadi'],[ar?'إلى':'To','Cairo Airport T2']].map(([k,v],i)=>(
          <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:i<3?'1px solid rgba(255,255,255,0.04)':'none' }}>
            <span style={{ color:JAG.gray, fontSize:13, fontFamily:F }}>{k}</span>
            <span style={{ color:JAG.white, fontSize:13, fontFamily:F }}>{v}</span>
          </div>
        ))}
      </Card>
      <div style={{ width:'100%', display:'flex', flexDirection:'column', gap:10 }}>
        <GoldBtn onClick={onHome}>{ar?'تتبع الحجز':'Track Booking'}</GoldBtn>
        <OutlineBtn onClick={onHome}>{ar?'العودة للرئيسية':'Back to Home'}</OutlineBtn>
      </div>
    </div>
  );
}

Object.assign(window, { CARS, BookingProgress, BookingStep1, BookingStep2, BookingStep3, BookingStep4 });
