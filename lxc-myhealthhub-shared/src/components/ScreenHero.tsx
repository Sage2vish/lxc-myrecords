// ============================================================================
// FILE        : ScreenHero.tsx
// PROJECT     : LXC-Health
// AUTHOR      : Vishal Kumar
// UPDATED BY  : Vishal Kumar
// VERSION     : 1.0.0
// DATE-TIME   : 26-July-2026 | 00:00 Hrs
//
// PURPOSE     : Shared top hero shell used by major screens. Keeps the brand
//               row, weather chip, menu actions, and day-part background in
//               one reusable place while allowing each screen to supply its
//               own title and subtitle.
// ============================================================================

import React from 'react';
import {
  Image,
  ImageBackground,
  ImageSourcePropType,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors} from '../theme/colors';
import {fontSizes, fontWeights} from '../theme/typography';
import {radii} from '../theme/radii';
import {spacing} from '../theme/spacing';

type Props = {
  backgroundImage: ImageSourcePropType;
  title: string;
  subtitle: string;
  weatherCity: string;
  weatherTemp: string;
  onPressMenu: () => void;
  onPressProfile: () => void;
  onPressNotifications: () => void;
  notificationCount?: number;
  textColor?: string;
};

export function ScreenHero({
  backgroundImage,
  title,
  subtitle,
  weatherCity,
  weatherTemp,
  onPressMenu,
  onPressProfile,
  onPressNotifications,
  notificationCount = 3,
  textColor = colors.surface,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <ImageBackground
      source={backgroundImage}
      resizeMode="cover"
      style={[
        styles.hero,
        Platform.OS === 'ios' && {
          marginTop: -insets.top,
          paddingTop: insets.top + 18,
        },
      ]}>
      <View style={styles.tint} />
      <View style={styles.glow} />
      <View pointerEvents="none" style={styles.bottomFade}>
        <View style={[styles.bottomFadeBand, styles.bottomFadeTop]} />
        <View style={[styles.bottomFadeBand, styles.bottomFadeMid]} />
        <View style={[styles.bottomFadeBand, styles.bottomFadeLow]} />
        <View style={styles.bottomFadeBand} />
      </View>

      <View style={styles.heroContent}>
        <View style={styles.glassHeader}>
          <View style={styles.topRow}>
            <View style={styles.brandRow}>
              <Image source={require('../../assets/myhealthhub-icon.png')} style={styles.logo} />
              <View style={styles.brandTextWrap}>
                <Text style={[styles.brandTitle, {color: textColor}]}>MyHealthHub</Text>
                <Text style={[styles.brandSub, {color: textColor}]}>Space</Text>
              </View>
            </View>

            <View style={styles.headerActions}>
              <Pressable
                accessibilityRole="button"
                onPress={onPressNotifications}
                style={styles.bellButton}>
                <Text style={styles.bell}>🔔</Text>
                <Text style={styles.badge}>{notificationCount}</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={onPressProfile}
                style={styles.profileAvatar}>
                <Text style={styles.profileAvatarText}>P</Text>
              </Pressable>
              <Pressable
                accessibilityLabel="Account menu"
                accessibilityRole="button"
                onPress={onPressMenu}
                style={styles.menuButton}>
                <Image
                  source={require('../../assets/nav-more-icon-blue.png')}
                  style={[styles.menuIcon, styles.menuIconPink]}
                />
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.weatherRow}>
          <Text style={styles.weatherCity}>{weatherCity}</Text>
          <Text style={styles.weatherTemp}>{weatherTemp}</Text>
        </View>

        <View style={styles.greetingGlassSlab}>
          <Text style={[styles.greeting, {color: textColor}]}>{title}</Text>
          <Text style={styles.greetingHeroSub}>{subtitle}</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  hero: {
    minHeight: 208,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 68,
    overflow: 'visible',
  },
  tint: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.12,
  },
  glow: {
    position: 'absolute',
    right: -104,
    top: 30,
    width: 210,
    height: 210,
    borderRadius: 105,
    opacity: 0.38,
  },
  bottomFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 96,
    overflow: 'hidden',
  },
  bottomFadeBand: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bottomFadeTop: {
    opacity: 0,
  },
  bottomFadeMid: {
    opacity: 0.34,
  },
  bottomFadeLow: {
    opacity: 0.72,
  },
  heroContent: {
    flex: 1,
  },
  glassHeader: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.54)',
    borderColor: 'rgba(255,255,255,0.24)',
    borderRadius: radii['2xl'],
    borderWidth: 1,
    flexDirection: 'row',
    marginHorizontal: -11,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    overflow: 'hidden',
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  brandRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    flexShrink: 1,
  },
  logo: {
    width: 42,
    height: 42,
    borderRadius: 13,
    marginRight: 10,
  },
  brandTextWrap: {
    flexShrink: 1,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: fontWeights.normal,
    letterSpacing: -0.3,
    flexShrink: 1,
  },
  brandSub: {
    fontSize: 13,
    marginTop: -1,
  },
  headerActions: {
    marginLeft: 'auto',
    alignItems: 'center',
    flexDirection: 'row',
  },
  bellButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 2,
  },
  bell: {
    color: '#fff',
    fontSize: 20,
  },
  badge: {
    position: 'absolute',
    right: 0,
    top: 0,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    textAlign: 'center',
    lineHeight: 18,
    overflow: 'hidden',
    backgroundColor: colors.accent,
    color: colors.surface,
    fontSize: 10,
    fontWeight: '900',
  },
  profileAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 2,
  },
  profileAvatarText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '900',
  },
  menuButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  menuIconPink: {
    tintColor: '#fff',
  },
  weatherRow: {
    alignItems: 'flex-end',
    alignSelf: 'stretch',
    marginTop: 8,
    marginBottom: 4,
    paddingRight: 12,
  },
  weatherCity: {
    color: '#F41678',
    fontSize: fontSizes.lg15,
    fontWeight: fontWeights.bold,
    lineHeight: 16,
  },
  weatherTemp: {
    color: '#F41678',
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    lineHeight: 22,
  },
  greetingGlassSlab: {
    marginHorizontal: -9,
    marginTop: 30,
    marginBottom: 0,
    paddingHorizontal: 16,
    paddingTop: 5,
    paddingBottom: 48,
    borderTopLeftRadius: radii.card,
    borderTopRightRadius: radii.card,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: 'rgba(255,255,255,0.68)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: {width: 0, height: 8},
    elevation: 2,
  },
  greeting: {
    color: '#fff',
    fontSize: fontSizes.xl,
    lineHeight: 30,
    fontWeight: fontWeights.bold,
    letterSpacing: -0.5,
  },
  greetingHeroSub: {
    marginTop: 2,
    color: colors.greetingSubGrey,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    lineHeight: 14,
  },
});
