// ============================================================================
// FILE        : radii.ts
// PROJECT     : LXC-Health
// AUTHOR      : Vishal Kumar
// UPDATED BY  : Vishal Kumar
// VERSION     : 1.0.0
// DATE-TIME   : 24-July-2026 | 00:00 Hrs
//
// PURPOSE     : Shared border-radius scale for cards, badges, strips, and
//               rounded controls. Use these tokens instead of hardcoding
//               corner values in screens.
// ============================================================================

export const theme = {
  border: {
    radius: {
      xs: 6,
      sm: 8,
      md: 12,
      lg: 15,
      xl: 18,
      '2xl': 22,
      slider: 10,
      pill: 999,
      card: 15,
      strip: 12,
    },
  },
} as const;

export const radii = theme.border.radius;
