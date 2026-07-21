import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../theme';
import { getGeoVisits, saveGeoVisit } from '../../storage/database';

const VisitCard = ({ visit }) => (
  <View style={[styles.card, Shadow.sm]}>
    <Text style={styles.patientName}>{visit.patient_name || 'Unknown patient'}</Text>
    <Text style={styles.detail}>Dr. {visit.doctor_name || 'Unknown'} • {visit.visit_type || 'Visit'}</Text>
    <Text style={styles.coords}>
      {visit.latitude?.toFixed(5)}, {visit.longitude?.toFixed(5)}
    </Text>
    {visit.address ? <Text style={styles.address} numberOfLines={1}>{visit.address}</Text> : null}
    <Text style={styles.time}>{new Date(visit.visited_at).toLocaleString()}</Text>
  </View>
);

export default function GeoTrackingScreen() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getGeoVisits();
    setVisits(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Geo Tracking</Text>
        <Text style={styles.subtitle}>Field visit log</Text>
      </View>
      <FlatList
        data={visits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <VisitCard visit={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>{loading ? 'Loading...' : 'No geo visits recorded'}</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.primary, padding: Spacing.md },
  title: { ...Typography.headingLarge, color: Colors.white },
  subtitle: { ...Typography.bodySmall, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  list: { padding: Spacing.md, paddingBottom: Spacing.xl },
  card: { backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.sm },
  patientName: { ...Typography.headingSmall, color: Colors.textPrimary },
  detail: { ...Typography.bodySmall, color: Colors.textSecondary, marginTop: 2 },
  coords: { ...Typography.caption, color: Colors.primary, marginTop: 4, fontFamily: 'monospace' },
  address: { ...Typography.caption, color: Colors.textMuted, marginTop: 2 },
  time: { ...Typography.caption, color: Colors.textMuted, marginTop: 4 },
  empty: { ...Typography.bodyMedium, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.xl },
});
