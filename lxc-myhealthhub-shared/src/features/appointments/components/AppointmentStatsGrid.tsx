import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {colors} from '../../../theme/colors';
import {fontSizes, fontWeights} from '../../../theme/typography';
import {radii} from '../../../theme/radii';
import {spacing} from '../../../theme/spacing';
import type {AppointmentStat} from '../appointmentsData';

type Props = {
  stats: AppointmentStat[];
};

export function AppointmentStatsGrid({stats}: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.grid}>
      {stats.map(stat => (
        <View key={stat.key} style={[styles.card, {backgroundColor: stat.tint}]}>
          <View style={[styles.dot, {backgroundColor: stat.tone}]} />
          <Text style={[styles.value, {color: stat.tone}]}>{stat.value}</Text>
          <Text style={styles.label}>{stat.label}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: spacing.sm,
    paddingBottom: 2,
  },
  card: {
    borderRadius: radii['2xl'],
    minHeight: 104,
    padding: 10,
    width: 94,
  },
  dot: {
    borderRadius: 999,
    height: 8,
    marginBottom: 8,
    width: 8,
  },
  value: {
    fontSize: 18,
    fontWeight: fontWeights.bold,
    lineHeight: 20,
  },
  label: {
    color: colors.text,
    fontSize: fontSizes.xs,
    lineHeight: 14,
    marginTop: 4,
  },
});
