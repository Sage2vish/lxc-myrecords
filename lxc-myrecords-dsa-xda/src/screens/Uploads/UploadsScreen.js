// ============================================================================
// FILE        : UploadsScreen.js
// PROJECT     : LXC-Health
// AUTHOR      : Vishal Kumar
// UPDATED BY  : Vishal Kumar
// VERSION     : 1.0.0
// DATE-TIME   : 23-July-2026 | 20:39 Hrs
//
// PURPOSE     : Document uploads list screen for the DSA Tablet App — file
//               name, patient, type, size, and sync status.
// ============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../theme';
import { getUploads } from '../../storage/database';

const UploadCard = ({ upload }) => (
  <View style={[styles.card, Shadow.sm]}>
    <View style={styles.cardHeader}>
      <Text style={styles.fileName} numberOfLines={1}>{upload.file_name || 'Unnamed file'}</Text>
      <Text style={[styles.status, { color: upload.sync_status === 'pending' ? Colors.warning : Colors.success }]}>
        {upload.sync_status}
      </Text>
    </View>
    <Text style={styles.detail}>{upload.patient_name || 'Unknown patient'} • {upload.type || 'Document'}</Text>
    {upload.file_size ? <Text style={styles.caption}>{(upload.file_size / 1024).toFixed(1)} KB</Text> : null}
    <Text style={styles.caption}>{new Date(upload.created_at).toLocaleString()}</Text>
  </View>
);

export default function UploadsScreen() {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getUploads();
    setUploads(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Uploads</Text>
      </View>
      <FlatList
        data={uploads}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <UploadCard upload={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>{loading ? 'Loading...' : 'No uploads yet'}</Text>}
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
  fileName: { ...Typography.headingSmall, color: Colors.textPrimary, flex: 1 },
  status: { ...Typography.caption, fontWeight: '600', textTransform: 'uppercase' },
  detail: { ...Typography.bodySmall, color: Colors.textSecondary, marginTop: 2 },
  caption: { ...Typography.caption, color: Colors.textMuted, marginTop: 4 },
  empty: { ...Typography.bodyMedium, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.xl },
});
