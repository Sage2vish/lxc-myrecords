// ============================================================================
// FILE        : AppointmentsScreen.tsx
// PROJECT     : LXC-Health
// AUTHOR      : Vishal Kumar
// UPDATED BY  : Vishal Kumar
// VERSION     : 1.0.0
// DATE-TIME   : 26-July-2026 | 00:00 Hrs
//
// PURPOSE     : Appointments landing screen. Reuses the shared top hero shell
//               and keeps the screen-specific appointment cards, agenda, quick
//               actions, and follow-up surfaces in this feature folder.
// ============================================================================

import React, {useEffect, useMemo, useState} from 'react';
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAccountMenu} from '../../context/AccountMenuContext';
import {fetchDeviceWeather, type WeatherSummary} from '../../api/weather';
import {PageBackground, TopGlassHeader, TopScreenInfo} from '../../components/ScreenChrome';
import {colors} from '../../theme/colors';
import {getHeroTheme} from '../../theme/dayparts';
import {fontSizes, fontWeights} from '../../theme/typography';
import {radii} from '../../theme/radii';
import {spacing} from '../../theme/spacing';
import type {RootTabParamList} from '../../navigation/RootNavigator';
import {useAppointments} from '../../hooks/useHealthData';
import {
  appointmentQuickActions,
  appointmentStats,
  followUpBanner,
  mapHealthAppointmentToPreview,
  upcomingAppointmentsPreview,
} from './appointmentsData';
import {AppointmentListItem} from './components/AppointmentListItem';
import {AppointmentStatsGrid} from './components/AppointmentStatsGrid';

export function AppointmentsScreen() {
  const {openMenu} = useAccountMenu();
  const {data = [], isLoading} = useAppointments();
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const heroTheme = getHeroTheme();
  const [weather, setWeather] = useState<WeatherSummary | null>(null);
  const [agendaExpanded, setAgendaExpanded] = useState(false);

  useEffect(() => {
    let mounted = true;

    fetchDeviceWeather()
      .then(result => {
        if (mounted) {
          setWeather(result);
        }
      })
      .catch(() => {
        if (mounted) {
          setWeather(null);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const appointments = useMemo(() => {
    if (data.length > 0) {
      return data.map((appointment, index) => mapHealthAppointmentToPreview(appointment, index));
    }

    return upcomingAppointmentsPreview;
  }, [data]);

  const visibleAppointments = agendaExpanded ? appointments.slice(0, 3) : appointments.slice(0, 1);
  const nextAppointment = appointments[0];

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.root}>
      <PageBackground backgroundImage={heroTheme.bannerImage}>
        <TopGlassHeader
          onPressMenu={openMenu}
          onPressProfile={() => navigation.navigate('Profile')}
          onPressNotifications={() => navigation.navigate('Notifications')}
        />
        <TopScreenInfo
          city={weather?.city ?? 'Dubai'}
          temperature={weather ? `${Math.round(weather.tempC)}°C` : '--°C'}
        />
      </PageBackground>

      <ScrollView
        bounces
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
      <View style={styles.appointmentCard}>
        <View style={styles.cardHeader}>
          <View style={styles.familyTitleRow}>
            <View style={styles.headerBubble}>
              <Image
                source={require('../../../assets/appointment-badge-icon.png')}
                style={styles.cardBadgeImage}
              />
            </View>
            <View style={styles.titleTextWrap}>
              <Text style={styles.cardTitle}>Upcoming Appointments</Text>
              <Text style={styles.membersCount}>{appointments.length} Visits</Text>
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate('ScheduleVisit')}
            style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View all</Text>
            <Text style={styles.viewAllArrow}>›</Text>
          </Pressable>
        </View>

        <View style={styles.profileGroupCard}>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => setAgendaExpanded(value => !value)}
            style={styles.profileGroupHeader}>
            <View style={styles.profileGroupHeaderLeft}>
              <View style={styles.profileHeaderTitleRow}>
                <View style={styles.profileSelfBadge}>
                  <Image
                    source={require('../../../assets/appointment-icon.png')}
                    style={styles.profileSelfBadgeImage}
                  />
                </View>
                <View style={styles.profileHeaderTitleCopy}>
                  <Text style={styles.profileSectionLabel}>Agenda</Text>
                  <Text style={styles.profileGroupHint}>Top upcoming visits</Text>
                </View>
              </View>
            </View>
            <View style={styles.profileGroupHeaderRight}>
              <Text style={styles.membersCount}>
                {agendaExpanded ? 3 : 1} Appointment{agendaExpanded ? 's' : ''}
              </Text>
              <View style={styles.profileChevronPill}>
                <Text style={styles.profileChevron}>{agendaExpanded ? '−' : '+'}</Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.profileGroupBody}>
            {agendaExpanded ? (
              <View style={styles.listCard}>
                {isLoading ? <Text style={styles.loading}>Loading appointments...</Text> : null}
                {visibleAppointments.map((appointment, index, visibleItems) => (
                  <AppointmentListItem
                    key={`${appointment.name}-${appointment.date}`}
                    appointment={appointment}
                    last={index === visibleItems.length - 1}
                  />
                ))}
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.healthStrip}>
          <View style={styles.healthMetric}>
            <View style={styles.metricIcon}>
              <Image
                source={require('../../../assets/appointment-badge-icon.png')}
                style={styles.metricIconImage}
              />
            </View>
            <View style={styles.metricTextWrap}>
              <Text style={styles.metricLabel}>Today’s Schedule</Text>
              <Text style={styles.goodStatus}>{appointments.length} Appointments</Text>
            </View>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.healthMetric}>
            <Text style={styles.scoreIcon}>⌁</Text>
            <View style={styles.metricTextWrap}>
              <Text style={styles.metricLabel}>Next Appointment</Text>
              <Text style={styles.score}>
                <Text style={styles.scoreNumber}>{nextAppointment?.time ?? '11:30 AM'}</Text>
              </Text>
              <Text style={styles.goodStatusSub}>{nextAppointment?.date ?? 'Today'}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.featureCard}>
        <View style={styles.sectionHead}>
          <View>
            <Text style={styles.sectionTitle}>Appointment Overview</Text>
            <Text style={styles.sectionSubtitle}>This month at a glance</Text>
          </View>
          <Text style={styles.sectionCaption}>This Month</Text>
        </View>
        <AppointmentStatsGrid stats={appointmentStats} />
      </View>

      <View style={styles.featureCard}>
        <View style={styles.sectionHead}>
          <View>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <Text style={styles.sectionSubtitle}>Fast shortcuts for booking and follow-ups</Text>
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.actionsRow}>
          {appointmentQuickActions.map(action => (
            <View key={action.key} style={[styles.actionCard, {backgroundColor: action.tone}]}>
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={[styles.featureCard, styles.bannerCard]}>
        <Image source={require('../../../assets/appointment-icon.png')} style={styles.bannerIcon} />
        <View style={styles.bannerCopy}>
          <Text style={styles.bannerTitle}>{followUpBanner.title}</Text>
          <Text style={styles.bannerBody}>{followUpBanner.body}</Text>
        </View>
        <Pressable accessibilityRole="button" style={styles.bannerButton}>
          <Text style={styles.bannerButtonText}>{followUpBanner.cta}</Text>
        </Pressable>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : colors.background,
  },
  scroll: {
    flex: 1,
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : colors.background,
  },
  content: {
    paddingBottom: 32,
  },
  appointmentCard: {
    marginHorizontal: 9,
    marginTop: -108,
    padding: 8,
    borderRadius: radii.card,
    backgroundColor: colors.surface,
    shadowColor: colors.shadow,
    shadowOpacity: 0.14,
    shadowRadius: 28,
    shadowOffset: {width: 0, height: 16},
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  familyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentSoft,
    overflow: 'hidden',
  },
  titleTextWrap: {
    flex: 1,
  },
  cardBadgeImage: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
  cardTitle: {
    color: colors.text,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.medium,
  },
  membersCount: {
    color: colors.primary,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
    marginTop: 2,
  },
  viewAllButton: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radii.pill,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  viewAllText: {
    color: colors.primary,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
  },
  viewAllArrow: {
    color: colors.primary,
    fontSize: 16,
    marginTop: -1,
  },
  profileGroupCard: {
    marginTop: 8,
    borderRadius: radii['2xl'],
    borderWidth: 1,
    borderColor: '#E4ECF5',
    backgroundColor: 'rgba(247,251,255,0.92)',
    overflow: 'hidden',
  },
  profileGroupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  profileGroupHeaderLeft: {
    flex: 1,
  },
  profileHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileSelfBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  profileSelfBadgeImage: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  profileHeaderTitleCopy: {
    gap: 1,
  },
  profileSectionLabel: {
    color: colors.muted,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  profileGroupHint: {
    color: colors.greetingSubGrey,
    fontSize: fontSizes.xs,
  },
  profileGroupHeaderRight: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  profileChevronPill: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  profileChevron: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: fontWeights.bold,
    marginTop: -1,
  },
  profileGroupBody: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
  },
  listCard: {
    backgroundColor: colors.primarySoft,
    borderRadius: radii['2xl'],
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  healthStrip: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radii['2xl'],
    flexDirection: 'row',
    marginTop: 8,
    padding: spacing.sm,
  },
  healthMetric: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    overflow: 'hidden',
  },
  metricIconImage: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
  metricTextWrap: {
    flex: 1,
  },
  metricLabel: {
    color: colors.muted,
    fontSize: fontSizes.xs,
  },
  goodStatus: {
    color: colors.primary,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
  },
  goodStatusSub: {
    color: colors.muted,
    fontSize: fontSizes.xs,
    marginTop: 2,
  },
  scoreIcon: {
    color: colors.primary,
    fontSize: 18,
    marginRight: 8,
    fontWeight: fontWeights.bold,
  },
  score: {
    color: colors.muted,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
  },
  scoreNumber: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: fontWeights.bold,
  },
  metricDivider: {
    width: 1,
    height: 36,
    marginHorizontal: 8,
    backgroundColor: '#DCEBFA',
  },
  featureCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    marginHorizontal: 9,
    marginTop: 9,
    padding: 10,
    shadowColor: colors.shadow,
    shadowOpacity: 0.14,
    shadowRadius: 28,
    shadowOffset: {width: 0, height: 16},
    elevation: 5,
  },
  sectionHead: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: fontSizes.lg16,
    fontWeight: fontWeights.bold,
  },
  sectionSubtitle: {
    color: colors.muted,
    fontSize: fontSizes.xs,
    marginTop: 2,
  },
  sectionCaptionRow: {
    alignItems: 'flex-end',
    marginTop: -16,
    marginBottom: 6,
  },
  sectionCaption: {
    color: colors.primary,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
  },
  listCardLoader: {
    color: colors.muted,
    fontSize: fontSizes.sm,
    paddingVertical: spacing.sm,
  },
  actionsRow: {
    gap: spacing.sm,
    paddingTop: 2,
    paddingBottom: 2,
  },
  actionCard: {
    borderRadius: radii['2xl'],
    minHeight: 96,
    padding: spacing.sm,
    width: 112,
  },
  actionIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  actionTitle: {
    color: colors.text,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    lineHeight: 14,
  },
  actionSubtitle: {
    color: colors.muted,
    fontSize: fontSizes.xs,
    lineHeight: 14,
    marginTop: 4,
  },
  loading: {
    color: colors.muted,
    fontSize: fontSizes.sm,
    paddingVertical: spacing.sm,
  },
  banner: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerIcon: {
    height: 34,
    resizeMode: 'contain',
    width: 34,
  },
  bannerCopy: {
    flex: 1,
    gap: 2,
  },
  bannerTitle: {
    color: colors.primary,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
  },
  bannerBody: {
    color: colors.muted,
    fontSize: fontSizes.xs,
    lineHeight: 14,
  },
  bannerButton: {
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  bannerButtonText: {
    color: colors.primary,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
  },
});
