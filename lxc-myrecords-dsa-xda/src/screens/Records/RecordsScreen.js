import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../theme';
import { getMedicalRecords } from '../../storage/database';

const RecordCard = ({ record }) => (
  <View style={[styles.card, Shadow.sm]}>
    <View style={styles.cardHeader}>
      <Text style={styles.date}>{record.record_date || 'No date'}</Text>
      <Text style={styles.syncBadge}>{record.sync_status}</Text>
    </View>
    <Text style={styles.patient}>{record.patient_name || 'Unknown patient'}</Text>
    <Text style={styles.doctor}>Dr. {record.doctor_name || 'Unknown'}</Text>
    {record.diagnosis ? <Text style={styles.field}><Text style={styles.label}>Dx: </Text>{record.diagnosis}</Text> : null}
    {record.treatment ? <Text style={styles.field}><Text style={styles.label}>Rx: </Text>{record.treatment}</Text> : null}
    {record.follow_up_date ? <Text style={styles.followUp}>Follow-up: {record.follow_up_date}</Text> : null}
  </View>
);

export default function RecordsScreen() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getMedicalRecords();
    setRecords(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Medical Records</Text>
      </View>
      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RecordCard record={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>{loading ? 'Loading...' : 'No records found'}</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.primary, padding: Spacing.md },
  title: { ...Typography.headingLarge, color: Colors.white },
  list: { padding: Spacing.md, paddingBottom: Spacing.xl },
  card: { backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.sm },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  date: { ...Typography.label, color: Colors.primary },
  syncBadge: { ...Typography.caption, color: Colors.textMuted, textTransform: 'uppercase' },
  patient: { ...Typography.headingSmall, color: Colors.textPrimary },
  doctor: { ...Typography.bodySmall, color: Colors.textSecondary, marginTop: 2 },
  field: { ...Typography.bodySmall, color: Colors.textPrimary, marginTop: 4 },
  label: { fontWeight: '600', color: Colors.primary },
  followUp: { ...Typography.caption, color: Colors.warning, marginTop: 6 },
  empty: { ...Typography.bodyMedium, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.xl },
});
