// JAGUAR LIMOUSINE — Home Screen

const REBOOK = [
  { route:'Maadi → Cairo Airport T2', car:'Mercedes S-Class', date:'Jun 2' },
  { route:'Zamalek → New Cairo', car:'BMW 7 Series', date:'May 28' },
];
const HOME_OFFERS = [
  { title:'15% Off Airport Rides', sub:'Code: AIRPORT15', exp:'Ends Jun 10', dark:true },
  { title:'Eid Special — 20% Off', sub:'All rides this weekend', exp:'Ends Jun 8', dark:false },
  { title:'Monthly Plan Discount', sub:'30 rides / month', exp:'Limited time', dark:true },
];

function HomeScreen({ lang, navigate, setBookData }) {
  const ar = lang==='ar';
  const [pickup, setPickup] = React.useState('');
  const [dropoff, setDropoff] = React.useState('');
  const [chip, setChip] = React.useState(0);
  const chips_en = ['Airport Transfer','Hourly','One-Way','Monthly','Corporate'];
  const chips_ar = ['المطار','بالساعة','ذهاب فقط','شهري','شركات'];
  const chips = ar ? chips_ar : chips_en;

  const handleBook = () => {
    setBookData({ pickup: pickup||'12 Ahmed Hassan St, Maadi', dropoff: dropoff||'Cairo International Airport T2' });
    navigate('booking');
  };

  return (
    <div style={{ width:'100%', height:'100%', background:JAG.bg, overflowY:'auto', paddingBottom:72, fontFamily:ar?FAR:F, direction:ar?'rtl':'ltr' }}>

      {/* ── TOP BAR ── */}
      <div style={{ padding:'16px 20px 12px', display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <div style={{ color:JAG.gray, fontSize:13 }}>{ar?'صباح الخير،':'Good morning,'}</div>
          <div style={{ color:JAG.white, fontSize:20, fontWeight:800, marginTop:2 }}>{ar?'أحمد الشربيني':'Ahmed El-Sherbiny'}</div>
          <div style={{ color:JAG.gold, fontSize:12, fontWeight:600, marginTop:3 }}>★ {ar?'عضو ذهبي':'Gold Member'}</div>
        </div>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          <button onClick={()=>navigate('toggleLang')} style={{ background:JAG.surface2, border:`1px solid rgba(201,162,39,0.3)`, borderRadius:8, padding:'5px 10px', color:JAG.gold, fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:F }}>{ar?'EN':'عر'}</button>
          <button onClick={()=>navigate('notifications')} style={{ background:JAG.surface2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, width:42, height:42, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', position:'relative', flexShrink:0 }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill={JAG.white}><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
            <div style={{ position:'absolute', top:8, right:8, width:8, height:8, borderRadius:'50%', background:'#EF5350', border:'1.5px solid #0D0D0D' }}/>
          </button>
        </div>
      </div>

      {/* ── ACTIVE BOOKING BANNER ── */}
      <div style={{ margin:'0 16px 14px', background:'linear-gradient(135deg,#1A4D2E,#0A1F12)', borderRadius:14, padding:'12px 16px', display:'flex', alignItems:'center', gap:12, border:'1px solid rgba(76,175,80,0.25)' }}>
        <Pulse color='#4CAF50'/>
        <div style={{ flex:1 }}>
          <div style={{ color:JAG.white, fontSize:14, fontWeight:700 }}>{ar?'السائق في طريقه إليك':'Driver on the way'}</div>
          <div style={{ color:JAG.gray, fontSize:12, marginTop:2 }}>Ahmed Hassan · ABC 1234 · Mercedes S-Class</div>
        </div>
        <button onClick={()=>navigate('tracking')} style={{ background:JAG.gold, border:'none', borderRadius:8, padding:'6px 12px', color:'#000', fontSize:12, fontWeight:800, cursor:'pointer', fontFamily:F, whiteSpace:'nowrap' }}>{ar?'تتبع':'Track'}</button>
      </div>

      {/* ── QUICK BOOK HERO ── */}
      <div style={{ margin:'0 16px 16px', background:'linear-gradient(155deg,#1A4D2E 0%,#0A2015 60%,#060E09 100%)', borderRadius:20, padding:20, border:'1px solid rgba(46,125,79,0.25)' }}>
        <h2 style={{ color:JAG.white, fontSize:20, fontWeight:800, marginBottom:16 }}>{ar?'إلى أين تريد الذهاب؟':'Where are you going?'}</h2>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <Inp ph={ar?'موقع الانطلاق':'Enter pickup location'} val={pickup} onChange={e=>setPickup(e.target.value)} icon="📍" style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)' }}/>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.08)' }}/>
            <div style={{ width:32, height:32, borderRadius:'50%', background:JAG.gold, display:'flex', alignItems:'center', justifyContent:'center', color:'#000', fontSize:16, flexShrink:0, cursor:'pointer' }}>⇅</div>
            <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.08)' }}/>
          </div>
          <Inp ph={ar?'الوجهة':'Enter drop-off location'} val={dropoff} onChange={e=>setDropoff(e.target.value)} icon="📍" style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)' }}/>
        </div>
        <div style={{ display:'flex', gap:8, marginTop:12 }}>
          {[['📅', ar?'غداً':'Tomorrow'],['🕙', '10:00 AM']].map(([ico,lbl],i)=>(
            <div key={i} style={{ flex:1, height:44, background:'rgba(255,255,255,0.07)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', gap:6, border:'1px solid rgba(255,255,255,0.08)', cursor:'pointer' }}>
              <span>{ico}</span><span style={{ color:JAG.white, fontSize:13 }}>{lbl}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop:14 }}>
          <GoldBtn onClick={handleBook}>{ar?'شاهد السيارات المتاحة':'See Available Cars'}</GoldBtn>
        </div>
      </div>

      {/* ── RIDE TYPE CHIPS ── */}
      <div style={{ paddingLeft:ar?0:16, paddingRight:ar?16:0, marginBottom:10 }}>
        <span style={{ color:JAG.white, fontSize:15, fontWeight:700 }}>{ar?'نوع الرحلة':'Ride Type'}</span>
      </div>
      <div style={{ display:'flex', gap:8, overflowX:'auto', padding:'0 16px 0', paddingBottom:16, scrollbarWidth:'none' }}>
        {chips.map((c,i)=> <Chip key={i} label={c} active={chip===i} onClick={()=>setChip(i)}/>)}
      </div>

      {/* ── QUICK REBOOK ── */}
      <div style={{ padding:'0 16px 0' }}>
        <SHdr title={ar?'أعد الحجز':'Book Again'} link={ar?'عرض الكل':'See All'}/>
        <div style={{ display:'flex', gap:12, overflowX:'auto', paddingBottom:16, scrollbarWidth:'none' }}>
          {REBOOK.map((item,i)=>(
            <div key={i} style={{ background:JAG.surface, borderRadius:14, padding:14, border:'1px solid rgba(255,255,255,0.07)', minWidth:188, flexShrink:0 }}>
              <div style={{ color:JAG.white, fontSize:13, fontWeight:700, marginBottom:4 }}>{item.route}</div>
              <div style={{ color:JAG.gray, fontSize:11, marginBottom:12 }}>{item.car} · {item.date}</div>
              <button onClick={()=>navigate('booking')} style={{ width:'100%', height:34, background:'rgba(201,162,39,0.1)', border:`1px solid rgba(201,162,39,0.3)`, borderRadius:8, color:JAG.gold, fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:F }}>
                {ar?'احجز مجدداً':'Re-Book'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── FAVORITES ── */}
      <div style={{ padding:'0 16px 16px' }}>
        <SHdr title={ar?'المفضلة':'Favorites'}/>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {(ar?[['🏠','المنزل'],['🏢','العمل'],['✈️','المطار']]:[['🏠','Home'],['🏢','Work'],['✈️','Airport']]).map(([ico,lbl],i)=>(
            <div key={i} style={{ background:JAG.surface, border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:'8px 14px', display:'flex', alignItems:'center', gap:6, cursor:'pointer' }}>
              <span style={{ fontSize:14 }}>{ico}</span>
              <span style={{ color:JAG.white, fontSize:13, fontWeight:600 }}>{lbl}</span>
            </div>
          ))}
          <div style={{ background:'transparent', border:`1px dashed rgba(201,162,39,0.4)`, borderRadius:10, padding:'8px 14px', display:'flex', alignItems:'center', gap:6, cursor:'pointer' }}>
            <span style={{ color:JAG.gold, fontSize:18, lineHeight:1 }}>+</span>
            <span style={{ color:JAG.gold, fontSize:13 }}>{ar?'إضافة':'Add New'}</span>
          </div>
        </div>
      </div>

      {/* ── LOYALTY CARD ── */}
      <div style={{ padding:'0 16px 16px' }}>
        <div style={{ background:'linear-gradient(135deg,#C9A227 0%,#8A6A10 55%,#C9A227 100%)', borderRadius:18, padding:20, position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', right:-30, top:-30, width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,0.06)' }}/>
          <div style={{ position:'absolute', right:20, bottom:-40, width:80, height:80, borderRadius:'50%', background:'rgba(255,255,255,0.06)' }}/>
          <div style={{ position:'relative', zIndex:1 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
              <div>
                <div style={{ color:'rgba(0,0,0,0.55)', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:1.2, fontFamily:F }}>{ar?'مكافآت جاغوار':'Jaguar Rewards'}</div>
                <div style={{ color:'#000', fontSize:28, fontWeight:900, fontFamily:F, lineHeight:1.1 }}>{ar?'ذهبي':'GOLD'}</div>
              </div>
              <div style={{ textAlign:ar?'left':'right' }}>
                <div style={{ color:'rgba(0,0,0,0.55)', fontSize:11, fontFamily:F }}>{ar?'نقاطي':'Points'}</div>
                <div style={{ color:'#000', fontSize:28, fontWeight:900, fontFamily:F }}>1,240</div>
              </div>
            </div>
            <div style={{ background:'rgba(0,0,0,0.15)', borderRadius:4, height:6, marginBottom:7 }}>
              <div style={{ height:'100%', borderRadius:4, background:'rgba(0,0,0,0.45)', width:'41%' }}/>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ color:'rgba(0,0,0,0.65)', fontSize:12, fontFamily:F }}>{ar?'560 نقطة للبلاتيني':'560 pts to Platinum'}</span>
              <button onClick={()=>navigate('loyalty')} style={{ background:'rgba(0,0,0,0.15)', border:'none', borderRadius:8, padding:'5px 12px', color:'#000', fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:F }}>
                {ar?'مكافآتي':'View Rewards'} →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── CURRENT OFFERS ── */}
      <div style={{ padding:'0 16px 24px' }}>
        <SHdr title={ar?'العروض الحالية':'Current Offers'} link={ar?'عرض الكل':'See All'} onLink={()=>navigate('offersTab')}/>
        <div style={{ display:'flex', gap:12, overflowX:'auto', paddingBottom:4, scrollbarWidth:'none' }}>
          {HOME_OFFERS.map((o,i)=>(
            <div key={i} style={{ minWidth:200, flexShrink:0, background:o.dark?'linear-gradient(135deg,#1A4D2E,#0D2818)':'linear-gradient(135deg,#3A2800,#1A1000)', borderRadius:14, padding:16, border:'1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ color:JAG.white, fontSize:14, fontWeight:700, marginBottom:4 }}>{o.title}</div>
              <div style={{ color:JAG.gray, fontSize:12, marginBottom:10 }}>{o.sub}</div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ background:'rgba(201,162,39,0.15)', borderRadius:6, padding:'3px 8px', color:JAG.gold, fontSize:11, fontWeight:700, fontFamily:F }}>{o.sub.split(' ').pop()}</span>
                <span style={{ color:JAG.gray, fontSize:11 }}>{o.exp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HomeScreen });
