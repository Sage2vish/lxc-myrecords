// ============================================================================
// FILE        : PatientsScreen.js
// PROJECT     : LXC-Health
// AUTHOR      : Vishal Kumar
// UPDATED BY  : Vishal Kumar
// VERSION     : 1.0.0
// DATE-TIME   : 23-July-2026 | 20:39 Hrs
//
// PURPOSE     : Patient list/search screen for the DSA Tablet App —
//               profile, assigned doctor, address, with delete support.
// ============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../theme';
import { getPatients, deletePatient } from '../../storage/database';

const PatientCard = ({ patient, onDelete }) => (
  <View style={[styles.card, Shadow.sm]}>
    <View style={styles.cardHeader}>
      <Text style={styles.patientName}>{patient.name}</Text>
      <TouchableOpacity onPress={() => onDelete(patient.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Text style={styles.deleteBtn}>✕</Text>
      </TouchableOpacity>
    </View>
    <Text style={styles.detail}>{patient.phone || 'No phone'} • {patient.gender || '—'} • {patient.age ? `${patient.age}y` : '—'}</Text>
    {patient.doctor_name ? <Text style={styles.detail}>Dr. {patient.doctor_name}</Text> : null}
    <Text style={styles.address} numberOfLines={1}>{patient.address || 'No address'}</Text>
  </View>
);

export default function PatientsScreen() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (q = '') => {
    setLoading(true);
    const data = await getPatients(q);
    setPatients(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = (id) => {
    Alert.alert('Delete Patient', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await deletePatient(id); load(search); } },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Patients</Text>
        <TextInput
          style={styles.search}
          placeholder="Search by name or phone..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={(v) => { setSearch(v); load(v); }}
        />
      </View>
      <FlatList
        data={patients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PatientCard patient={item} onDelete={handleDelete} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>{loading ? 'Loading...' : 'No patients found'}</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.primary, padding: Spacing.md },
  title: { ...Typography.headingLarge, color: Colors.white, marginBottom: Spacing.sm },
  search: {
    backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: Radius.md,
    padding: Spacing.sm, color: Colors.white, ...Typography.bodyMedium,
  },
  list: { padding: Spacing.md, paddingBottom: Spacing.xl },
  card: { backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.sm },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  patientName: { ...Typography.headingSmall, color: Colors.textPrimary, flex: 1 },
  deleteBtn: { color: Colors.danger, fontSize: 16 },
  detail: { ...Typography.bodySmall, color: Colors.textSecondary, marginTop: 2 },
  address: { ...Typography.caption, color: Colors.textMuted, marginTop: 4 },
  empty: { ...Typography.bodyMedium, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.xl },
});
