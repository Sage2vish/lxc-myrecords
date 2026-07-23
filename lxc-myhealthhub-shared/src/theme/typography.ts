// ============================================================================
// FILE        : typography.ts
// PROJECT     : LXC-Health
// AUTHOR      : Vishal Kumar
// UPDATED BY  : Vishal Kumar
// VERSION     : 1.0.0
// DATE-TIME   : 23-July-2026 | 20:39 Hrs
//
// PURPOSE     : Defines the MyHealthHub font-size and font-weight design-token
//               scale (theme/typography.ts). Screens should import fontSizes/
//               fontWeights from here instead of hardcoding numeric font
//               values, so type styling stays consistent across the app.
// ============================================================================

export const fontSizes = {
  xs: 10,
  sm: 11,
  base: 12,
  md: 13,
  lg: 14,
  xl: 18,
  '2xl': 24,
  '3xl': 30,
};

export const fontWeights = {
  normal: '200' as const,
  medium: '300' as const,
  bold: '500' as const,
  extrabold: '600' as const,
};