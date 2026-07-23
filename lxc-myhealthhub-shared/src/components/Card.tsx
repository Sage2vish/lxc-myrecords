// ============================================================================
// FILE        : Card.tsx
// PROJECT     : LXC-Health
// AUTHOR      : Vishal Kumar
// UPDATED BY  : Vishal Kumar
// VERSION     : 1.0.0
// DATE-TIME   : 23-July-2026 | 20:39 Hrs
//
// PURPOSE     : Shared bordered/shadowed container primitive used to group
//               content across screens.
// ============================================================================

import React, {PropsWithChildren} from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';

export function Card({children}: PropsWithChildren) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {height: 3, width: 0},
    elevation: 1,
  },
});
