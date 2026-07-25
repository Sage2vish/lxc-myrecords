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

import React, {useEffect, useState} from 'react';
import {
  ImageBackground,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {useAccountMenu} from '../context/AccountMenuContext';
import {fetchDeviceWeather, type WeatherSummary} from '../api/weather';
import type {RootTabParamList} from '../navigation/RootNavigator';
import {colors} from '../theme/colors';
import {getHeroTheme} from '../theme/dayparts';
import {radii} from '../theme/radii';
import {fontSizes, fontWeights} from '../theme/typography';

const selfProfile = {name: 'Priya', relation: 'You', initials: 'P', tone: colors.accent};

const familyMembers = [
  {name: 'Rajesh', relation: 'Father', initials: 'R', tone: colors.primary},
  {name: 'Aarav', relation: 'Child', initials: 'A', tone: colors.sky},
  {name: 'Meera', relation: 'Mother', initials: 'M', tone: '#8B6FE8'},
];

type QuickActionKind = 'records' | 'reports' | 'nearby' | 'appointments' | 'sync' | 'profiles';

type QuickAction = {
  key: QuickActionKind;
  title: string;
  tone: string;
  accent: string;
};

const quickActions: QuickAction[] = [
  {key: 'records', title: 'Health\nRecords', tone: colors.primarySoft, accent: colors.primary},
  {key: 'reports', title: 'Reports &\nVisits', tone: colors.purpleSoft, accent: '#7D5AF2'},
  {key: 'nearby', title: 'Find Nearby\nCare', tone: '#EAF7FF', accent: colors.sky},
  {key: 'appointments', title: 'Appointments', tone: colors.accentSoft, accent: colors.accent},
  {key: 'sync', title: 'Health App\nSync', tone: '#EAF7FF', accent: colors.primary},
  {key: 'profiles', title: 'Family\nProfiles', tone: colors.purpleSoft, accent: '#7D5AF2'},
];

const appointments = [
  {
    name: 'Dr. Ananya Sharma',
    role: 'Cardiologist',
    gender: 'female',
    date: '24 May 2025, Sat',
    time: '11:30 AM',
    location: 'HealthPlus Clinic, Bengaluru',
  },
  {
    name: 'Dr. Mehul Joshi',
    role: 'Orthopedist',
    gender: 'male',
    date: '27 May 2025, Tue',
    time: '09:15 AM',
    location: 'Apollo Speciality, Bengaluru',
  },
  {
    name: 'Dr. Kavya Rao',
    role: 'Pediatrician',
    gender: 'female',
    date: '29 May 2025, Thu',
    time: '04:00 PM',
    location: 'Motherhood Hospital, Bengaluru',
  },
];

const labTabs = ['Medication', 'Laboratory', 'Radiology'] as const;

const labResults = {
  Medication: [
    {
      title: 'Ketoprofen 25 mg/g Gel',
      source: 'Al Wahda Medical Centre',
      date: '18/02/2023 09:01 PM',
      badge: 'Rx',
    },
    {
      title: 'Meloxicam 15 mg Tablets',
      source: 'Al Wahda Medical Centre',
      date: '18/02/2023 09:01 PM',
      badge: 'Rx',
    },
    {
      title: 'Co-amoxiclav 1 g Tablets',
      source: 'Al Wahda Medical Centre',
      date: '02/02/2023 02:24 PM',
      badge: 'Rx',
    },
  ],
  Laboratory: [
    {
      title: 'Assay of Ferritin',
      source: 'Burjeel Holdings',
      date: '16/06/2023 06:52 PM',
      badge: 'Lab',
    },
    {
      title: 'Hepatic Function Panel',
      source: 'Burjeel Holdings',
      date: '16/06/2023 06:21 PM',
      badge: 'Lab',
    },
    {
      title: 'C-Reactive Protein',
      source: 'Burjeel Holdings',
      date: '16/06/2023 06:21 PM',
      badge: 'Lab',
    },
  ],
  Radiology: [
    {
      title: 'Chest X-Ray',
      source: 'Mubadala Capital',
      date: '25/01/2026 11:07 AM',
      badge: 'XR',
    },
    {
      title: 'X-Ray Exam of Trunk Spine',
      source: 'Burjeel Holdings',
      date: '31/03/2021 06:01 PM',
      badge: 'XR',
    },
    {
      title: 'US Exam, Pelvic, Complete',
      source: 'Burjeel Holdings',
      date: '08/09/2020 10:28 AM',
      badge: 'XR',
    },
  ],
} as const;

const documentVaultItems = [
  {
    title: 'Annual Health Summary',
    subtitle: 'Complete record bundle with physician notes and scans.',
    uploaded: 'Uploaded 24 Jul 2026, 09:10 AM',
    badge: 'DOC',
  },
  {
    title: 'Radiology Archive',
    subtitle: 'Chest X-Ray and imaging reports stored securely.',
    uploaded: 'Uploaded 22 Jul 2026, 04:45 PM',
    badge: 'DOC',
  },
  {
    title: 'Medication History',
    subtitle: 'Prescription receipts and current medicine list.',
    uploaded: 'Uploaded 20 Jul 2026, 01:25 PM',
    badge: 'DOC',
  },
  {
    title: 'Insurance Policy Pack',
    subtitle: 'Coverage documents and claim reference files.',
    uploaded: 'Uploaded 18 Jul 2026, 11:50 AM',
    badge: 'DOC',
  },
  {
    title: 'Family Lab Bundle',
    subtitle: 'Consolidated test reports for shared review.',
    uploaded: 'Uploaded 16 Jul 2026, 03:35 PM',
    badge: 'DOC',
  },
] as const;

const defaultWeather: WeatherSummary = {
  requestedLocation: {city: 'Dubai'},
  version: 'local-dev-fallback',
  city: 'Dubai',
  region: 'Dubai',
  country: 'United Arab Emirates',
  tempC: 39.3,
  feelsLikeC: 45.2,
  condition: 'Sunny',
  conditionCode: 1000,
  icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
  isDay: true,
  localtime: '2026-07-25 10:58',
  source: 'weatherapi.com',
};

export function HomeScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const {openMenu} = useAccountMenu();
  const heroTheme = getHeroTheme();
  const heroTextColor =
    heroTheme.part === 'day' || heroTheme.part === 'afternoon' ? colors.primary : colors.surface;
  const insets = useSafeAreaInsets();
  const [profilesExpanded, setProfilesExpanded] = useState(true);
  const [appointmentsExpanded, setAppointmentsExpanded] = useState(false);
  const [labExpanded, setLabExpanded] = useState(false);
  const [vaultExpanded, setVaultExpanded] = useState(false);
  const [selectedLabTab, setSelectedLabTab] = useState<(typeof labTabs)[number]>('Medication');
  const [weather, setWeather] = useState<WeatherSummary>(defaultWeather);

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
          setWeather(defaultWeather);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
      <SafeAreaView
        edges={['top', 'left', 'right']}
        style={[
          styles.root,
          {backgroundColor: Platform.OS === 'ios' ? 'transparent' : heroTheme.backgroundColor},
        ]}>
        {Platform.OS === 'ios' ? (
          <ImageBackground
            source={heroTheme.bannerImage}
            resizeMode="cover"
            style={[
              styles.bannerBleed,
              {
                top: -insets.top,
                height: insets.top + 350,
              },
            ]}>
            <View style={[styles.heroTint, {backgroundColor: heroTheme.backgroundColor}]} />
            <View style={[styles.heroGlow, {backgroundColor: heroTheme.glowColor}]} />
            <View pointerEvents="none" style={styles.heroBottomFade}>
              <View style={[styles.heroBottomFadeBand, styles.heroBottomFadeTop]} />
              <View style={[styles.heroBottomFadeBand, styles.heroBottomFadeMid]} />
              <View style={[styles.heroBottomFadeBand, styles.heroBottomFadeLow]} />
              <View style={styles.heroBottomFadeBand} />
            </View>
          </ImageBackground>
        ) : null}
        <ScrollView
          bounces
          style={[
            styles.scroll,
            {backgroundColor: Platform.OS === 'ios' ? 'transparent' : colors.background},
          ]}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          {Platform.OS === 'ios' ? (
            <View style={[styles.hero, styles.heroIos]}>
              <View style={styles.heroContent}>
                <View
                  style={[
                    styles.glassHeader,
                    {marginTop: Math.round(insets.top * 0.12)},
                  ]}>
                  <View style={styles.topRow}>
                    <View style={styles.brandRow}>
                      <Image source={require('../../assets/myhealthhub-icon.png')} style={styles.logo} />
                      <View style={styles.brandTextWrap}>
                        <Text style={[styles.brandTitle, {color: heroTextColor}]}>MyHealthHub</Text>
                        <Text style={[styles.brandSub, {color: heroTextColor}]}>Space</Text>
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
                        <Image
                          source={require('../../assets/nav-more-icon-blue.png')}
                          style={[styles.menuIcon, styles.menuIconPink]}
                        />
                      </TouchableOpacity>
                    </View>
                </View>
              </View>

              <View style={styles.weatherRow}>
                <Text style={styles.weatherCity}>{weather?.city ?? 'Dubai'}</Text>
                <Text style={styles.weatherTemp}>
                  {weather ? `${Math.round(weather.tempC)}°C` : '--°C'}
                </Text>
              </View>

                <View style={styles.greetingGlassSlab}>
                  <Text style={[styles.greeting, {color: heroTextColor}]}>Good Morning, Paaji</Text>
                  <Text style={styles.greetingHeroSub}>
                    Take charge of your family’s health, every day.
                  </Text>
                </View>
              </View>
            </View>
          ) : (
          <ImageBackground source={heroTheme.bannerImage} resizeMode="cover" style={styles.hero}>
            <View style={[styles.heroTint, {backgroundColor: heroTheme.backgroundColor}]} />
            <View style={[styles.heroGlow, {backgroundColor: heroTheme.glowColor}]} />
            <View pointerEvents="none" style={styles.heroBottomFade}>
              <View style={[styles.heroBottomFadeBand, styles.heroBottomFadeTop]} />
              <View style={[styles.heroBottomFadeBand, styles.heroBottomFadeMid]} />
              <View style={[styles.heroBottomFadeBand, styles.heroBottomFadeLow]} />
              <View style={styles.heroBottomFadeBand} />
            </View>
            <View style={styles.heroContent}>
              <View style={styles.glassHeader}>
                <View style={styles.topRow}>
                  <View style={styles.brandRow}>
                    <Image source={require('../../assets/myhealthhub-icon.png')} style={styles.logo} />
                    <View style={styles.brandTextWrap}>
                      <Text style={[styles.brandTitle, {color: heroTextColor}]}>MyHealthHub</Text>
                      <Text style={[styles.brandSub, {color: heroTextColor}]}>Space</Text>
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
                      <Image
                        source={require('../../assets/nav-more-icon-blue.png')}
                        style={[styles.menuIcon, styles.menuIconPink]}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.weatherRow}>
                <Text style={styles.weatherCity}>{weather?.city ?? 'Dubai'}</Text>
                <Text style={styles.weatherTemp}>
                  {weather ? `${Math.round(weather.tempC)}°C` : '--°C'}
                </Text>
              </View>

              <View style={styles.greetingGlassSlab}>
                <Text style={[styles.greeting, {color: heroTextColor}]}>Good Morning, Paaji</Text>
                <Text style={styles.greetingHeroSub}>
                  Take charge of your family’s health, every day.
                </Text>
              </View>
            </View>
          </ImageBackground>
          )}

          <View style={styles.familyCard}>
          <View style={styles.cardHeader}>
            <View style={styles.familyTitleRow}>
              <View style={styles.heartBubble}>
                <Image
                  source={require('../../assets/family-badge-icon.png')}
                  style={styles.cardBadgeImage}
                />
              </View>
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

          <View style={styles.profileGroupCard}>
            <TouchableOpacity
              accessibilityRole="button"
              activeOpacity={0.85}
              onPress={() => setProfilesExpanded(value => !value)}
              style={styles.profileGroupHeader}>
              <View style={styles.profileGroupHeaderLeft}>
                <View style={styles.profileHeaderTitleRow}>
                  <View style={styles.profileSelfBadge}>
                    <Image
                      source={require('../../assets/profiles-icon-only.png')}
                      style={styles.profileSelfBadgeImage}
                    />
                  </View>
                  <View style={styles.profileHeaderTitleCopy}>
                    <Text style={styles.profileSectionLabel}>Profiles</Text>
                    <Text style={styles.profileGroupHint}>Priya and family together</Text>
                  </View>
                </View>
              </View>
              <View style={styles.profileGroupHeaderRight}>
                <Text style={styles.membersCount}>{familyMembers.length + 1} Profiles</Text>
                <View style={styles.profileChevronPill}>
                  <Text style={styles.profileChevron}>{profilesExpanded ? '−' : '+'}</Text>
                </View>
              </View>
            </TouchableOpacity>

            <View style={styles.profileGroupBody}>
              {profilesExpanded ? (
                <View style={styles.membersRow}>
                  <View style={[styles.memberItem, styles.memberSelectedFrame]}>
                    <View style={[styles.memberAvatar, {backgroundColor: selfProfile.tone}]}>
                      <Text style={styles.memberInitial}>{selfProfile.initials}</Text>
                      <Text style={styles.verifiedTick}>✓</Text>
                    </View>
                    <Text style={styles.memberName}>{selfProfile.name}</Text>
                    <Text style={[styles.memberRelation, styles.memberYouLabel]}>
                      {selfProfile.relation}
                    </Text>
                  </View>
                  {familyMembers.map(member => (
                    <View key={member.name} style={styles.memberItem}>
                      <View style={[styles.memberAvatar, {backgroundColor: member.tone}]}>
                        <Text style={styles.memberInitial}>{member.initials}</Text>
                        <Text style={styles.verifiedTick}>✓</Text>
                      </View>
                      <Text style={styles.memberName}>{member.name}</Text>
                      <Text style={styles.memberRelation}>{member.relation}</Text>
                    </View>
                  ))}
                  <TouchableOpacity style={styles.addMember}>
                    <Text style={styles.addPlus}>＋</Text>
                    <Text style={styles.addMemberText}>Add{'\n'}Member</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
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

          <View style={styles.appointmentCard}>
          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.85}
            onPress={() => setAppointmentsExpanded(value => !value)}
            style={styles.appointmentHeader}>
            <View style={styles.appointmentHeaderIcon}>
              <Image
                source={require('../../assets/appointment-badge-icon.png')}
                style={styles.cardBadgeImage}
              />
            </View>
            <View style={styles.appointmentHeaderLeft}>
              <Text style={styles.cardTitle}>Upcoming Appointments</Text>
              <Text style={styles.appointmentSubtitle}>Top 3 upcoming visits</Text>
            </View>
            <View style={styles.appointmentHeaderRight}>
              <TouchableOpacity style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>View all</Text>
                <Text style={styles.viewAllArrow}>›</Text>
              </TouchableOpacity>
              <View style={styles.profileChevronPill}>
                <Text style={styles.profileChevron}>{appointmentsExpanded ? '−' : '+'}</Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.appointmentListCard}>
            {(appointmentsExpanded ? appointments.slice(0, 3) : appointments.slice(0, 1)).map(
              (appointment, index, visibleAppointments) => (
                <View
                  key={`${appointment.name}-${appointment.date}`}
                  style={[
                    styles.appointmentItem,
                    index !== visibleAppointments.length - 1 && styles.appointmentItemDivider,
                  ]}>
                  <View style={styles.appointmentRowIcon}>
                    <Image
                      source={
                        appointment.gender === 'female'
                          ? require('../../assets/doctor-female-icon.png')
                          : require('../../assets/doctor-male-icon.png')
                      }
                      style={styles.appointmentRowIconImage}
                    />
                  </View>
                  <View style={styles.appointmentBody}>
                    <Text style={styles.doctorName}>{appointment.name}</Text>
                    <View style={styles.appointmentDetailsRow}>
                      <View style={styles.appointmentDetailsLeft}>
                        <Text style={styles.appointmentRole}>{appointment.role}</Text>
                        <Text style={styles.appointmentLocation}>⌖  {appointment.location}</Text>
                      </View>
                      <View style={styles.appointmentDivider} />
                      <View style={styles.appointmentDetailsRight}>
                        <Text style={styles.appointmentDate}>{appointment.date}</Text>
                        <Text style={styles.appointmentTime}>{appointment.time}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ),
            )}
          </View>
        </View>

          <View style={styles.labCard}>
          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.85}
            onPress={() => setLabExpanded(value => !value)}
            style={styles.labCardHeader}>
            <View style={styles.labCardHeaderIcon}>
              <Image
                source={require('../../assets/lab-badge-icon.png')}
                style={styles.cardBadgeImage}
              />
            </View>
            <View style={styles.labCardHeaderLeft}>
              <Text style={styles.cardTitle}>Lab Reports & Results</Text>
              <Text style={styles.labCardSubtitle}>Top 3 results in each section</Text>
            </View>
            <View style={styles.labCardHeaderRight}>
              <TouchableOpacity style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>View all</Text>
                <Text style={styles.viewAllArrow}>›</Text>
              </TouchableOpacity>
              <View style={styles.profileChevronPill}>
                <Text style={styles.profileChevron}>{labExpanded ? '−' : '+'}</Text>
              </View>
            </View>
          </TouchableOpacity>

          {labExpanded ? (
            <>
              <View style={styles.labTabsRow}>
                {labTabs.map(tab => {
                  const active = tab === selectedLabTab;
                  return (
                    <TouchableOpacity
                      key={tab}
                      accessibilityRole="button"
                      onPress={() => setSelectedLabTab(tab)}
                      style={[styles.labTab, active && styles.labTabActive]}>
                      <Text style={[styles.labTabText, active && styles.labTabTextActive]}>
                        {tab}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.labListCard}>
                {labResults[selectedLabTab].slice(0, 3).map((item, index, visibleItems) => (
                  <View
                    key={`${selectedLabTab}-${item.title}-${item.date}`}
                    style={[
                      styles.labItem,
                      index !== visibleItems.length - 1 && styles.labItemDivider,
                    ]}>
                    <View style={styles.labIconWrap}>
                      <Text style={styles.labIconText}>{item.badge}</Text>
                    </View>
                    <View style={styles.labItemBody}>
                      <Text style={styles.labItemTitle}>{item.title}</Text>
                      <Text style={styles.labItemSource}>{item.source}</Text>
                      <Text style={styles.labItemDate}>{item.date}</Text>
                    </View>
                    <Text style={styles.labItemChevron}>›</Text>
                  </View>
                ))}
              </View>
            </>
          ) : null}
        </View>

          <View style={styles.vaultCard}>
          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.85}
            onPress={() => setVaultExpanded(value => !value)}
            style={styles.vaultCardHeader}>
            <View style={styles.vaultCardHeaderIcon}>
              <Image
                source={require('../../assets/document-vault-icon.png')}
                style={styles.cardBadgeImage}
              />
            </View>
            <View style={styles.vaultCardHeaderLeft}>
              <Text style={styles.cardTitle}>Document Vault</Text>
              <Text style={styles.vaultCardSubtitle}>Securely stored uploads and records</Text>
            </View>
            <View style={styles.vaultCardHeaderRight}>
              <TouchableOpacity style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>View all</Text>
                <Text style={styles.viewAllArrow}>›</Text>
              </TouchableOpacity>
              <View style={styles.profileChevronPill}>
                <Text style={styles.profileChevron}>{vaultExpanded ? '−' : '+'}</Text>
              </View>
            </View>
          </TouchableOpacity>

          {vaultExpanded ? (
            <View style={styles.vaultListCard}>
              {documentVaultItems.slice(0, 5).map((item, index, visibleItems) => (
                <View
                  key={`${item.title}-${item.uploaded}`}
                  style={[
                    styles.vaultItem,
                    index !== visibleItems.length - 1 && styles.vaultItemDivider,
                  ]}>
                  <View style={styles.vaultIconWrap}>
                    <Text style={styles.vaultIconText}>{item.badge}</Text>
                  </View>
                  <View style={styles.vaultItemBody}>
                    <Text style={styles.vaultItemTitle}>{item.title}</Text>
                    <Text style={styles.vaultItemSubtitle}>{item.subtitle}</Text>
                    <Text style={styles.vaultItemDate}>{item.uploaded}</Text>
                  </View>
                  <Text style={styles.vaultItemChevron}>›</Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>

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
    backgroundColor: colors.primaryDark,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bannerBleed: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  content: {
    paddingBottom: 32,
  },
  hero: {
    minHeight: 208,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 68,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    overflow: 'visible',
  },
  heroIos: {
    paddingTop: 8,
  },
  heroImage: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  heroContent: {
    flex: 1,
  },
  glassHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: -11,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: Platform.OS === 'android' ? 'rgba(255,255,255,0.62)' : 'rgba(255,255,255,0.54)',
    borderWidth: 1,
    borderColor: Platform.OS === 'android' ? 'rgba(255,255,255,0.64)' : 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
    shadowColor: Platform.OS === 'android' ? '#EEF7FF' : '#000',
    shadowOpacity: Platform.OS === 'android' ? 0.06 : 0.12,
    shadowRadius: Platform.OS === 'android' ? 16 : 16,
    shadowOffset: {width: 0, height: 8},
    elevation: Platform.OS === 'android' ? 1 : 2,
  },
  heroTint: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.12,
  },
  heroGlow: {
    position: 'absolute',
    right: -104,
    top: 30,
    width: 210,
    height: 210,
    borderRadius: 105,
    opacity: 0.38,
  },
  heroBottomFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 96,
    overflow: 'hidden',
  },
  heroBottomFadeBand: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heroBottomFadeTop: {
    opacity: 0,
  },
  heroBottomFadeMid: {
    opacity: 0.34,
  },
  heroBottomFadeLow: {
    opacity: 0.72,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    flexShrink: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginLeft: 'auto',
  },
  weatherRow: {
    alignSelf: 'stretch',
    alignItems: 'flex-end',
    marginTop: 8,
    marginBottom: 4,
    paddingRight: 12,
  },
  weatherTemp: {
    color: '#F41678',
    fontSize: fontSizes.xl,
    lineHeight: 22,
    fontWeight: fontWeights.bold,
  },
  weatherCity: {
    color: '#F41678',
    fontSize: fontSizes.lg15,
    lineHeight: 16,
    fontWeight: fontWeights.bold,
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
    fontWeight: '400',
    letterSpacing: -0.3,
    flexShrink: 1,
  },
  brandSub: {
    color: 'rgba(255,255,255,0.86)',
    fontSize: 13,
    marginTop: -1,
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
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  menuIconPink: {
    tintColor: '#fff',
  },
  // Good Morning UI
  greetingGlassSlab: {
    marginHorizontal: -9,
    marginTop: 30,
    marginBottom: 0,
    paddingHorizontal: 16,
    paddingTop: 5,
    paddingBottom: 48,
    borderTopLeftRadius: radii.card,
    borderTopRightRadius: radii.card,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: Platform.OS === 'android' ? 'rgba(255,255,255,0.58)' : 'rgba(255,255,255,0.48)',
    borderWidth: 1,
    borderColor: Platform.OS === 'android' ? 'rgba(255,255,255,0.66)' : 'rgba(255,255,255,0.24)',
    borderBottomWidth: 0,
    shadowColor: Platform.OS === 'android' ? '#DFF4FF' : '#000',
    shadowOpacity: Platform.OS === 'android' ? 0.05 : 0.1,
    shadowRadius: 18,
    shadowOffset: {width: 0, height: 8},
    elevation: Platform.OS === 'android' ? 1 : 2,
  },
  greeting: {
    color: '#fff',
    fontSize: fontSizes.xl,
    lineHeight: 30,
    fontWeight: fontWeights.bold,
    letterSpacing: -0.5,
  },
  greetingHeroSub: {
    marginTop: 2,
    color: colors.greetingSubGrey,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    lineHeight: 14,
  },
  familyCard: {
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
  heartBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentSoft,
    marginRight: 12,
    overflow: 'hidden',
  },
  cardBadgeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  titleTextWrap: {
    flexShrink: 1,
    marginRight: 8,
  },
  cardTitle: {
    color: colors.text,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    flexShrink: 1,
  },
  membersCount: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '500',
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
    fontSize: fontSizes.sm,
    fontWeight: '600',
  },
  viewAllArrow: {
    marginLeft: 6,
    color: colors.primary,
    fontSize: 18,
    lineHeight: 18,
  },
  profileGroupBody: {
    marginTop: 10,
  },
  profileHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileSelfBadge: {
    width: 32,
    height: 32,
    borderRadius: 0,
    marginRight: 8,
    overflow: 'hidden',
  },
  profileSelfBadgeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  profileHeaderTitleCopy: {
    flexShrink: 1,
  },
  profileChevron: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
    lineHeight: 12,
  },
  profileChevronPill: {
    marginLeft: 10,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryDark,
  },
  profilesPanel: {
    marginTop: 12,
  },
  profileGroupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileGroupHeaderLeft: {
    flex: 1,
    paddingRight: 12,
  },
  profileGroupHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileGroupHint: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '700',
    marginTop: 1,
  },
  profileSectionLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  profileGroupCard: {
    marginTop: 16,
    padding: 10,
    borderRadius: radii.strip,
    backgroundColor: colors.primarySoft,
  },
  membersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  memberItem: {
    alignItems: 'center',
    width: 56,
    paddingVertical: 4,
    paddingHorizontal: 4,
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
  memberYouLabel: {
    color: colors.accent,
    fontWeight: '900',
  },
  memberSelectedFrame: {
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderRadius: 16,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accent2,
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
    marginTop: 9,
    minHeight: 50,
    borderRadius: radii.strip,
    paddingVertical: 8,
    paddingHorizontal: 10,
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
    width: 32,
    height: 32,
    borderRadius: 12,
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
    fontSize: 14,
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
    fontSize: 20,
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
    marginHorizontal: 9,
    marginTop: 9,
    borderRadius: radii.card,
    padding: 10,
    backgroundColor: colors.surface,
    shadowColor: colors.shadow,
    shadowOpacity: 0.14,
    shadowRadius: 28,
    shadowOffset: {width: 0, height: 16},
    elevation: 5,
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appointmentHeaderIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentSoft,
    overflow: 'hidden',
  },
  appointmentHeaderLeft: {
    flex: 1,
    paddingRight: 12,
  },
  appointmentHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appointmentTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '900',
  },
  appointmentSubtitle: {
    marginTop: 2,
    color: colors.muted,
    fontSize: 10,
    fontWeight: '700',
  },
  appointmentListCard: {
    marginTop: 10,
    padding: 8,
    borderRadius: radii.strip,
    backgroundColor: colors.primarySoft,
  },
  appointmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  appointmentItemDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#DCEBFA',
  },
  appointmentBody: {
    flex: 1,
  },
  appointmentDetailsRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  appointmentDetailsLeft: {
    flex: 1,
    paddingRight: 10,
  },
  appointmentDivider: {
    width: 1,
    alignSelf: 'stretch',
    marginHorizontal: 10,
    backgroundColor: '#DCEBFA',
  },
  appointmentDetailsRight: {
    alignItems: 'flex-end',
  },
  appointmentRowIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    overflow: 'hidden',
  },
  appointmentRowIconImage: {
    width: 42,
    height: 42,
    resizeMode: 'cover',
  },
  doctorName: {
    color: colors.text,
    fontSize: fontSizes.lg16,
    fontWeight: fontWeights.bold,
  },
  appointmentRole: {
    color: colors.muted,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.extrabold700,
    marginTop: 2,
  },
  appointmentLocation: {
    marginTop: 3,
    color: colors.muted,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.extrabold,
  },
  appointmentDate: {
    color: colors.text,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
  },
  appointmentTime: {
    marginTop: 3,
    color: colors.primary,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
  },
  labCard: {
    marginHorizontal: 9,
    marginTop: 9,
    borderRadius: radii.card,
    padding: 10,
    backgroundColor: colors.surface,
    shadowColor: colors.shadow,
    shadowOpacity: 0.14,
    shadowRadius: 28,
    shadowOffset: {width: 0, height: 16},
    elevation: 5,
  },
  labCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labCardHeaderIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
    overflow: 'hidden',
  },
  labCardHeaderLeft: {
    flex: 1,
    paddingRight: 12,
  },
  labCardHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labCardTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '900',
  },
  labCardSubtitle: {
    marginTop: 2,
    color: colors.muted,
    fontSize: 10,
    fontWeight: '700',
  },
  labTabsRow: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 8,
  },
  labTab: {
    flex: 1,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF4FB',
  },
  labTabActive: {
    backgroundColor: colors.primary,
  },
  labTabText: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '900',
  },
  labTabTextActive: {
    color: '#fff',
  },
  labListCard: {
    marginTop: 10,
    padding: 8,
    borderRadius: radii.card,
    backgroundColor: colors.primarySoft,
  },
  labItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  labItemDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#DCEBFA',
  },
  labIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  labIconText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '900',
  },
  labItemBody: {
    flex: 1,
  },
  labItemTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '900',
  },
  labItemSource: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 10,
    fontWeight: '700',
  },
  labItemDate: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 10,
    fontWeight: '700',
  },
  labItemChevron: {
    color: colors.primary,
    fontSize: 26,
    lineHeight: 26,
    marginLeft: 6,
  },
  vaultCard: {
    marginHorizontal: 9,
    marginTop: 9,
    borderRadius: radii.card,
    padding: 10,
    backgroundColor: colors.surface,
    shadowColor: colors.shadow,
    shadowOpacity: 0.14,
    shadowRadius: 28,
    shadowOffset: {width: 0, height: 16},
    elevation: 5,
  },
  vaultCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  vaultCardHeaderIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
    overflow: 'hidden',
  },
  vaultCardHeaderLeft: {
    flex: 1,
    paddingRight: 12,
  },
  vaultCardHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vaultCardTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '900',
  },
  vaultCardSubtitle: {
    marginTop: 2,
    color: colors.muted,
    fontSize: 10,
    fontWeight: '700',
  },
  vaultListCard: {
    marginTop: 10,
    padding: 8,
    borderRadius: radii.card,
    backgroundColor: colors.primarySoft,
  },
  vaultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  vaultItemDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#DCEBFA',
  },
  vaultIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  vaultIconText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '900',
  },
  vaultItemBody: {
    flex: 1,
  },
  vaultItemTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '900',
  },
  vaultItemSubtitle: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 10,
    fontWeight: '700',
  },
  vaultItemDate: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 10,
    fontWeight: '700',
  },
  vaultItemChevron: {
    color: colors.primary,
    fontSize: 26,
    lineHeight: 26,
    marginLeft: 6,
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
    marginHorizontal: 9,
    marginTop: 18,
    flexDirection: 'row',
    gap: 12,
  },
  supportCard: {
    flex: 1,
    minHeight: 146,
    borderRadius: 10,
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
    marginHorizontal: 9,
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
