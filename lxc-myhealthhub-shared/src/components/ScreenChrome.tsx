// ============================================================================
// FILE        : ScreenChrome.tsx
// PROJECT     : LXC-Health
// AUTHOR      : Vishal Kumar
// UPDATED BY  : Vishal Kumar
// VERSION     : 1.0.0
// DATE-TIME   : 26-July-2026 | 00:00 Hrs
//
// PURPOSE     : Shared reusable screen chrome for non-Home screens. Provides
//               the page background, the top glass header, and the weather /
//               screen-info slab so feature screens can stay consistent without
//               duplicating the same layout code.
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
import {fontWeights} from '../theme/typography';
import {radii} from '../theme/radii';

type PageBackgroundProps = {
  backgroundImage: ImageSourcePropType;
  children?: React.ReactNode;
};

type TopGlassHeaderProps = {
  onPressMenu: () => void;
  onPressProfile: () => void;
  onPressNotifications: () => void;
  notificationCount?: number;
  title?: string;
  subtitle?: string;
  textColor?: string;
};

type TopScreenInfoProps = {
  city: string;
  temperature: string;
};

export function PageBackground({backgroundImage, children}: PageBackgroundProps) {
  const insets = useSafeAreaInsets();

  return (
    <ImageBackground
      source={backgroundImage}
      resizeMode="cover"
      style={[
        styles.pageBackground,
        Platform.OS === 'ios' && {
          marginTop: -insets.top,
          paddingTop: insets.top,
        },
      ]}>
      <View style={styles.pageTint} />
      <View style={styles.pageGlow} />
      <View pointerEvents="none" style={styles.pageBottomFade}>
        <View style={[styles.pageBottomFadeBand, styles.pageBottomFadeTop]} />
        <View style={[styles.pageBottomFadeBand, styles.pageBottomFadeMid]} />
        <View style={[styles.pageBottomFadeBand, styles.pageBottomFadeLow]} />
        <View style={styles.pageBottomFadeBand} />
      </View>
      <View style={styles.pageContent}>{children}</View>
    </ImageBackground>
  );
}

export function TopGlassHeader({
  onPressMenu,
  onPressProfile,
  onPressNotifications,
  notificationCount = 3,
  textColor = colors.surface,
}: TopGlassHeaderProps) {
  return (
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
          <Pressable accessibilityRole="button" onPress={onPressNotifications} style={styles.bellButton}>
            <Text style={styles.bell}>🔔</Text>
            <Text style={styles.badge}>{notificationCount}</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={onPressProfile} style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>P</Text>
          </Pressable>
          <Pressable
            accessibilityLabel="Account menu"
            accessibilityRole="button"
            onPress={onPressMenu}
            style={styles.menuButton}>
            <Image source={require('../../assets/nav-more-icon-blue.png')} style={[styles.menuIcon, styles.menuIconPink]} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export function TopScreenInfo({city, temperature}: TopScreenInfoProps) {
  return (
    <View style={styles.topScreenInfo}>
      <Text style={styles.weatherCity}>{city}</Text>
      <Text style={styles.weatherTemp}>{temperature}</Text>
    </View>
  );
}

type ScreenChromeProps = PageBackgroundProps &
  TopGlassHeaderProps &
  TopScreenInfoProps & {
    children: React.ReactNode;
  };

export function ScreenChrome({
  backgroundImage,
  children,
  city,
  temperature,
  onPressMenu,
  onPressProfile,
  onPressNotifications,
  notificationCount,
  textColor,
}: ScreenChromeProps) {
  return (
    <PageBackground backgroundImage={backgroundImage}>
      <View style={styles.chromeWrap}>
        <TopGlassHeader
          onPressMenu={onPressMenu}
          onPressProfile={onPressProfile}
          onPressNotifications={onPressNotifications}
          notificationCount={notificationCount}
          textColor={textColor}
        />
        <TopScreenInfo city={city} temperature={temperature} />
        {children}
      </View>
    </PageBackground>
  );
}

const styles = StyleSheet.create({
  pageBackground: {
    minHeight: 208,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 68,
    overflow: 'visible',
  },
  pageTint: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.12,
  },
  pageGlow: {
    position: 'absolute',
    right: -104,
    top: 30,
    width: 210,
    height: 210,
    borderRadius: 105,
    opacity: 0.38,
  },
  pageBottomFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 96,
    overflow: 'hidden',
  },
  pageBottomFadeBand: {
    flex: 1,
    backgroundColor: colors.background,
  },
  pageBottomFadeTop: {
    opacity: 0,
  },
  pageBottomFadeMid: {
    opacity: 0.34,
  },
  pageBottomFadeLow: {
    opacity: 0.72,
  },
  pageContent: {
    flex: 1,
  },
  chromeWrap: {
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
    flex: 1,
    flexDirection: 'row',
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
  topScreenInfo: {
    alignSelf: 'stretch',
    alignItems: 'flex-end',
    marginTop: 8,
    marginBottom: 4,
    paddingRight: 12,
  },
  weatherCity: {
    color: '#F41678',
    fontSize: 15,
    lineHeight: 16,
    fontWeight: fontWeights.bold,
  },
  weatherTemp: {
    color: '#F41678',
    fontSize: 20,
    lineHeight: 22,
    fontWeight: fontWeights.bold,
  },
});
