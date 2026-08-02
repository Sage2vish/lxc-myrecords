// ============================================================================
// FILE        : TabletDetailPanel.tsx
// PROJECT     : LXC-Health
// AUTHOR      : Vishal Kumar
// UPDATED BY  : Vishal Kumar
// VERSION     : 1.0.0
// DATE-TIME   : 02-August-2026 | 00:00 Hrs
//
// PURPOSE     : Shared tablet detail card used to show section summaries and
//               bullet-point context in the tablet shell.
// ============================================================================

import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../../theme/colors';

export function TabletDetailPanel({
  accent,
  eyebrow,
  summary,
  title,
  bullets,
}: {
  accent: string;
  eyebrow: string;
  summary: string;
  title: string;
  bullets: string[];
}) {
  return (
    <View style={[styles.panel, {borderColor: `${accent}33`}]}>
      <View style={styles.header}>
        <View style={[styles.badge, {backgroundColor: `${accent}14`}]}>
          <Text style={[styles.eyebrow, {color: accent}]}>{eyebrow}</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.summary}>{summary}</Text>
      <View style={styles.list}>
        {bullets.map(bullet => (
          <View key={bullet} style={styles.row}>
            <View style={[styles.dot, {backgroundColor: accent}]} />
            <Text style={styles.bullet}>{bullet}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderColor: '#E4ECF5',
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  chevron: {
    color: colors.muted,
    fontSize: 20,
    fontWeight: '700',
  },
  title: {
    color: colors.primaryDark,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 12,
  },
  summary: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
  },
  list: {
    gap: 10,
    marginTop: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  bullet: {
    flex: 1,
    color: colors.text,
    fontSize: 12,
    lineHeight: 18,
  },
});
