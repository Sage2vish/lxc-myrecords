import React, {useEffect, useState} from 'react';
import {Image, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {colors, fetchDeviceWeather, getHeroTheme, type WeatherSummary} from '../../common';
import {
  useAppointments,
  usePrescriptions,
  useRecords,
  useVitals,
} from '../../common';
import {TabletSectionHeader} from '../components/TabletSectionHeader';
import {TabletStatCard} from '../components/TabletStatCard';
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

const sectionMeta: Record<
  Exclude<TabletSectionKey, 'home'>,
  {title: string; subtitle: string; accent: string}
> = {
  health: {
    title: 'Health Overview',
    subtitle: 'Vitals, medications, and shared wellness context.',
    accent: colors.primary,
  },
  schedules: {
    title: 'Schedules',
    subtitle: 'Appointments, follow-ups, and calendar-aware actions.',
    accent: colors.sky,
  },
  vault: {
    title: 'Vault',
    subtitle: 'Family records, documents, and secure uploads.',
    accent: '#7D5AF2',
  },
  reports: {
    title: 'Reports',
    subtitle: 'Labs, summaries, and the latest uploaded results.',
    accent: '#FB7543',
  },
};

function DetailRow({
  title,
  detail,
  meta,
}: {
  title: string;
  detail: string;
  meta: string;
}) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailRowBody}>
        <Text style={styles.detailRowTitle}>{title}</Text>
        <Text style={styles.detailRowDetail}>{detail}</Text>
      </View>
      <Text style={styles.detailRowMeta}>{meta}</Text>
    </View>
  );
}

export function TabletSectionScreen({
  activeDetail,
  onNavigateHome,
  onOpenDetail,
  section,
}: {
  activeDetail: TabletDetailKey;
  onNavigateHome: () => void;
  onOpenDetail: (detail: TabletDetailKey) => void;
  section: Exclude<TabletSectionKey, 'home'>;
}) {
  const heroTheme = getHeroTheme();
  const {data: appointments = []} = useAppointments();
  const {data: records = []} = useRecords();
  const {data: vitals = []} = useVitals();
  const {data: prescriptions = []} = usePrescriptions();
  const [weather, setWeather] = useState(defaultWeather);

  useEffect(() => {
    fetchDeviceWeather().then(setWeather).catch(() => undefined);
  }, []);

  const meta = sectionMeta[section];
  const detail = tabletDetails[activeDetail];

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <TabletSectionHeader
        title={meta.title}
        subtitle={meta.subtitle}
        accent={meta.accent}
        onNavigateHome={onNavigateHome}
      />

      <View style={[styles.heroStrip, {backgroundColor: `${meta.accent}10`}]}>
        <View style={styles.heroStripLeft}>
          <Image source={heroTheme.bannerImage} style={styles.heroPreview} />
          <View style={styles.heroCopy}>
            <Text style={styles.heroLabel}>{weather.city}</Text>
            <Text style={styles.heroValue}>{Math.round(weather.tempC)}°C · {weather.condition}</Text>
          </View>
        </View>
        <View style={styles.heroStripRight}>
          <Text style={styles.heroSummaryTitle}>{detail.title}</Text>
          <Text style={styles.heroSummaryBody}>{detail.summary}</Text>
        </View>
      </View>

      {section === 'health' ? (
        <>
          <View style={styles.grid3}>
            <TabletStatCard title="Vitals" value={`${vitals.length}`} subtitle="Readings in view" />
            <TabletStatCard
              title="Prescriptions"
              value={`${prescriptions.length}`}
              subtitle="Active medication plan"
            />
            <TabletStatCard title="Records" value={`${records.length}`} subtitle="Files and summaries" />
          </View>
          <View style={styles.sectionCard}>
            <Text style={styles.sectionCardTitle}>Latest Vital Readings</Text>
            {vitals.map(vital => (
              <DetailRow
                key={vital.id}
                title={vital.label}
                detail={vital.value}
                meta={vital.recordedAt}
              />
            ))}
          </View>
        </>
      ) : null}

      {section === 'schedules' ? (
        <>
          <View style={styles.grid3}>
            <TabletStatCard
              title="Appointments"
              value={`${appointments.length}`}
              subtitle="Tracked visits"
            />
            <TabletStatCard
              title="Next Visit"
              value={appointments[0]?.date ?? 'Today'}
              subtitle={appointments[0]?.doctor ?? 'No appointments'}
            />
            <TabletStatCard title="Focus" value="Family" subtitle="Shared calendar view" />
          </View>
          <View style={styles.sectionCard}>
            <Text style={styles.sectionCardTitle}>Appointment Timeline</Text>
            {appointments.map(appointment => (
              <DetailRow
                key={appointment.id}
                title={appointment.doctor}
                detail={`${appointment.specialty} · ${appointment.location}`}
                meta={appointment.date}
              />
            ))}
            <Pressable
              accessibilityRole="button"
              onPress={() => onOpenDetail('appointments')}
              style={({pressed}) => [styles.secondaryButton, pressed && styles.pressed]}>
              <Text style={styles.secondaryButtonText}>Open appointment detail surface</Text>
            </Pressable>
          </View>
        </>
      ) : null}

      {section === 'vault' ? (
        <>
          <View style={styles.grid3}>
            <TabletStatCard
              title="Records"
              value={`${records.length}`}
              subtitle="Stored documents"
            />
            <TabletStatCard
              title="Latest Upload"
              value={records[0]?.date ?? 'Today'}
              subtitle={records[0]?.title ?? 'No uploads'}
            />
            <TabletStatCard title="Security" value="Encrypted" subtitle="Family access only" />
          </View>
          <View style={styles.sectionCard}>
            <Text style={styles.sectionCardTitle}>Vault Contents</Text>
            {records.map(record => (
              <DetailRow
                key={record.id}
                title={record.title}
                detail={`${record.provider} · ${record.summary}`}
                meta={record.date}
              />
            ))}
            <Pressable
              accessibilityRole="button"
              onPress={() => onOpenDetail('document-vault')}
              style={({pressed}) => [styles.secondaryButton, pressed && styles.pressed]}>
              <Text style={styles.secondaryButtonText}>Open vault detail surface</Text>
            </Pressable>
          </View>
        </>
      ) : null}

      {section === 'reports' ? (
        <>
          <View style={styles.grid3}>
            <TabletStatCard
              title="Reports"
              value={`${records.length}`}
              subtitle="Recent report items"
            />
            <TabletStatCard title="Reviewed" value="3" subtitle="This week" />
            <TabletStatCard title="Status" value="Ready" subtitle="Awaiting deeper review" />
          </View>
          <View style={styles.sectionCard}>
            <Text style={styles.sectionCardTitle}>Recent Reports</Text>
            {records.map(record => (
              <DetailRow
                key={record.id}
                title={record.title}
                detail={record.provider}
                meta={record.date}
              />
            ))}
            <Pressable
              accessibilityRole="button"
              onPress={() => onOpenDetail('lab-reports')}
              style={({pressed}) => [styles.secondaryButton, pressed && styles.pressed]}>
              <Text style={styles.secondaryButtonText}>Open report detail surface</Text>
            </Pressable>
          </View>
        </>
      ) : null}

      <View style={styles.detailCard}>
        <Text style={[styles.detailKicker, {color: detail.accent}]}>{detail.eyebrow}</Text>
        <Text style={styles.detailTitle}>{detail.title}</Text>
        <Text style={styles.detailSummary}>{detail.summary}</Text>
        <View style={styles.detailList}>
          {detail.bullets.map(bullet => (
            <View key={bullet} style={styles.detailListRow}>
              <View style={[styles.detailListDot, {backgroundColor: detail.accent}]} />
              <Text style={styles.detailListText}>{bullet}</Text>
            </View>
          ))}
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
  heroStrip: {
    borderRadius: 18,
    padding: 16,
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 18,
  },
  heroStripLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  heroPreview: {
    width: 108,
    height: 72,
    borderRadius: 14,
  },
  heroCopy: {
    flex: 1,
  },
  heroLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  heroValue: {
    color: colors.accent,
    fontSize: 22,
    fontWeight: '800',
    marginTop: 4,
  },
  heroStripRight: {
    flex: 1,
    justifyContent: 'center',
  },
  heroSummaryTitle: {
    color: colors.primaryDark,
    fontSize: 18,
    fontWeight: '800',
  },
  heroSummaryBody: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 6,
    lineHeight: 18,
  },
  pressed: {
    transform: [{scale: 0.99}],
    opacity: 0.92,
  },
  grid3: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
    flexWrap: 'wrap',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E4ECF5',
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginTop: 14,
  },
  sectionCardTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopColor: '#EDF2F7',
    borderTopWidth: 1,
    paddingVertical: 14,
    gap: 14,
  },
  detailRowBody: {
    flex: 1,
  },
  detailRowTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
  },
  detailRowDetail: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 4,
    lineHeight: 18,
  },
  detailRowMeta: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
    minWidth: 100,
    textAlign: 'right',
  },
  secondaryButton: {
    alignSelf: 'flex-start',
    marginTop: 14,
    borderRadius: 999,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E4ECF5',
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    marginTop: 14,
  },
  detailKicker: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  detailTitle: {
    color: colors.primaryDark,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 8,
  },
  detailSummary: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
  },
  detailList: {
    gap: 10,
    marginTop: 14,
  },
  detailListRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  detailListDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  detailListText: {
    flex: 1,
    color: colors.text,
    fontSize: 12,
    lineHeight: 18,
  },
});
