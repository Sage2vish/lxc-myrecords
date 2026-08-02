// ============================================================================
// FILE        : TabletSectionHeader.tsx
// PROJECT     : LXC-Health
// AUTHOR      : Vishal Kumar
// UPDATED BY  : Vishal Kumar
// VERSION     : 1.0.0
// DATE-TIME   : 02-August-2026 | 00:00 Hrs
//
// PURPOSE     : Reusable section header for tablet views with accent label and
//               back-navigation action.
// ============================================================================

import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {colors} from '../../theme/colors';

export function TabletSectionHeader({
  accent,
  onNavigateHome,
  subtitle,
  title,
}: {
  accent: string;
  onNavigateHome: () => void;
  subtitle: string;
  title: string;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.copy}>
          <Text style={[styles.kicker, {color: accent}]}>Tablet Section</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={onNavigateHome}
          style={({pressed}) => [styles.button, pressed && styles.pressed]}>
          <Text style={styles.buttonText}>Back to Home</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E4ECF5',
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 18,
  },
  copy: {
    flex: 1,
  },
  kicker: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.primaryDark,
    fontSize: 26,
    fontWeight: '800',
    marginTop: 8,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6,
  },
  button: {
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  buttonText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  pressed: {
    transform: [{scale: 0.99}],
    opacity: 0.92,
  },
});
