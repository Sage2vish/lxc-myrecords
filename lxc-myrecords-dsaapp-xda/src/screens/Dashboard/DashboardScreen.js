import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../theme';
import { getDashboardStats, getRecentActivity } from '../../storage/database';

const StatCard = ({ label, value, color }) => (
  <View style={[styles.statCard, Shadow.sm]}>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export default function DashboardScreen() {
  const [stats, setStats] = useState({ totalPatients: 0, totalDoctors: 0, todayAppointments: 0, pendingUploads: 0 });
  const [activity, setActivity] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const [s, a] = await Promise.all([getDashboardStats(), getRecentActivity(10)]);
    setStats(s);
    setActivity(a);
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lexvora DSA</Text>
        <Text style={styles.subtitle}>MyRecords Field Agent</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          <StatCard label="Patients" value={stats.totalPatients} color={Colors.primary} />
          <StatCard label="Doctors" value={stats.totalDoctors} color={Colors.success} />
          <StatCard label="Today's Appts" value={stats.todayAppointments} color={Colors.warning} />
          <StatCard label="Pending Uploads" value={stats.pendingUploads} color={Colors.danger} />
        </View>

        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {activity.length === 0 ? (
          <Text style={styles.emptyText}>No recent activity</Text>
        ) : (
          activity.map((item) => (
            <View key={item.id} style={[styles.activityItem, Shadow.sm]}>
              <Text style={styles.activityAction}>{item.action}</Text>
              <Text style={styles.activityDesc} numberOfLines={1}>{item.description}</Text>
              <Text style={styles.activityTime}>{new Date(item.created_at).toLocaleString()}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.primary, padding: Spacing.md, paddingBottom: Spacing.lg },
  title: { ...Typography.headingLarge, color: Colors.white },
  subtitle: { ...Typography.bodySmall, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  content: { padding: Spacing.md, paddingBottom: Spacing.xl },
  sectionTitle: { ...Typography.headingSmall, color: Colors.textPrimary, marginBottom: Spacing.sm, marginTop: Spacing.md },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  statCard: {
    flex: 1, minWidth: '45%', backgroundColor: Colors.surface,
    borderRadius: Radius.md, padding: Spacing.md, alignItems: 'center',
  },
  statValue: { ...Typography.displaySmall, fontWeight: '700' },
  statLabel: { ...Typography.caption, color: Colors.textSecondary, marginTop: 4 },
  activityItem: {
    backgroundColor: Colors.surface, borderRadius: Radius.md,
    padding: Spacing.md, marginBottom: Spacing.sm,
  },
  activityAction: { ...Typography.label, color: Colors.primary, textTransform: 'uppercase' },
  activityDesc: { ...Typography.bodyMedium, color: Colors.textPrimary, marginTop: 2 },
  activityTime: { ...Typography.caption, color: Colors.textMuted, marginTop: 4 },
  emptyText: { ...Typography.bodyMedium, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.lg },
});
