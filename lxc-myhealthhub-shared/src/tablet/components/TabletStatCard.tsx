// ============================================================================
// FILE        : TabletStatCard.tsx
// PROJECT     : LXC-Health
// AUTHOR      : Vishal Kumar
// UPDATED BY  : Vishal Kumar
// VERSION     : 1.0.0
// DATE-TIME   : 02-August-2026 | 00:00 Hrs
//
// PURPOSE     : Small tablet metric card for section overviews and summary
//               counts.
// ============================================================================

import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../../theme/colors';

export function TabletStatCard({
  subtitle,
  title,
  value,
}: {
  subtitle: string;
  title: string;
  value: string;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderColor: '#E4ECF5',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  title: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  value: {
    color: colors.primaryDark,
    fontSize: 22,
    fontWeight: '800',
    marginTop: 8,
  },
  subtitle: {
    color: colors.text,
    fontSize: 12,
    marginTop: 6,
    lineHeight: 18,
  },
});
