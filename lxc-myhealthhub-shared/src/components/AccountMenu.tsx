import React, {useEffect, useRef, useState} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';

const PANEL_WIDTH = 260;

type Props = {
  visible: boolean;
  onClose: () => void;
  onViewProfile: () => void;
  onLogout: () => void;
};

export function AccountMenu({visible, onClose, onViewProfile, onLogout}: Props) {
  const [mounted, setMounted] = useState(visible);
  const translateX = useRef(new Animated.Value(PANEL_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.parallel([
        Animated.timing(translateX, {toValue: 0, duration: 260, useNativeDriver: true}),
        Animated.timing(backdropOpacity, {toValue: 1, duration: 260, useNativeDriver: true}),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateX, {toValue: PANEL_WIDTH, duration: 220, useNativeDriver: true}),
        Animated.timing(backdropOpacity, {toValue: 0, duration: 220, useNativeDriver: true}),
      ]).start(({finished}) => {
        if (finished) {
          setMounted(false);
        }
      });
    }
  }, [visible, translateX, backdropOpacity]);

  if (!mounted) {
    return null;
  }

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Animated.View
        style={[styles.backdrop, {opacity: backdropOpacity}]}
        pointerEvents={visible ? 'auto' : 'none'}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityRole="button" />
      </Animated.View>

      <Animated.View style={[styles.panel, {transform: [{translateX}]}]}>
        <SafeAreaView edges={['top', 'right', 'bottom']} style={styles.panelInner}>
          <Text style={styles.header}>Account</Text>

          <Pressable
            accessibilityRole="button"
            onPress={onViewProfile}
            style={({pressed}) => [styles.row, pressed && styles.rowPressed]}>
            <Text style={styles.rowLabel}>View Profile</Text>
            <Text style={styles.rowArrow}>›</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={onLogout}
            style={({pressed}) => [styles.row, pressed && styles.rowPressed]}>
            <Text style={[styles.rowLabel, styles.logoutLabel]}>Log Out</Text>
          </Pressable>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 20, 45, 0.4)',
  },
  panel: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: PANEL_WIDTH,
    backgroundColor: colors.surface,
    shadowColor: colors.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: {width: 0, height: 0},
    elevation: 16,
  },
  panelInner: {
    flex: 1,
    padding: spacing.lg,
  },
  header: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: spacing.sm,
  },
  row: {
    alignItems: 'center',
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  rowPressed: {
    opacity: 0.6,
  },
  rowLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  rowArrow: {
    color: colors.muted,
    fontSize: 20,
  },
  logoutLabel: {
    color: colors.danger,
  },
});
