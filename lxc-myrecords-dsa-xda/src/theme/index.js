// ============================================================================
// FILE        : index.js (theme)
// PROJECT     : LXC-Health
// AUTHOR      : Vishal Kumar
// UPDATED BY  : Vishal Kumar
// VERSION     : 1.0.0
// DATE-TIME   : 23-July-2026 | 20:39 Hrs
//
// PURPOSE     : Colors, typography, spacing, radius, and shadow design
//               tokens (JS, not TS) used across all DSA Tablet App screens.
// ============================================================================

export const Colors = {
  primary: '#1A3C5E',
  primaryDark: '#0F2540',
  primaryLight: '#2E6DA4',
  accent: '#F0A500',
  accentLight: '#FFD166',
  white: '#FFFFFF',
  black: '#000000',
  background: '#F4F6F9',
  surface: '#FFFFFF',
  border: '#DDE3EC',
  textPrimary: '#1A2B3C',
  textSecondary: '#6B7A8D',
  textMuted: '#9CA8B4',
  success: '#27AE60',
  warning: '#F39C12',
  danger: '#E74C3C',
  info: '#2980B9',
};

export const Typography = {
  displayLarge: { fontSize: 32, fontWeight: '700', lineHeight: 40 },
  displaySmall: { fontSize: 24, fontWeight: '700', lineHeight: 32 },
  headingLarge: { fontSize: 20, fontWeight: '600', lineHeight: 28 },
  headingMedium: { fontSize: 18, fontWeight: '600', lineHeight: 24 },
  headingSmall: { fontSize: 16, fontWeight: '600', lineHeight: 22 },
  bodyLarge: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  bodyMedium: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  bodySmall: { fontSize: 12, fontWeight: '400', lineHeight: 18 },
  caption: { fontSize: 11, fontWeight: '400', lineHeight: 16 },
  label: { fontSize: 12, fontWeight: '600', lineHeight: 16, letterSpacing: 0.5 },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
};
