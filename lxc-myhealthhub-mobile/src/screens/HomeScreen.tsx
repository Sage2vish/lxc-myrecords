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
import {colors} from '../theme/colors';

const familyMembers = [
  {name: 'Priya', relation: 'You', initials: 'P', tone: colors.accent},
  {name: 'Rajesh', relation: 'Father', initials: 'R', tone: colors.primary},
  {name: 'Aarav', relation: 'Child', initials: 'A', tone: colors.sky},
  {name: 'Meera', relation: 'Mother', initials: 'M', tone: '#8B6FE8'},
];

const quickActions = [
  {icon: '▣', title: 'Health\nRecords', tone: colors.primarySoft, accent: colors.primary},
  {icon: '▤', title: 'Reports &\nVisits', tone: colors.purpleSoft, accent: '#7D5AF2'},
  {icon: '●', title: 'Find Nearby\nCare', tone: '#EAF7FF', accent: colors.sky},
  {icon: '✓', title: 'Appointments', tone: colors.accentSoft, accent: colors.accent},
  {icon: '↻', title: 'Health App\nSync', tone: '#EAF7FF', accent: colors.primary},
  {icon: '👥', title: 'Family\nProfiles', tone: colors.purpleSoft, accent: '#7D5AF2'},
];

export function HomeScreen() {
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
              <View>
                <Text style={styles.brandTitle}>MyHealthHub</Text>
                <Text style={styles.brandSub}>Space</Text>
              </View>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.bellButton}>
                <Text style={styles.bell}>🔔</Text>
                <Text style={styles.badge}>3</Text>
              </TouchableOpacity>
              <View style={styles.profileAvatar}><Text style={styles.profileAvatarText}>P</Text></View>
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

        <View style={styles.quickPanel}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickGrid}>
            {quickActions.map(action => (
              <TouchableOpacity key={action.title} style={styles.quickCard}>
                <View style={[styles.quickIcon, {backgroundColor: action.tone}]}>
                  <Text style={[styles.quickIconText, {color: action.accent}]}>{action.icon}</Text>
                </View>
                <Text style={styles.quickTitle}>{action.title}</Text>
                <Text style={styles.quickArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
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
    minHeight: 268,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 92,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 42,
    borderBottomRightRadius: 42,
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    right: -90,
    top: 40,
    width: 240,
    height: 240,
    borderRadius: 120,
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
  },
  logo: {
    width: 58,
    height: 58,
    borderRadius: 18,
    marginRight: 12,
  },
  brandTitle: {
    color: '#fff',
    fontSize: 25,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  brandSub: {
    color: 'rgba(255,255,255,0.86)',
    fontSize: 17,
    marginTop: -1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bellButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bell: {
    color: '#fff',
    fontSize: 24,
  },
  badge: {
    position: 'absolute',
    right: 2,
    top: 0,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    textAlign: 'center',
    lineHeight: 22,
    overflow: 'hidden',
    backgroundColor: colors.accent,
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
  },
  greeting: {
    marginTop: 26,
    color: '#fff',
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  heroSub: {
    marginTop: 10,
    color: 'rgba(255,255,255,0.88)',
    fontSize: 17,
    lineHeight: 23,
  },
  familyCard: {
    marginHorizontal: 18,
    marginTop: -72,
    padding: 18,
    borderRadius: 28,
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
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentSoft,
    marginRight: 12,
  },
  heart: {
    color: colors.accent,
    fontSize: 30,
  },
  titleTextWrap: {
    flexShrink: 1,
    marginRight: 8,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
    flexShrink: 1,
  },
  membersCount: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '800',
    marginTop: 3,
  },
  viewAllButton: {
    height: 42,
    paddingHorizontal: 16,
    borderRadius: 21,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
  },
  viewAllText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '900',
  },
  viewAllArrow: {
    marginLeft: 6,
    color: colors.primary,
    fontSize: 25,
    lineHeight: 25,
  },
  membersRow: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  memberItem: {
    alignItems: 'center',
    width: 62,
  },
  memberAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberInitial: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
  },
  verifiedTick: {
    position: 'absolute',
    right: -1,
    bottom: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    textAlign: 'center',
    lineHeight: 20,
    overflow: 'hidden',
    color: '#fff',
    backgroundColor: colors.primary,
    fontSize: 12,
    fontWeight: '900',
  },
  memberName: {
    marginTop: 8,
    color: colors.text,
    fontSize: 13,
    fontWeight: '900',
  },
  memberRelation: {
    marginTop: 2,
    color: colors.muted,
    fontSize: 10,
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
    width: 66,
  },
  addPlus: {
    width: 58,
    height: 58,
    borderRadius: 29,
    textAlign: 'center',
    lineHeight: 58,
    overflow: 'hidden',
    backgroundColor: colors.primarySoft,
    color: colors.primary,
    fontSize: 34,
    fontWeight: '300',
  },
  addMemberText: {
    marginTop: 8,
    color: colors.text,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 16,
  },
  healthStrip: {
    marginTop: 26,
    minHeight: 84,
    borderRadius: 22,
    padding: 14,
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
    width: 46,
    height: 46,
    borderRadius: 16,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  metricIconText: {
    fontSize: 24,
  },
  metricTextWrap: {
    flexShrink: 1,
  },
  metricLabel: {
    color: colors.muted,
    fontSize: 13,
    flexShrink: 1,
  },
  goodStatus: {
    marginTop: 2,
    color: colors.primary,
    fontSize: 22,
    fontWeight: '900',
  },
  metricDivider: {
    width: 1,
    height: 54,
    marginHorizontal: 10,
    backgroundColor: '#C8D7EA',
  },
  scoreIcon: {
    color: colors.primary,
    fontSize: 30,
    marginRight: 10,
    fontWeight: '900',
  },
  score: {
    color: colors.muted,
    fontSize: 16,
    fontWeight: '700',
  },
  scoreNumber: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: '900',
  },
  appointmentCard: {
    marginHorizontal: 18,
    marginTop: 22,
    minHeight: 136,
    borderRadius: 26,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF4FF',
    borderWidth: 1,
    borderColor: '#DCEBFA',
  },
  appointmentIcon: {
    width: 62,
    height: 62,
    borderRadius: 31,
    marginRight: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentSoft,
  },
  appointmentIconText: {
    color: colors.accent,
    fontSize: 30,
  },
  appointmentBody: {
    flex: 1,
  },
  kickerPink: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 3,
  },
  doctorName: {
    color: colors.text,
    fontSize: 21,
    fontWeight: '900',
  },
  doctorRole: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 2,
  },
  appointmentMeta: {
    marginTop: 5,
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  doctorAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
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
  quickPanel: {
    marginHorizontal: 18,
    marginTop: 22,
    padding: 16,
    borderRadius: 26,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 22,
    shadowOffset: {width: 0, height: 12},
    elevation: 5,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 21,
    fontWeight: '900',
    marginBottom: 14,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  quickCard: {
    width: '31.5%',
    minHeight: 104,
    borderRadius: 18,
    padding: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 6},
    elevation: 2,
  },
  quickIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickIconText: {
    fontSize: 22,
    fontWeight: '900',
  },
  quickTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '900',
    lineHeight: 16,
  },
  quickArrow: {
    position: 'absolute',
    right: 10,
    top: 42,
    color: colors.muted,
    fontSize: 26,
  },
  supportGrid: {
    marginHorizontal: 18,
    marginTop: 22,
    flexDirection: 'row',
    gap: 12,
  },
  supportCard: {
    flex: 1,
    minHeight: 170,
    borderRadius: 24,
    padding: 14,
  },
  oneCallCard: {
    backgroundColor: colors.accentSoft,
  },
  dsaCard: {
    backgroundColor: colors.primarySoft,
  },
  supportIconPink: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD7E8',
    marginBottom: 10,
  },
  supportIconBlue: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D8EBFF',
    marginBottom: 10,
  },
  supportIconTextPink: {
    fontSize: 24,
  },
  supportIconTextBlue: {
    fontSize: 24,
  },
  supportTextBlock: {
    flex: 1,
  },
  oneCallTitle: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '900',
  },
  dsaTitle: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '900',
  },
  supportCopy: {
    marginTop: 5,
    color: colors.text,
    fontSize: 13,
    lineHeight: 18,
  },
  phonePill: {
    marginTop: 12,
    minHeight: 38,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FFB6D2',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF4FA',
  },
  phonePillText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '900',
  },
  getStartedButton: {
    marginTop: 12,
    minHeight: 38,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#B9D9FA',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FCFF',
  },
  getStartedText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '900',
  },
  privacyCard: {
    marginHorizontal: 18,
    marginTop: 22,
    minHeight: 76,
    borderRadius: 22,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
  },
  privacyIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    marginRight: 12,
  },
  privacyIconText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
  },
  privacyText: {
    flex: 1,
    color: colors.primaryDark,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
  },
  learnMore: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
    marginLeft: 8,
  },
});
