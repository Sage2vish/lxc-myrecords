// ============================================================================
// FILE        : AccountMenu.tsx
// PROJECT     : LXC-Health
// AUTHOR      : Vishal Kumar
// UPDATED BY  : Vishal Kumar
// VERSION     : 1.0.0
// DATE-TIME   : 26-July-2026 | 00:00 Hrs
//
// PURPOSE     : Premium slide-in account drawer opened from the top menu.
//               Uses a faster glass panel, sectioned navigation, and
//               settings entry points for App Settings / Health integrations.
// ============================================================================

import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../theme/colors';
import {commonTheme} from '../theme/common';
import {fontSizes, fontWeights} from '../theme/typography';
import {radii} from '../theme/radii';
import {spacing} from '../theme/spacing';
import {drawerGroups, drawerProfile, type MenuItem} from '../features/menu/menuData';
import type {SettingsSectionKey} from '../features/settings/settingsData';

type Props = {
  visible: boolean;
  onClose: () => void;
  onOpenProfile: () => void;
  onOpenSettings: (section?: SettingsSectionKey) => void;
  onLogout: () => void;
};

function clampWidth(value: number) {
  return Math.min(Math.max(value, commonTheme.drawer.minWidth), commonTheme.drawer.maxWidth);
}

function glyphToSize(glyph: string) {
  return glyph.length > 1 ? 18 : 20;
}

export function AccountMenu({
  visible,
  onClose,
  onOpenProfile,
  onOpenSettings,
  onLogout,
}: Props) {
  const {width: screenWidth} = useWindowDimensions();
  const drawerWidth = clampWidth(Math.round(screenWidth * commonTheme.drawer.widthRatio) - 50);
  const [mounted, setMounted] = useState(visible);
  const translateX = useRef(new Animated.Value(drawerWidth)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      translateX.setValue(drawerWidth);
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: commonTheme.motion.quickInMs,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: commonTheme.motion.fadeInMs,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    Animated.parallel([
      Animated.timing(translateX, {
        toValue: drawerWidth,
        duration: commonTheme.motion.quickOutMs,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: commonTheme.motion.fadeOutMs,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(({finished}) => {
      if (finished) {
        setMounted(false);
      }
    });
  }, [backdropOpacity, drawerWidth, translateX, visible]);

  const handleItemPress = (item: MenuItem) => {
    switch (item.key) {
      case 'view-profile':
        onOpenProfile();
        break;
      case 'family-members':
      case 'profile-management':
      case 'health-summary':
      case 'switch-family':
        onOpenProfile();
        break;
      case 'app-settings':
        onOpenSettings(item.focusSection);
        break;
      case 'apple-health':
      case 'android-health':
        onOpenSettings('integrations');
        break;
      case 'data-compliance':
      case 'privacy-settings':
      case 'data-export':
        onOpenSettings('privacy');
        break;
      case 'help-support':
      case 'whats-new':
      case 'refer-earn':
      case 'rate-app':
        onOpenSettings('support');
        break;
      case 'logout':
        onLogout();
        break;
      default:
        break;
    }
  };

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

      <Animated.View
        style={[
          styles.panel,
          {
            width: drawerWidth,
            transform: [{translateX}],
          },
        ]}>
        <SafeAreaView edges={['top', 'right', 'bottom']} style={styles.panelInner}>
          <View style={styles.grip} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
            <Pressable
              accessibilityRole="button"
              onPress={onOpenProfile}
              style={({pressed}) => [styles.profileCard, pressed && styles.pressed]}>
              <View style={styles.avatarWrap}>
                <View style={styles.avatarHalo} />
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{drawerProfile.initials}</Text>
                </View>
              </View>
              <View style={styles.profileCopy}>
                <Text style={styles.profileName}>{drawerProfile.name}</Text>
                <Text style={styles.profileEmail}>{drawerProfile.email}</Text>
                <View style={styles.profileCtaRow}>
                  <Text style={styles.profileCta}>{drawerProfile.cta}</Text>
                  <Text style={styles.chevron}>›</Text>
                </View>
              </View>
            </Pressable>

            {drawerGroups.map(group => (
              <View key={group.title} style={styles.group}>
                <Text style={styles.groupTitle}>{group.title}</Text>
                <View style={styles.groupCard}>
                  {group.items.map((item, index) => (
                    <Pressable
                      key={item.key}
                      accessibilityRole="button"
                      onPress={() => handleItemPress(item)}
                      style={({pressed}) => [
                        styles.row,
                        index !== group.items.length - 1 && styles.rowDivider,
                        pressed && styles.pressed,
                      ]}>
                      <View style={styles.rowLeft}>
                        <View style={[styles.glyph, {backgroundColor: item.tone}]}>
                          <Text
                            style={[
                              styles.glyphText,
                              {fontSize: glyphToSize(item.glyph)},
                              item.glyph.length > 1 && styles.appleGlyph,
                            ]}>
                            {item.glyph}
                          </Text>
                        </View>
                        <View style={styles.rowCopy}>
                          <View style={styles.rowTitleRow}>
                            <Text style={styles.rowTitle}>{item.title}</Text>
                            {item.badge ? <Text style={styles.badge}>{item.badge}</Text> : null}
                          </View>
                          <Text style={styles.rowSubtitle}>{item.subtitle}</Text>
                        </View>
                      </View>
                      <Text style={styles.chevron}>›</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ))}

            <Pressable
              accessibilityRole="button"
              onPress={onLogout}
              style={({pressed}) => [styles.logoutCard, pressed && styles.pressed]}>
              <View style={styles.logoutGlyph}>
                <Text style={styles.logoutGlyphText}>⎋</Text>
              </View>
              <View style={styles.logoutCopy}>
                <Text style={styles.logoutTitle}>Log Out</Text>
                <Text style={styles.logoutSubtitle}>Securely sign out</Text>
              </View>
              <Text style={styles.logoutChevron}>›</Text>
            </Pressable>

            <Text style={styles.version}>MyHealthHub v2.6.0</Text>
          </ScrollView>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: commonTheme.glass.backdrop,
  },
  panel: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: commonTheme.glass.panel,
    borderLeftColor: commonTheme.glass.edge,
    borderLeftWidth: 1,
    shadowColor: colors.shadow,
    shadowOpacity: 0.16,
    shadowRadius: 28,
    shadowOffset: {width: 0, height: 0},
    elevation: 18,
  },
  panelInner: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  grip: {
    alignSelf: 'center',
    backgroundColor: 'rgba(16, 37, 74, 0.10)',
    borderRadius: radii.pill,
    height: 4,
    marginBottom: spacing.md,
    marginTop: 8,
    width: 46,
  },
  scrollContent: {
    gap: 10,
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.md,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: commonTheme.glass.panelSoft,
    borderColor: commonTheme.glass.edge,
    borderRadius: commonTheme.cards.radius,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.sm,
  },
  avatarWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarHalo: {
    backgroundColor: 'rgba(244, 22, 120, 0.12)',
    borderRadius: 999,
    height: 70,
    position: 'absolute',
    width: 70,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderColor: 'rgba(255,255,255,0.9)',
    borderRadius: 999,
    borderWidth: 3,
    height: 58,
    justifyContent: 'center',
    width: 58,
  },
  avatarText: {
    color: colors.surface,
    fontSize: 22,
    fontWeight: fontWeights.bold,
  },
  profileCopy: {
    flex: 1,
    gap: 1,
  },
  profileName: {
    color: colors.text,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
  },
  profileEmail: {
    color: colors.muted,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.medium,
  },
  profileCtaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 3,
    marginTop: 1,
  },
  profileCta: {
    color: colors.primary,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
  },
  group: {
    gap: 4,
  },
  // Menu Groups Group Title ui chnages
  groupTitle: {
    color: colors.muted,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.extrabold700,
    letterSpacing: 0.8,
    paddingHorizontal: 2,
    textTransform: 'uppercase',
  },
  groupCard: {
    backgroundColor: commonTheme.glass.panelSoft,
    borderColor: commonTheme.glass.edge,
    borderRadius: commonTheme.cards.radius,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    minHeight: commonTheme.drawer.rowHeight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  rowDivider: {
    borderBottomColor: 'rgba(16, 37, 74, 0.08)',
    borderBottomWidth: 1,
  },
  rowLeft: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  glyph: {
    alignItems: 'center',
    borderRadius: 16,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  glyphText: {
    color: colors.surface,
    fontWeight: fontWeights.bold,
  },
  appleGlyph: {
    transform: [{translateY: -1}],
  },
  rowCopy: {
    flex: 1,
    gap: 1,
  },
  rowTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  // Menu Groups Title ui chnages
  rowTitle: {
    color: colors.text,
    flex: 1,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
  },
  badge: {
    backgroundColor: colors.accentSoft,
    borderRadius: radii.pill,
    color: colors.accent,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },

  // Menu Groups Subtitle ui chnages
  rowSubtitle: {
    color: colors.muted,
    fontSize: fontSizes.md,
    lineHeight: 18,
  },
  chevron: {
    color: colors.muted,
    fontSize: 25,
    marginTop: -2,
  },
  logoutCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 244, 246, 0.92)',
    borderColor: 'rgba(244, 22, 120, 0.14)',
    borderRadius: commonTheme.cards.radius,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.sm,
  },
  logoutGlyph: {
    alignItems: 'center',
    backgroundColor: 'rgba(244, 22, 120, 0.10)',
    borderRadius: 16,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  logoutGlyphText: {
    color: colors.danger,
    fontSize: 18,
    fontWeight: fontWeights.bold,
  },
  logoutCopy: {
    flex: 1,
    gap: 1,
  },
  logoutTitle: {
    color: colors.danger,
    fontSize: fontSizes.lg16,
    fontWeight: fontWeights.bold,
  },
  logoutSubtitle: {
    color: colors.muted,
    fontSize: fontSizes.lg,
  },
  logoutChevron: {
    color: colors.danger,
    fontSize: 25,
  },
  version: {
    color: colors.muted,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    textAlign: 'center',
    paddingBottom: spacing.xs,
  },
  pressed: {
    opacity: 0.72,
  },
});
