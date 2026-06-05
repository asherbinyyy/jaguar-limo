import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { C } from '../constants';
import { t, Lang } from '../i18n';

interface Props { onBack: () => void; lang: Lang }

const NOTIFS = [
  { ico:'🟢', titleEn:'Booking Confirmed ✓', titleAr:'تم تأكيد الحجز', bodyEn:'Your ride on Jun 6 is confirmed. #JL-042', bodyAr:'حجزك #JL-042 مؤكد ليوم 6 يونيو', timeEn:'Just now', timeAr:'الآن', unread:true },
  { ico:'🚗', titleEn:'Driver Assigned', titleAr:'السائق معيّن', bodyEn:'Ahmed Hassan is your driver. Mercedes · ABC 1234', bodyAr:'أحمد حسان هو سائقك · ABC 1234', timeEn:'2 min ago', timeAr:'منذ دقيقتين', unread:true },
  { ico:'📍', titleEn:'Driver is 5 min away', titleAr:'السائق قريب', bodyEn:'Get ready! Track your driver live.', bodyAr:'السائق على بعد 5 دقائق من موقعك', timeEn:'10 min ago', timeAr:'منذ 10 دقائق', unread:true },
  { ico:'⭐', titleEn:'You earned 100 points! ⭐', titleAr:'نقاط مكتسبة!', bodyEn:'Total balance: 1,240 pts. 560 to Platinum.', bodyAr:'رصيدك الحالي: 1,240 نقطة', timeEn:'1 hr ago', timeAr:'منذ ساعة', unread:false },
  { ico:'🎁', titleEn:'New Offer for You 🎁', titleAr:'عرض جديد لك', bodyEn:'Eid Special: 20% off this weekend', bodyAr:'عيد خاص: 20% خصم هذا الأسبوع', timeEn:'3 hrs ago', timeAr:'منذ 3 ساعات', unread:false },
  { ico:'💳', titleEn:'Payment Received', titleAr:'تم الدفع', bodyEn:'EGP 765 charged successfully', bodyAr:'تم خصم 765 جنيه بنجاح', timeEn:'Yesterday', timeAr:'أمس', unread:false },
];

export default function NotificationsScreen({ onBack, lang }: Props) {
  const ar = lang === 'ar';
  const [notifs, setNotifs] = useState(NOTIFS);

  const markAll = () => setNotifs(n => n.map(x => ({ ...x, unread: false })));

  return (
    <View style={styles.container}>
      <View style={[styles.header, ar && styles.rowRtl]}>
        <View style={[styles.headerLeft, ar && styles.rowRtl]}>
          <Pressable onPress={onBack}>
            <Text style={styles.back}>{ar ? '→' : '←'}</Text>
          </Pressable>
          <Text style={styles.title}>{t(lang, 'notifications')}</Text>
        </View>
        <Pressable onPress={markAll}>
          <Text style={styles.markAll}>{t(lang, 'markAllRead')}</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {notifs.map((n, i) => (
          <Pressable
            key={i}
            onPress={() => setNotifs(prev => prev.map((x, j) => j===i ? {...x, unread:false} : x))}
            style={[styles.item, n.unread && styles.itemUnread, ar && styles.rowRtl]}
          >
            <View style={styles.iconWrap}>
              <Text style={styles.icon}>{n.ico}</Text>
            </View>
            <View style={styles.textWrap}>
              <View style={[styles.titleRow, ar && styles.rowRtl]}>
                <Text style={[styles.notifTitle, ar && styles.rtl]} numberOfLines={1}>
                  {ar ? n.titleAr : n.titleEn}
                </Text>
                {n.unread && <View style={styles.unreadDot} />}
              </View>
              <Text style={[styles.body, ar && styles.rtl]} numberOfLines={2}>
                {ar ? n.bodyAr : n.bodyEn}
              </Text>
              <Text style={styles.time}>{ar ? n.timeAr : n.timeEn}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' },
  rowRtl: { flexDirection: 'row-reverse' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  back: { color: C.gold, fontSize: 22, fontWeight: '600' },
  title: { color: C.white, fontSize: 20, fontWeight: '800' },
  markAll: { color: C.gold, fontSize: 12, fontWeight: '600' },
  item: { flexDirection: 'row', gap: 14, padding: 14, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  itemUnread: { backgroundColor: 'rgba(201,162,39,0.03)' },
  iconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  icon: { fontSize: 20 },
  textWrap: { flex: 1, minWidth: 0 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  notifTitle: { color: C.white, fontSize: 14, fontWeight: '700', flex: 1 },
  rtl: { textAlign: 'right' },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.gold, marginTop: 3, marginLeft: 8, flexShrink: 0 },
  body: { color: C.gray, fontSize: 12, lineHeight: 18, marginBottom: 4 },
  time: { color: C.grayDark, fontSize: 11 },
});
