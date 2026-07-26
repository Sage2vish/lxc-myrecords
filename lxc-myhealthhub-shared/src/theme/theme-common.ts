// ============================================================================
// FILE        : theme-common.ts
// PROJECT     : LXC-Health
// AUTHOR      : Vishal Kumar
// UPDATED BY  : Vishal Kumar
// VERSION     : 1.0.0
// DATE-TIME   : 25-July-2026 | 00:00 Hrs
//
// PURPOSE     : Shared theme primitives used by navigation, cards, drawer,
//               and premium settings surfaces. Keep common values here instead
//               of hardcoding them in screens.
// ============================================================================

import {commonTheme} from './common';

export const theme = {
  iconNav: {
    size: 40,
  },
  iconCard: {
    size: 56,
  },
  glass: commonTheme.glass,
  motion: commonTheme.motion,
  drawer: commonTheme.drawer,
  cards: commonTheme.cards,
  settings: commonTheme.settings,
} as const;
