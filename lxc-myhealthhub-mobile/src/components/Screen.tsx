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
    <SafeAreaView edges={['left', 'right']} style={styles.root}>
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
