import React, {useEffect, useState} from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  colors,
  fetchDeviceWeather,
  getHeroTheme,
  type WeatherSummary,
  useAppointments,
} from '../../common';

const defaultWeather: WeatherSummary = {
  requestedLocation: {city: 'Dubai'},
  version: 'local-dev-fallback',
  city: 'Dubai',
  region: 'Dubai',
  country: 'United Arab Emirates',
  tempC: 39,
  feelsLikeC: 45,
  condition: 'Sunny',
  conditionCode: 1000,
  icon: '',
  isDay: true,
  localtime: '',
  source: 'local',
};

const profiles = [
  {name: 'Priya', role: 'You', initial: 'P', color: colors.accent},
  {name: 'Rajesh', role: 'Father', initial: 'R', color: colors.primary},
  {name: 'Aarav', role: 'Child', initial: 'A', color: colors.sky},
  {name: 'Meera', role: 'Mother', initial: 'M', color: '#8065DE'},
];

const insights = [
  {label: 'Steps Today', value: '6,432', hint: '/ 10,000 steps', accent: '#2BC487'},
  {label: 'Heart Rate', value: '72', hint: 'bpm', accent: colors.accent},
  {label: 'Sleep', value: '7h 12m', hint: 'Last night', accent: '#7D5AF2'},
  {label: 'Water Intake', value: '1.6 L', hint: '/ 2.5 L', accent: colors.sky},
  {label: 'Calories', value: '1,420', hint: '/ 2,200 kcal', accent: '#FB7543'},
];

function SidebarItem({label, active}: {label: string; active?: boolean}) {
  return (
    <Pressable style={[styles.sidebarItem, active && styles.sidebarItemActive]}>
      <View style={[styles.sidebarIcon, active && styles.sidebarIconActive]} />
      <Text style={[styles.sidebarItemText, active && styles.sidebarItemTextActive]}>{label}</Text>
    </Pressable>
  );
}

function SectionTitle({title, subtitle}: {title: string; subtitle?: string}) {
  return (
    <View style={styles.sectionTitleRow}>
      <View>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
      </View>
      <Pressable><Text style={styles.viewAll}>View all  ›</Text></Pressable>
    </View>
  );
}

export function TabletHomeScreen() {
  const heroTheme = getHeroTheme();
  const {data: appointments = []} = useAppointments();
  const [weather, setWeather] = useState(defaultWeather);

  useEffect(() => {
    fetchDeviceWeather().then(setWeather).catch(() => undefined);
  }, []);

  const greeting = heroTheme.part === 'night' ? 'Good Evening' : heroTheme.part === 'afternoon' ? 'Good Afternoon' : 'Good Morning';

  return (
    <SafeAreaView edges={['top', 'bottom', 'left', 'right']} style={styles.safeArea}>
      <View style={styles.appShell}>
        <View style={styles.sidebar}>
          <View style={styles.brandRow}>
            <Image source={require('../../../assets/myhealthhub-icon.png')} style={styles.logo} />
            <View><Text style={styles.brandName}>MyHealthHub</Text><Text style={styles.brandSpace}>space</Text></View>
          </View>
          <View style={styles.sidebarNav}>
            <SidebarItem label="Home" active />
            <SidebarItem label="Health" />
            <SidebarItem label="Schedules" />
            <SidebarItem label="Vault" />
            <SidebarItem label="Reports" />
          </View>
          <Text style={styles.quickLabel}>QUICK ACTIONS</Text>
          <View style={styles.sidebarNav}>
            <SidebarItem label="Health Records" />
            <SidebarItem label="Find Nearby Care" />
            <SidebarItem label="Health App Sync" />
            <SidebarItem label="Appointments" />
            <SidebarItem label="Family Profiles" />
          </View>
          <View style={styles.supportCard}>
            <Text style={styles.supportTitle}>One-Call Support</Text>
            <Text style={styles.supportCopy}>Need help? We are just a call away.</Text>
            <Text style={styles.supportNumber}>(+971) 767 647 7775</Text>
          </View>
          <View style={styles.securityCard}><Text style={styles.securityText}>Your health data is secure</Text></View>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentInner} showsVerticalScrollIndicator={false}>
          <ImageBackground source={heroTheme.bannerImage} resizeMode="cover" style={styles.hero} imageStyle={styles.heroImage}>
            <View style={styles.heroOverlay} />
            <View style={styles.topActions}><Text style={styles.notification}>3</Text><View style={styles.profileButton}><Text style={styles.profileButtonText}>P</Text></View><Text style={styles.menuDots}>•••</Text></View>
            <View style={styles.greetingArea}>
              <Text style={styles.greeting}>{greeting}, <Text style={styles.greetingName}>Paaji</Text> ☀</Text>
              <Text style={styles.greetingCopy}>Take charge of your family's health, every day.</Text>
            </View>
            <View style={styles.weather}><Text style={styles.weatherCity}>{weather.city}</Text><Text style={styles.weatherTemp}>☀ {Math.round(weather.tempC)}°C</Text><Text style={styles.weatherCondition}>{weather.condition}</Text></View>
          </ImageBackground>

          <View style={styles.primaryGrid}>
            <View style={styles.familyCard}>
              <SectionTitle title="Family Health Space" subtitle="3 Members" />
              <View style={styles.divider} />
              <Text style={styles.microLabel}>PROFILES</Text>
              <View style={styles.profileRow}>{profiles.map(profile => <View key={profile.name} style={styles.member}><View style={[styles.memberAvatar, {backgroundColor: profile.color}]}><Text style={styles.memberInitial}>{profile.initial}</Text></View><Text style={styles.memberName}>{profile.name}</Text><Text style={styles.memberRole}>{profile.role}</Text></View>)}<View style={styles.member}><View style={styles.addAvatar}><Text style={styles.addText}>+</Text></View><Text style={styles.memberName}>Add</Text><Text style={styles.memberRole}>Member</Text></View></View>
              <View style={styles.healthStatus}><View><Text style={styles.statusLabel}>Overall Health Status</Text><Text style={styles.good}>Good</Text></View><View style={styles.statusDivider} /><View><Text style={styles.statusLabel}>Health Score</Text><Text style={styles.score}>82<Text style={styles.scoreMuted}>/100</Text></Text></View></View>
            </View>
            <View style={styles.rightStack}>
              <View style={styles.compactCard}><SectionTitle title="Upcoming Appointments" subtitle="Top 3 upcoming visits" />{appointments.slice(0, 1).map(appointment => <View key={appointment.id} style={styles.appointmentRow}><View style={styles.doctorAvatar}><Text>Dr</Text></View><View style={styles.grow}><Text style={styles.appointmentName}>{appointment.doctor}</Text><Text style={styles.appointmentMeta}>{appointment.specialty} · {appointment.location}</Text></View><Text style={styles.appointmentDate}>{appointment.date}</Text></View>)}</View>
              <View style={styles.compactCard}><SectionTitle title="Lab Reports & Results" subtitle="Top 3 results in each section" /></View>
              <View style={styles.compactCard}><SectionTitle title="Document Vault" subtitle="Securely stored uploads and records" /></View>
            </View>
          </View>

          <Text style={styles.overviewTitle}>Health Overview</Text>
          <View style={styles.metricsRow}>{insights.map(item => <View key={item.label} style={styles.metricCard}><View style={[styles.metricDot, {backgroundColor: item.accent}]} /><Text style={styles.metricLabel}>{item.label}</Text><Text style={styles.metricValue}>{item.value}</Text><Text style={styles.metricHint}>{item.hint}</Text><View style={styles.metricTrack}><View style={[styles.metricProgress, {backgroundColor: item.accent}]} /></View></View>)}</View>
          <View style={styles.bottomGrid}><View style={styles.bottomCard}><Text style={styles.bottomTitle}>Health Insights</Text><Text style={styles.bottomSub}>Small steps today, stronger tomorrow.</Text><View style={styles.insightPanel}><Text style={styles.insightTitle}>Stay Hydrated</Text><Text style={styles.insightCopy}>You are doing great. Keep drinking water throughout the day.</Text></View></View><View style={styles.bottomCard}><Text style={styles.bottomTitle}>Recent Activity</Text><Text style={styles.bottomSub}>Latest updates from your health space.</Text><Text style={styles.activity}>Blood Test Report uploaded in Reports</Text><Text style={styles.activity}>Appointment confirmed with Dr. Anika Rao</Text></View><View style={styles.bottomCard}><Text style={styles.bottomTitle}>Health Tip of the Day</Text><Text style={styles.quote}>A healthy outside starts from the inside.</Text><Text style={styles.quoteAuthor}>Robert Urich</Text></View></View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: '#F6F9FF'}, appShell: {flex: 1, flexDirection: 'row'}, sidebar: {width: 270, backgroundColor: '#FFF', borderRightColor: '#E6EDF7', borderRightWidth: 1, padding: 22}, brandRow: {flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 34}, logo: {width: 55, height: 55, resizeMode: 'contain'}, brandName: {color: colors.primary, fontSize: 23, fontWeight: '700'}, brandSpace: {color: colors.accent, fontSize: 15, fontStyle: 'italic', textAlign: 'right'}, sidebarNav: {gap: 4}, sidebarItem: {height: 42, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 12}, sidebarItemActive: {backgroundColor: '#FFE5F0'}, sidebarIcon: {width: 14, height: 14, borderRadius: 5, backgroundColor: '#9DB0C9'}, sidebarIconActive: {backgroundColor: colors.accent}, sidebarItemText: {fontSize: 14, color: colors.text, fontWeight: '600'}, sidebarItemTextActive: {color: colors.accent}, quickLabel: {fontSize: 10, color: colors.muted, fontWeight: '800', marginTop: 28, marginBottom: 9}, supportCard: {marginTop: 'auto', borderRadius: 15, backgroundColor: '#FFF0F6', padding: 16}, supportTitle: {color: colors.accent, fontSize: 15, fontWeight: '800'}, supportCopy: {color: colors.text, fontSize: 12, lineHeight: 18, marginTop: 5}, supportNumber: {borderColor: '#FF9AC7', borderWidth: 1, borderRadius: 18, color: colors.accent, fontSize: 12, fontWeight: '800', padding: 9, textAlign: 'center', marginTop: 14}, securityCard: {borderColor: '#BEDAFF', borderWidth: 1, borderRadius: 12, marginTop: 14, padding: 12}, securityText: {fontSize: 11, color: colors.primary, fontWeight: '700'}, content: {flex: 1}, contentInner: {padding: 18, paddingBottom: 40, minWidth: 900}, hero: {height: 190, borderRadius: 18, overflow: 'hidden', marginBottom: 18}, heroImage: {borderRadius: 18}, heroOverlay: {backgroundColor: 'rgba(255,255,255,0.48)', ...StyleSheet.absoluteFillObject}, topActions: {position: 'absolute', top: 18, right: 20, flexDirection: 'row', alignItems: 'center', gap: 14}, notification: {backgroundColor: colors.accent, borderRadius: 16, color: '#FFF', fontSize: 12, fontWeight: '800', height: 25, overflow: 'hidden', paddingTop: 5, textAlign: 'center', width: 25}, profileButton: {width: 40, height: 40, borderRadius: 20, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center'}, profileButtonText: {color: '#FFF', fontSize: 17, fontWeight: '800'}, menuDots: {fontSize: 18, color: colors.text, letterSpacing: 2}, greetingArea: {position: 'absolute', left: 28, bottom: 28}, greeting: {color: colors.accent, fontSize: 28, fontWeight: '800'}, greetingName: {color: colors.primary}, greetingCopy: {color: '#374D70', fontSize: 14, marginTop: 8}, weather: {position: 'absolute', right: 25, bottom: 28, alignItems: 'flex-end'}, weatherCity: {color: colors.text, fontSize: 16, fontWeight: '700'}, weatherTemp: {color: colors.accent, fontSize: 27, fontWeight: '800'}, weatherCondition: {color: colors.muted, fontSize: 13}, primaryGrid: {flexDirection: 'row', gap: 16}, familyCard: {backgroundColor: '#FFF', borderColor: '#E4ECF5', borderWidth: 1, borderRadius: 17, padding: 20, flex: 1.18, shadowColor: colors.shadow, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2}, rightStack: {flex: 0.94, gap: 11}, compactCard: {backgroundColor: '#FFF', borderColor: '#E4ECF5', borderWidth: 1, borderRadius: 17, padding: 16, minHeight: 104}, sectionTitleRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'}, sectionTitle: {color: colors.text, fontSize: 17, fontWeight: '800'}, sectionSubtitle: {color: colors.muted, fontSize: 12, marginTop: 4}, viewAll: {color: colors.accent, fontSize: 12, fontWeight: '800'}, divider: {height: 1, backgroundColor: '#EEF2F8', marginVertical: 16}, microLabel: {color: colors.muted, fontSize: 10, fontWeight: '800'}, profileRow: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 14}, member: {alignItems: 'center', flex: 1}, memberAvatar: {height: 51, width: 51, borderRadius: 26, alignItems: 'center', justifyContent: 'center', borderColor: '#FFF', borderWidth: 3}, memberInitial: {color: '#FFF', fontSize: 21, fontWeight: '800'}, memberName: {color: colors.text, fontSize: 12, fontWeight: '800', marginTop: 6}, memberRole: {color: colors.muted, fontSize: 10, marginTop: 2}, addAvatar: {height: 51, width: 51, borderRadius: 26, backgroundColor: '#F1F6FD', alignItems: 'center', justifyContent: 'center'}, addText: {color: colors.primary, fontSize: 31, fontWeight: '300'}, healthStatus: {backgroundColor: '#FBFDFF', borderColor: '#E6EDF7', borderWidth: 1, borderRadius: 13, flexDirection: 'row', justifyContent: 'space-around', marginTop: 22, padding: 14}, statusLabel: {color: colors.muted, fontSize: 11}, good: {color: colors.accent, fontSize: 18, fontWeight: '800', marginTop: 4}, statusDivider: {backgroundColor: '#E4ECF5', width: 1}, score: {color: colors.primary, fontSize: 20, fontWeight: '800', marginTop: 3}, scoreMuted: {color: colors.muted, fontSize: 12}, appointmentRow: {alignItems: 'center', borderColor: '#E7EDF7', borderRadius: 12, borderWidth: 1, flexDirection: 'row', marginTop: 14, padding: 10}, doctorAvatar: {alignItems: 'center', backgroundColor: '#EAF4FF', borderRadius: 19, height: 38, justifyContent: 'center', width: 38}, grow: {flex: 1, marginLeft: 10}, appointmentName: {color: colors.text, fontSize: 13, fontWeight: '800'}, appointmentMeta: {color: colors.muted, fontSize: 10, marginTop: 3}, appointmentDate: {color: colors.primary, fontSize: 10, fontWeight: '700', maxWidth: 85, textAlign: 'right'}, overviewTitle: {color: colors.primaryDark, fontSize: 17, fontWeight: '800', marginTop: 20, marginBottom: 11}, metricsRow: {flexDirection: 'row', gap: 10}, metricCard: {backgroundColor: '#FFF', borderColor: '#E4ECF5', borderWidth: 1, borderRadius: 15, flex: 1, minHeight: 138, padding: 14}, metricDot: {borderRadius: 13, height: 26, width: 26}, metricLabel: {color: colors.text, fontSize: 11, fontWeight: '700', marginTop: 9}, metricValue: {color: colors.primaryDark, fontSize: 20, fontWeight: '800', marginTop: 3}, metricHint: {color: colors.muted, fontSize: 10, marginTop: 2}, metricTrack: {backgroundColor: '#E8EDF5', borderRadius: 2, height: 5, marginTop: 12, overflow: 'hidden'}, metricProgress: {borderRadius: 2, height: 5, width: '64%'}, bottomGrid: {flexDirection: 'row', gap: 12, marginTop: 17}, bottomCard: {backgroundColor: '#FFF', borderColor: '#E4ECF5', borderWidth: 1, borderRadius: 15, flex: 1, minHeight: 160, padding: 16}, bottomTitle: {color: colors.accent, fontSize: 15, fontWeight: '800'}, bottomSub: {color: colors.muted, fontSize: 11, marginTop: 4}, insightPanel: {backgroundColor: '#FFF4F8', borderRadius: 10, marginTop: 14, padding: 12}, insightTitle: {color: colors.text, fontSize: 12, fontWeight: '800'}, insightCopy: {color: colors.muted, fontSize: 11, lineHeight: 16, marginTop: 5}, activity: {borderBottomColor: '#EDF1F7', borderBottomWidth: 1, color: colors.text, fontSize: 11, paddingVertical: 12}, quote: {color: colors.text, fontSize: 14, fontWeight: '700', lineHeight: 22, marginTop: 22}, quoteAuthor: {color: colors.muted, fontSize: 11, marginTop: 11},
});
