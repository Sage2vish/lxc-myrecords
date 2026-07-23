// ============================================================================
// FILE        : HomeScreen.tsx
// PROJECT     : LXC-Health
// AUTHOR      : Vishal Kumar
// UPDATED BY  : Vishal Kumar
// VERSION     : 1.0.0
// DATE-TIME   : 23-July-2026 | 20:39 Hrs
//
// PURPOSE     : MyHealthHub home/dashboard screen — hero header with brand +
//               notifications + profile, Family Health Space card, upcoming
//               appointment card, horizontally-scrolling Quick Actions (with
//               custom View-based vector-free icons via QuickActionIcon),
//               one-call support card, DSA assisted-setup card, and privacy
//               card.
// ============================================================================

import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {useAccountMenu} from '../context/AccountMenuContext';
import type {RootTabParamList} from '../navigation/RootNavigator';
import {colors} from '../theme/colors';

const familyMembers = [
  {name: 'Priya', relation: 'You', initials: 'P', tone: colors.accent},
  {name: 'Rajesh', relation: 'Father', initials: 'R', tone: colors.primary},
  {name: 'Aarav', relation: 'Child', initials: 'A', tone: colors.sky},
  {name: 'Meera', relation: 'Mother', initials: 'M', tone: '#8B6FE8'},
];

const quickActions = [
  {key: 'records', title: 'Health\nRecords', tone: colors.primarySoft, accent: colors.primary},
  {key: 'reports', title: 'Reports &\nVisits', tone: colors.purpleSoft, accent: '#7D5AF2'},
  {key: 'nearby', title: 'Find Nearby\nCare', tone: '#EAF7FF', accent: colors.sky},
  {key: 'appointments', title: 'Appointments', tone: colors.accentSoft, accent: colors.accent},
  {key: 'sync', title: 'Health App\nSync', tone: '#EAF7FF', accent: colors.primary},
  {key: 'profiles', title: 'Family\nProfiles', tone: colors.purpleSoft, accent: '#7D5AF2'},
];

export function HomeScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const {openMenu} = useAccountMenu();

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.root}>
      <ScrollView
        bounces
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroGlow} />
          <View style={styles.topRow}>
            <View style={styles.brandRow}>
              <Image source={require('../../assets/myhealthhub-icon.png')} style={styles.logo} />
              <View style={styles.brandTextWrap}>
                <Text style={styles.brandTitle}>MyHealthHub</Text>
                <Text style={styles.brandSub}>Space</Text>
              </View>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.bellButton}
                onPress={() => navigation.navigate('Notifications')}>
                <Text style={styles.bell}>🔔</Text>
                <Text style={styles.badge}>3</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.profileAvatar}
                onPress={() => navigation.navigate('Profile')}
                onLongPress={openMenu}
                delayLongPress={350}>
                <Text style={styles.profileAvatarText}>P</Text>
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityLabel="Account menu"
                accessibilityRole="button"
                style={styles.menuButton}
                onPress={openMenu}>
                <Text style={styles.menuDots}>⋮</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.greeting}>Good morning, Priya ☀️</Text>
          <Text style={styles.heroSub}>Take charge of your family’s health, every day.</Text>
        </View>

        <View style={styles.familyCard}>
          <View style={styles.cardHeader}>
            <View style={styles.familyTitleRow}>
              <View style={styles.heartBubble}><Text style={styles.heart}>♥</Text></View>
              <View style={styles.titleTextWrap}>
                <Text style={styles.cardTitle}>Family Health Space</Text>
                <Text style={styles.membersCount}>{familyMembers.length} Members</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View all</Text>
              <Text style={styles.viewAllArrow}>›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.membersRow}>
            {familyMembers.map(member => (
              <View key={member.name} style={styles.memberItem}>
                <View style={[styles.memberAvatar, {backgroundColor: member.tone}]}>
                  <Text style={styles.memberInitial}>{member.initials}</Text>
                  {member.name !== 'Priya' ? <Text style={styles.verifiedTick}>✓</Text> : null}
                </View>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={[styles.memberRelation, member.name === 'Priya' && styles.youPill]}>
                  {member.relation}
                </Text>
              </View>
            ))}
            <TouchableOpacity style={styles.addMember}>
              <Text style={styles.addPlus}>＋</Text>
              <Text style={styles.addMemberText}>Add{'\n'}Member</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.healthStrip}>
            <View style={styles.healthMetric}>
              <View style={styles.metricIcon}><Text style={styles.metricIconText}>🛡</Text></View>
              <View style={styles.metricTextWrap}>
                <Text style={styles.metricLabel}>Overall Health Status</Text>
                <Text style={styles.goodStatus}>Good</Text>
              </View>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.healthMetric}>
              <Text style={styles.scoreIcon}>⌁</Text>
              <View style={styles.metricTextWrap}>
                <Text style={styles.metricLabel}>Health Score</Text>
                <Text style={styles.score}><Text style={styles.scoreNumber}>82</Text> /100</Text>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.appointmentCard}>
          <View style={styles.appointmentIcon}><Text style={styles.appointmentIconText}>☑</Text></View>
          <View style={styles.appointmentBody}>
            <Text style={styles.kickerPink}>Upcoming Appointment</Text>
            <Text style={styles.doctorName}>Dr. Ananya Sharma</Text>
            <Text style={styles.doctorRole}>Cardiologist</Text>
            <Text style={styles.appointmentMeta}>▣  24 May 2025, Sat  •  11:30 AM</Text>
            <Text style={styles.appointmentMeta}>⌖  HealthPlus Clinic, Bengaluru</Text>
          </View>
          <View style={styles.doctorAvatar}><Text style={styles.doctorAvatarText}>Dr</Text></View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <View style={styles.quickSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickScroller}>
            {chunkQuickActions(quickActions, 2).map((column, columnIndex) => (
              <View key={columnIndex} style={styles.quickColumn}>
                {column.map(action => (
                  <TouchableOpacity key={action.title} style={styles.quickCard}>
                    <View style={[styles.quickIcon, {backgroundColor: action.tone}]}>
                      <QuickActionIcon kind={action.key} color={action.accent} />
                    </View>
                    <Text style={styles.quickTitle}>{action.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.supportGrid}>
          <TouchableOpacity style={[styles.supportCard, styles.oneCallCard]}>
            <View style={styles.supportIconPink}><Text style={styles.supportIconTextPink}>🎧</Text></View>
            <View style={styles.supportTextBlock}>
              <Text style={styles.oneCallTitle}>One-Call Support</Text>
              <Text style={styles.supportCopy}>Need help? We’re just a call away.</Text>
              <View style={styles.phonePill}>
                <Text style={styles.phonePillText}>☎  (+91) 767 647 7775</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.supportCard, styles.dsaCard]}>
            <View style={styles.supportIconBlue}><Text style={styles.supportIconTextBlue}>🏅</Text></View>
            <View style={styles.supportTextBlock}>
              <Text style={styles.dsaTitle}>DSA Assisted Setup</Text>
              <Text style={styles.supportCopy}>Get personalized help to set up your health space.</Text>
              <View style={styles.getStartedButton}>
                <Text style={styles.getStartedText}>Get Started  ›</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.privacyCard}>
          <View style={styles.privacyIcon}><Text style={styles.privacyIconText}>✚</Text></View>
          <Text style={styles.privacyText}>Your data is safe and secure with enterprise-grade encryption.</Text>
          <Text style={styles.learnMore}>Learn more  ›</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 32,
  },
  hero: {
    minHeight: 208,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 68,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    right: -104,
    top: 30,
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: colors.sky,
    opacity: 0.38,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  logo: {
    width: 42,
    height: 42,
    borderRadius: 13,
    marginRight: 10,
  },
  brandTextWrap: {
    flexShrink: 1,
  },
  brandTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.3,
    flexShrink: 1,
  },
  brandSub: {
    color: 'rgba(255,255,255,0.86)',
    fontSize: 13,
    marginTop: -1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bellButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bell: {
    color: '#fff',
    fontSize: 20,
  },
  badge: {
    position: 'absolute',
    right: 0,
    top: 0,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    textAlign: 'center',
    lineHeight: 18,
    overflow: 'hidden',
    backgroundColor: colors.accent,
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },
  profileAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
  menuButton: {
    width: 24,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuDots: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },
  greeting: {
    marginTop: 18,
    color: '#fff',
    fontSize: 26,
    lineHeight: 30,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  heroSub: {
    marginTop: 6,
    color: 'rgba(255,255,255,0.88)',
    fontSize: 13,
    lineHeight: 18,
  },
  familyCard: {
    marginHorizontal: 18,
    marginTop: -48,
    padding: 14,
    borderRadius: 22,
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
  heartBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentSoft,
    marginRight: 12,
  },
  heart: {
    color: colors.accent,
    fontSize: 24,
  },
  titleTextWrap: {
    flexShrink: 1,
    marginRight: 8,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '900',
    flexShrink: 1,
  },
  membersCount: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 3,
  },
  viewAllButton: {
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 17,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
  },
  viewAllText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
  },
  viewAllArrow: {
    marginLeft: 6,
    color: colors.primary,
    fontSize: 18,
    lineHeight: 18,
  },
  membersRow: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  memberItem: {
    alignItems: 'center',
    width: 56,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberInitial: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },
  verifiedTick: {
    position: 'absolute',
    right: -1,
    bottom: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    textAlign: 'center',
    lineHeight: 16,
    overflow: 'hidden',
    color: '#fff',
    backgroundColor: colors.primary,
    fontSize: 10,
    fontWeight: '900',
  },
  memberName: {
    marginTop: 6,
    color: colors.text,
    fontSize: 11,
    fontWeight: '900',
  },
  memberRelation: {
    marginTop: 2,
    color: colors.muted,
    fontSize: 9,
  },
  youPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    overflow: 'hidden',
    color: colors.accent,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  addMember: {
    alignItems: 'center',
    width: 58,
  },
  addPlus: {
    width: 48,
    height: 48,
    borderRadius: 24,
    textAlign: 'center',
    lineHeight: 48,
    overflow: 'hidden',
    backgroundColor: colors.primarySoft,
    color: colors.primary,
    fontSize: 26,
    fontWeight: '300',
  },
  addMemberText: {
    marginTop: 6,
    color: colors.text,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 14,
  },
  healthStrip: {
    marginTop: 18,
    minHeight: 72,
    borderRadius: 18,
    padding: 12,
    backgroundColor: colors.primarySoft,
    flexDirection: 'row',
    alignItems: 'center',
  },
  healthMetric: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricIcon: {
    width: 38,
    height: 38,
    borderRadius: 14,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  metricIconText: {
    fontSize: 20,
  },
  metricTextWrap: {
    flexShrink: 1,
  },
  metricLabel: {
    color: colors.muted,
    fontSize: 11,
    flexShrink: 1,
  },
  goodStatus: {
    marginTop: 2,
    color: colors.primary,
    fontSize: 16,
    fontWeight: '900',
  },
  metricDivider: {
    width: 1,
    height: 42,
    marginHorizontal: 8,
    backgroundColor: '#C8D7EA',
  },
  scoreIcon: {
    color: colors.primary,
    fontSize: 24,
    marginRight: 8,
    fontWeight: '900',
  },
  score: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  scoreNumber: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '900',
  },
  appointmentCard: {
    marginHorizontal: 18,
    marginTop: 18,
    minHeight: 112,
    borderRadius: 20,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF4FF',
    borderWidth: 1,
    borderColor: '#DCEBFA',
  },
  appointmentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentSoft,
  },
  appointmentIconText: {
    color: colors.accent,
    fontSize: 22,
  },
  appointmentBody: {
    flex: 1,
  },
  kickerPink: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '900',
    marginBottom: 2,
  },
  doctorName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
  doctorRole: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  appointmentMeta: {
    marginTop: 5,
    color: colors.muted,
    fontSize: 10,
    fontWeight: '700',
  },
  doctorAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    marginHorizontal: 6,
  },
  doctorAvatarText: {
    color: '#fff',
    fontWeight: '900',
  },
  chevron: {
    color: colors.primary,
    fontSize: 34,
    lineHeight: 34,
  },
  quickSection: {
    marginHorizontal: 0,
    marginTop: 14,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    paddingLeft: 10,
  },
  quickScroller: {
    flexDirection: 'row',
    gap: 10,
    paddingLeft: 18,
    paddingRight: 18,
  },
  quickColumn: {
    width: 110,
    gap: 10,
  },
  quickCard: {
    width: 110,
    minHeight: 100,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 6},
    elevation: 2,
    alignItems: 'center',
  },
  quickIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickTitle: {
    color: colors.text,
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 12,
    textAlign: 'center',
    width: '100%',
  },
  iconStack: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconSheet: {
    position: 'absolute',
    width: 14,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    top: 4,
    left: 6,
    backgroundColor: 'transparent',
  },
  iconSheetTop: {
    position: 'absolute',
    width: 12,
    height: 6,
    borderRadius: 3,
    top: 2,
    left: 8,
  },
  iconBars: {
    position: 'absolute',
    width: 16,
    height: 4,
    borderRadius: 2,
    top: 5,
    left: 5,
  },
  iconBarsMid: {
    position: 'absolute',
    width: 18,
    height: 4,
    borderRadius: 2,
    top: 11,
    left: 4,
  },
  iconBarsBottom: {
    position: 'absolute',
    width: 12,
    height: 4,
    borderRadius: 2,
    top: 17,
    left: 7,
  },
  iconRingOuter: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    top: 4,
    left: 4,
  },
  iconRingInner: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    top: 8,
    left: 8,
  },
  iconDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    top: 11,
    left: 11,
  },
  iconCalendar: {
    position: 'absolute',
    width: 18,
    height: 16,
    borderRadius: 4,
    borderWidth: 2,
    top: 6,
    left: 4,
  },
  iconCalendarTop: {
    position: 'absolute',
    width: 18,
    height: 5,
    borderRadius: 2,
    top: 4,
    left: 4,
  },
  iconCalendarDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    top: 12,
    left: 12,
  },
  iconCircle: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    top: 4,
    left: 4,
  },
  iconArrow: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderTopWidth: 2,
    borderRightWidth: 2,
    transform: [{rotate: '45deg'}],
    top: 8,
    left: 8,
  },
  iconPersonLeft: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    top: 4,
    left: 4,
  },
  iconPersonRight: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    top: 4,
    right: 4,
  },
  iconPeopleBase: {
    position: 'absolute',
    width: 18,
    height: 8,
    borderRadius: 4,
    bottom: 4,
    left: 4,
  },
  supportGrid: {
    marginHorizontal: 18,
    marginTop: 18,
    flexDirection: 'row',
    gap: 12,
  },
  supportCard: {
    flex: 1,
    minHeight: 146,
    borderRadius: 18,
    padding: 12,
  },
  oneCallCard: {
    backgroundColor: colors.accentSoft,
  },
  dsaCard: {
    backgroundColor: colors.primarySoft,
  },
  supportIconPink: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD7E8',
    marginBottom: 10,
  },
  supportIconBlue: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D8EBFF',
    marginBottom: 10,
  },
  supportIconTextPink: {
    fontSize: 20,
  },
  supportIconTextBlue: {
    fontSize: 20,
  },
  supportTextBlock: {
    flex: 1,
  },
  oneCallTitle: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '900',
  },
  dsaTitle: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '900',
  },
  supportCopy: {
    marginTop: 4,
    color: colors.text,
    fontSize: 11,
    lineHeight: 15,
  },
  phonePill: {
    marginTop: 10,
    minHeight: 32,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFB6D2',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF4FA',
  },
  phonePillText: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: '900',
  },
  getStartedButton: {
    marginTop: 10,
    minHeight: 32,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#B9D9FA',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FCFF',
  },
  getStartedText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '900',
  },
  privacyCard: {
    marginHorizontal: 18,
    marginTop: 18,
    minHeight: 64,
    borderRadius: 18,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
  },
  privacyIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    marginRight: 12,
  },
  privacyIconText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
  privacyText: {
    flex: 1,
    color: colors.primaryDark,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
  },
  learnMore: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '900',
    marginLeft: 8,
  },
});

function QuickActionIcon({
  kind,
  color,
}: {
  kind: 'records' | 'reports' | 'nearby' | 'appointments' | 'sync' | 'profiles';
  color: string;
}) {
  if (kind === 'records') {
    return (
      <View style={styles.iconStack}>
        <View style={[styles.iconSheet, {borderColor: color}]} />
        <View style={[styles.iconSheetTop, {backgroundColor: color}]} />
      </View>
    );
  }

  if (kind === 'reports') {
    return (
      <View style={styles.iconStack}>
        <View style={[styles.iconBars, {backgroundColor: color}]} />
        <View style={[styles.iconBarsMid, {backgroundColor: color}]} />
        <View style={[styles.iconBarsBottom, {backgroundColor: color}]} />
      </View>
    );
  }

  if (kind === 'nearby') {
    return (
      <View style={styles.iconStack}>
        <View style={[styles.iconRingOuter, {borderColor: color}]} />
        <View style={[styles.iconRingInner, {borderColor: color}]} />
        <View style={[styles.iconDot, {backgroundColor: color}]} />
      </View>
    );
  }

  if (kind === 'appointments') {
    return (
      <View style={styles.iconStack}>
        <View style={[styles.iconCalendar, {borderColor: color}]} />
        <View style={[styles.iconCalendarTop, {backgroundColor: color}]} />
        <View style={[styles.iconCalendarDot, {backgroundColor: color}]} />
      </View>
    );
  }

  if (kind === 'sync') {
    return (
      <View style={styles.iconStack}>
        <View style={[styles.iconCircle, {borderColor: color}]} />
        <View style={[styles.iconArrow, {borderColor: color}]} />
      </View>
    );
  }

  return (
    <View style={styles.iconStack}>
      <View style={[styles.iconPersonLeft, {backgroundColor: color}]} />
      <View style={[styles.iconPersonRight, {backgroundColor: color}]} />
      <View style={[styles.iconPeopleBase, {backgroundColor: color}]} />
    </View>
  );
}

function chunkQuickActions<T>(items: T[], size: number) {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}
