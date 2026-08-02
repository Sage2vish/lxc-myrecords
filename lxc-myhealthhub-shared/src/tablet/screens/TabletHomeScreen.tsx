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
import {
  colors,
  fetchDeviceWeather,
  getHeroTheme,
  type WeatherSummary,
  useAppointments,
} from '../../common';
import {TabletDetailPanel} from '../components/TabletDetailPanel';
import {tabletDetails, type TabletDetailKey, type TabletSectionKey} from '../tabletTypes';

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

function SectionTitle({title, subtitle}: {title: string; subtitle?: string}) {
  return (
    <View style={styles.sectionTitleRow}>
      <View>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
      </View>
      <Text style={styles.viewAll}>View all  ›</Text>
    </View>
  );
}

export function TabletHomeScreen({
  activeDetail,
  onNavigateSection,
  onOpenDetail,
}: {
  activeDetail: TabletDetailKey;
  onNavigateSection: (section: TabletSectionKey) => void;
  onOpenDetail: (detail: TabletDetailKey) => void;
}) {
  const heroTheme = getHeroTheme();
  const {data: appointments = []} = useAppointments();
  const [weather, setWeather] = useState(defaultWeather);

  useEffect(() => {
    fetchDeviceWeather().then(setWeather).catch(() => undefined);
  }, []);

  const greeting =
    heroTheme.part === 'night'
      ? 'Good Evening'
      : heroTheme.part === 'afternoon'
        ? 'Good Afternoon'
        : 'Good Morning';
  const daypartCopy = {
    day: {
      label: 'Morning focus',
      body: 'Start with a clear family snapshot and the next appointment on deck.',
      tint: '#F7F9FF',
    },
    afternoon: {
      label: 'Midday check-in',
      body: 'Keep the dashboard bright and readable while the day is still active.',
      tint: '#F3FBFF',
    },
    evening: {
      label: 'Evening review',
      body: 'Shift the layout toward winding down, summary reading, and quick follow-ups.',
      tint: '#F7F5FF',
    },
    night: {
      label: 'Night wrap-up',
      body: 'Use the calmest treatment for end-of-day review and tomorrow planning.',
      tint: '#F5F8FF',
    },
  }[heroTheme.part];

  const nextAppointment = appointments[0];

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <ImageBackground
        source={heroTheme.bannerImage}
        resizeMode="cover"
        style={styles.hero}
        imageStyle={styles.heroImage}>
        <View style={[styles.heroOverlay, {backgroundColor: `${heroTheme.glowColor}22`}]} />
        <View style={[styles.daypartBadge, {backgroundColor: daypartCopy.tint}]}>
          <Text style={[styles.daypartLabel, {color: heroTheme.backgroundColor}]}>{daypartCopy.label}</Text>
        </View>
        <View style={styles.topActions}>
          <View style={styles.iconPill}>
            <Text style={styles.iconPillText}>3</Text>
          </View>
          <View style={styles.profileButton}>
            <Text style={styles.profileButtonText}>P</Text>
          </View>
          <Text style={styles.menuDots}>•••</Text>
        </View>
        <View style={styles.greetingArea}>
          <Text style={styles.greeting}>
            {greeting}, <Text style={styles.greetingName}>Paaji</Text> ☀
          </Text>
          <Text style={styles.greetingCopy}>Take charge of your family&apos;s health, every day.</Text>
          <Text style={styles.daypartCopy}>{daypartCopy.body}</Text>
        </View>
        <View style={styles.weather}>
          <Text style={styles.weatherCity}>{weather.city}</Text>
          <Text style={styles.weatherTemp}>☀ {Math.round(weather.tempC)}°C</Text>
          <Text style={styles.weatherCondition}>{weather.condition}</Text>
        </View>
      </ImageBackground>

      <View style={styles.primaryGrid}>
        <View style={styles.familyCard}>
          <SectionTitle title="Family Health Space" subtitle="3 Members" />
          <View style={styles.divider} />
          <Text style={styles.microLabel}>PROFILES</Text>
          <View style={styles.profileRow}>
            {profiles.map(profile => (
              <Pressable
                key={profile.name}
                accessibilityRole="button"
                onPress={() => onOpenDetail('family-profiles')}
                style={styles.member}>
                <View style={[styles.memberAvatar, {backgroundColor: profile.color}]}>
                  <Text style={styles.memberInitial}>{profile.initial}</Text>
                </View>
                <Text style={styles.memberName}>{profile.name}</Text>
                <Text style={styles.memberRole}>{profile.role}</Text>
              </Pressable>
            ))}
            <Pressable
              accessibilityRole="button"
              onPress={() => onOpenDetail('family-profiles')}
              style={styles.member}>
              <View style={styles.addAvatar}>
                <Text style={styles.addText}>+</Text>
              </View>
              <Text style={styles.memberName}>Add</Text>
              <Text style={styles.memberRole}>Member</Text>
            </Pressable>
          </View>
          <View style={styles.healthStatus}>
            <View>
              <Text style={styles.statusLabel}>Overall Health Status</Text>
              <Text style={styles.good}>Good</Text>
            </View>
            <View style={styles.statusDivider} />
            <View>
              <Text style={styles.statusLabel}>Health Score</Text>
              <Text style={styles.score}>
                82<Text style={styles.scoreMuted}>/100</Text>
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.rightStack}>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              onNavigateSection('schedules');
              onOpenDetail('appointments');
            }}
            style={styles.compactCard}>
            <SectionTitle title="Upcoming Appointments" subtitle="Top upcoming visits" />
            {nextAppointment ? (
              <View style={styles.appointmentRow}>
                <View style={styles.doctorAvatar}>
                  <Text style={styles.doctorAvatarText}>Dr</Text>
                </View>
                <View style={styles.grow}>
                  <Text style={styles.appointmentName}>{nextAppointment.doctor}</Text>
                  <Text style={styles.appointmentMeta}>
                    {nextAppointment.specialty} · {nextAppointment.location}
                  </Text>
                </View>
                <Text style={styles.appointmentDate}>{nextAppointment.date}</Text>
              </View>
            ) : null}
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => {
              onNavigateSection('reports');
              onOpenDetail('lab-reports');
            }}
            style={styles.compactCard}>
            <SectionTitle title="Lab Reports & Results" subtitle="Top results at a glance" />
            <View style={styles.compactSummaryRow}>
              <View style={[styles.summaryPill, {backgroundColor: colors.primarySoft}]}>
                <Text style={styles.summaryPillLabel}>Ready</Text>
              </View>
              <Text style={styles.compactSummaryText}>3 new reports reviewed this week</Text>
            </View>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => {
              onNavigateSection('vault');
              onOpenDetail('document-vault');
            }}
            style={styles.compactCard}>
            <SectionTitle title="Document Vault" subtitle="Securely stored uploads and records" />
            <View style={styles.compactSummaryRow}>
              <View style={[styles.summaryPill, {backgroundColor: colors.accentSoft}]}>
                <Text style={styles.summaryPillLabel}>Encrypted</Text>
              </View>
              <Text style={styles.compactSummaryText}>Latest uploads and family records available</Text>
            </View>
          </Pressable>
        </View>
      </View>

      <TabletDetailPanel {...tabletDetails[activeDetail]} />

      <Text style={styles.overviewTitle}>Health Overview</Text>
      <View style={styles.metricsRow}>
        {insights.map(item => (
          <View key={item.label} style={styles.metricCard}>
            <View style={[styles.metricDot, {backgroundColor: item.accent}]} />
            <Text style={styles.metricLabel}>{item.label}</Text>
            <Text style={styles.metricValue}>{item.value}</Text>
            <Text style={styles.metricHint}>{item.hint}</Text>
            <View style={styles.metricTrack}>
              <View style={[styles.metricProgress, {backgroundColor: item.accent}]} />
            </View>
          </View>
        ))}
      </View>

      <View style={styles.bottomGrid}>
        <View style={styles.bottomCard}>
          <Text style={styles.bottomTitle}>Health Insights</Text>
          <Text style={styles.bottomSub}>Small steps today, stronger tomorrow.</Text>
          <View style={styles.insightPanel}>
            <Text style={styles.insightTitle}>Stay Hydrated</Text>
            <Text style={styles.insightCopy}>
              You are doing great. Keep drinking water throughout the day.
            </Text>
          </View>
        </View>
        <View style={styles.bottomCard}>
          <Text style={styles.bottomTitle}>Recent Activity</Text>
          <Text style={styles.bottomSub}>Latest updates from your health space.</Text>
          <Text style={styles.activity}>Blood Test Report uploaded in Reports</Text>
          <Text style={styles.activity}>Appointment confirmed with Dr. Anika Rao</Text>
        </View>
        <View style={styles.bottomCard}>
          <Text style={styles.bottomTitle}>Health Tip of the Day</Text>
          <Text style={styles.quote}>A healthy outside starts from the inside.</Text>
          <Text style={styles.quoteAuthor}>Robert Urich</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    width: '100%',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 40,
  },
  hero: {
    height: 200,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 18,
  },
  heroImage: {
    borderRadius: 18,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  daypartBadge: {
    position: 'absolute',
    left: 28,
    top: 20,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  daypartLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  topActions: {
    position: 'absolute',
    top: 18,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconPill: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPillText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '800',
  },
  menuDots: {
    fontSize: 18,
    color: colors.text,
    letterSpacing: 2,
  },
  greetingArea: {
    position: 'absolute',
    left: 28,
    bottom: 28,
  },
  greeting: {
    color: colors.accent,
    fontSize: 28,
    fontWeight: '800',
  },
  greetingName: {
    color: colors.primary,
  },
  greetingCopy: {
    color: '#374D70',
    fontSize: 14,
    marginTop: 8,
  },
  daypartCopy: {
    color: '#2D4064',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
    maxWidth: 430,
  },
  weather: {
    position: 'absolute',
    right: 25,
    bottom: 28,
    alignItems: 'flex-end',
  },
  weatherCity: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  weatherTemp: {
    color: colors.accent,
    fontSize: 27,
    fontWeight: '800',
  },
  weatherCondition: {
    color: colors.muted,
    fontSize: 13,
  },
  primaryGrid: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'stretch',
  },
  familyCard: {
    backgroundColor: '#FFF',
    borderColor: '#E4ECF5',
    borderWidth: 1,
    borderRadius: 17,
    padding: 20,
    flex: 1.18,
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  rightStack: {
    flex: 0.94,
    gap: 11,
    minWidth: 320,
  },
  compactCard: {
    backgroundColor: '#FFF',
    borderColor: '#E4ECF5',
    borderWidth: 1,
    borderRadius: 17,
    padding: 16,
    minHeight: 104,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 4,
  },
  viewAll: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEF2F8',
    marginVertical: 16,
  },
  microLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '800',
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  member: {
    alignItems: 'center',
    flex: 1,
  },
  memberAvatar: {
    height: 51,
    width: 51,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#FFF',
    borderWidth: 3,
  },
  memberInitial: {
    color: '#FFF',
    fontSize: 21,
    fontWeight: '800',
  },
  memberName: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 6,
  },
  memberRole: {
    color: colors.muted,
    fontSize: 10,
    marginTop: 2,
  },
  addAvatar: {
    height: 51,
    width: 51,
    borderRadius: 26,
    backgroundColor: '#F1F6FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    color: colors.primary,
    fontSize: 31,
    fontWeight: '300',
  },
  healthStatus: {
    backgroundColor: '#FBFDFF',
    borderColor: '#E6EDF7',
    borderWidth: 1,
    borderRadius: 13,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 22,
    padding: 14,
  },
  statusLabel: {
    color: colors.muted,
    fontSize: 11,
  },
  good: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 4,
  },
  statusDivider: {
    backgroundColor: '#E4ECF5',
    width: 1,
  },
  score: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 3,
  },
  scoreMuted: {
    color: colors.muted,
    fontSize: 12,
  },
  appointmentRow: {
    alignItems: 'center',
    borderColor: '#E7EDF7',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: 14,
    padding: 10,
  },
  doctorAvatar: {
    alignItems: 'center',
    backgroundColor: '#EAF4FF',
    borderRadius: 19,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  doctorAvatarText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  grow: {
    flex: 1,
    marginLeft: 10,
  },
  appointmentName: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
  },
  appointmentMeta: {
    color: colors.muted,
    fontSize: 10,
    marginTop: 3,
  },
  appointmentDate: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '700',
    maxWidth: 85,
    textAlign: 'right',
  },
  compactSummaryRow: {
    marginTop: 10,
    gap: 8,
  },
  summaryPill: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  summaryPillLabel: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  compactSummaryText: {
    color: colors.text,
    fontSize: 12,
    lineHeight: 18,
  },
  overviewTitle: {
    color: colors.primaryDark,
    fontSize: 17,
    fontWeight: '800',
    marginTop: 20,
    marginBottom: 11,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  metricCard: {
    backgroundColor: '#FFF',
    borderColor: '#E4ECF5',
    borderWidth: 1,
    borderRadius: 15,
    flexGrow: 1,
    flexBasis: 180,
    minHeight: 138,
    padding: 14,
  },
  metricDot: {
    borderRadius: 13,
    height: 26,
    width: 26,
  },
  metricLabel: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 9,
  },
  metricValue: {
    color: colors.primaryDark,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 3,
  },
  metricHint: {
    color: colors.muted,
    fontSize: 10,
    marginTop: 2,
  },
  metricTrack: {
    backgroundColor: '#E8EDF5',
    borderRadius: 2,
    height: 5,
    marginTop: 12,
    overflow: 'hidden',
  },
  metricProgress: {
    borderRadius: 2,
    height: 5,
    width: '64%',
  },
  bottomGrid: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    marginTop: 17,
  },
  bottomCard: {
    backgroundColor: '#FFF',
    borderColor: '#E4ECF5',
    borderWidth: 1,
    borderRadius: 15,
    flexGrow: 1,
    flexBasis: 240,
    minHeight: 160,
    padding: 16,
  },
  bottomTitle: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: '800',
  },
  bottomSub: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 4,
  },
  insightPanel: {
    backgroundColor: '#FFF4F8',
    borderRadius: 10,
    marginTop: 14,
    padding: 12,
  },
  insightTitle: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '800',
  },
  insightCopy: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 5,
  },
  activity: {
    borderBottomColor: '#EDF1F7',
    borderBottomWidth: 1,
    color: colors.text,
    fontSize: 11,
    paddingVertical: 12,
  },
  quote: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 22,
    marginTop: 22,
  },
  quoteAuthor: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 11,
  },
});
