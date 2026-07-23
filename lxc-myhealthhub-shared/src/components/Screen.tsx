// ============================================================================
// FILE        : Screen.tsx
// PROJECT     : LXC-Health
// AUTHOR      : Vishal Kumar
// UPDATED BY  : Vishal Kumar
// VERSION     : 1.0.0
// DATE-TIME   : 23-July-2026 | 20:39 Hrs
//
// PURPOSE     : Shared screen wrapper — safe-area edges, optional
//               ScrollView, and consistent padding — used as the outer
//               container for most screens.
// ============================================================================

import React, {PropsWithChildren} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';

type Props = PropsWithChildren<{
  scroll?: boolean;
}>;

export function Screen({children, scroll = true}: Props) {
  const content = <View style={styles.content}>{children}</View>;

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.root}>
      {scroll ? (
        <ScrollView contentInsetAdjustmentBehavior="automatic">{content}</ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    gap: spacing.md,
    padding: spacing.md,
  },
});
