import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Card} from '../components/Card';
import {ListRow} from '../components/ListRow';
import {PrimaryButton} from '../components/PrimaryButton';
import {Screen} from '../components/Screen';
import {SectionHeader} from '../components/SectionHeader';
import {useAppointments, usePrescriptions, useRecords, useVitals} from '../hooks/useHealthData';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';

export function HomeScreen() {
  const appointments = useAppointments();
  const records = useRecords();
  const prescriptions = usePrescriptions();
  const vitals = useVitals();

  return (
    <Screen>
      <SectionHeader
        title="MyHealthHub"
        subtitle="Your health records, visits, medicines, and daily vitals in one place."
      />
      <Card>
        <View style={styles.heroRow}>
          <View>
            <Text style={styles.kicker}>Next appointment</Text>
            <Text style={styles.heroTitle}>
              {appointments.data?.[0]?.doctor ?? 'No appointment booked'}
            </Text>
            <Text style={styles.heroSub}>
              {appointments.data?.[0]?.date ?? 'Book your next care visit'}
            </Text>
          </View>
          <Text style={styles.badge}>{appointments.data?.[0]?.status ?? 'Ready'}</Text>
        </View>
        <PrimaryButton label="Book Appointment" />
      </Card>

      <View style={styles.stats}>
        <Card>
          <Text style={styles.statValue}>{records.data?.length ?? 0}</Text>
          <Text style={styles.statLabel}>Records</Text>
        </Card>
        <Card>
          <Text style={styles.statValue}>{prescriptions.data?.length ?? 0}</Text>
          <Text style={styles.statLabel}>Medicines</Text>
        </Card>
        <Card>
          <Text style={styles.statValue}>{vitals.data?.length ?? 0}</Text>
          <Text style={styles.statLabel}>Vitals</Text>
        </Card>
      </View>

      <Card>
        <Text style={styles.cardTitle}>Today</Text>
        {vitals.data?.slice(0, 2).map(vital => (
          <ListRow
            key={vital.id}
            title={vital.label}
            detail={`${vital.value} • ${vital.recordedAt}`}
            meta={vital.trend}
          />
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroRow: {
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  kicker: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 6,
  },
  heroSub: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 4,
  },
  badge: {
    backgroundColor: colors.primarySoft,
    borderRadius: 8,
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
    height: 30,
    paddingHorizontal: 10,
    paddingTop: 6,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statValue: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  statLabel: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 4,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
});
