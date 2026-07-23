// ============================================================================
// FILE        : AppointmentsScreen.js
// PROJECT     : LXC-Health
// AUTHOR      : Vishal Kumar
// UPDATED BY  : Vishal Kumar
// VERSION     : 1.0.0
// DATE-TIME   : 23-July-2026 | 20:39 Hrs
//
// PURPOSE     : Appointments list screen for the DSA Tablet App — booking
//               status, patient/doctor/date/type, with delete support.
// ============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../theme';
import { getAppointments, deleteAppointment } from '../../storage/database';

const STATUS_COLORS = {
  scheduled: Colors.info,
  completed: Colors.success,
  cancelled: Colors.danger,
};

const AppointmentCard = ({ appt, onDelete }) => (
  <View style={[styles.card, Shadow.sm]}>
    <View style={styles.cardHeader}>
      <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[appt.status] || Colors.textMuted }]}>
        <Text style={styles.statusText}>{appt.status}</Text>
      </View>
      <TouchableOpacity onPress={() => onDelete(appt.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Text style={styles.deleteBtn}>✕</Text>
      </TouchableOpacity>
    </View>
    <Text style={styles.patient}>{appt.patient_name || 'Unknown patient'}</Text>
    <Text style={styles.detail}>Dr. {appt.doctor_name || 'Unknown'}</Text>
    <Text style={styles.detail}>{appt.date} at {appt.time} • {appt.type || 'General'}</Text>
    {appt.notes ? <Text style={styles.notes} numberOfLines={2}>{appt.notes}</Text> : null}
  </View>
);

export default function AppointmentsScreen() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getAppointments();
    setAppointments(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = (id) => {
    Alert.alert('Delete Appointment', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await deleteAppointment(id); load(); } },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Appointments</Text>
      </View>
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AppointmentCard appt={item} onDelete={handleDelete} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>{loading ? 'Loading...' : 'No appointments found'}</Text>}
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  statusBadge: { borderRadius: Radius.sm, paddingHorizontal: 8, paddingVertical: 2 },
  statusText: { ...Typography.caption, color: Colors.white, textTransform: 'capitalize' },
  deleteBtn: { color: Colors.danger, fontSize: 16 },
  patient: { ...Typography.headingSmall, color: Colors.textPrimary },
  detail: { ...Typography.bodySmall, color: Colors.textSecondary, marginTop: 2 },
  notes: { ...Typography.caption, color: Colors.textMuted, marginTop: 6, fontStyle: 'italic' },
  empty: { ...Typography.bodyMedium, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.xl },
});
