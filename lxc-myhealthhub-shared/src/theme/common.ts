// ============================================================================
// FILE        : common.ts
// PROJECT     : LXC-Health
// AUTHOR      : Vishal Kumar
// UPDATED BY  : Vishal Kumar
// VERSION     : 1.0.0
// DATE-TIME   : 26-July-2026 | 00:00 Hrs
//
// PURPOSE     : Shared layout, glass, motion, and card tokens used by larger
//               reusable surfaces like the side drawer and App Settings.
// ============================================================================

import {radii} from './radii';
import {spacing} from './spacing';

export const commonTheme = {
  glass: {
    backdrop: 'rgba(10, 18, 36, 0.54)',
    panel: 'rgba(252, 253, 255, 0.90)',
    panelSoft: 'rgba(255, 255, 255, 0.82)',
    edge: 'rgba(255, 255, 255, 0.70)',
    tint: 'rgba(13, 99, 183, 0.03)',
  },
  motion: {
    quickInMs: 180,
    quickOutMs: 150,
    fadeInMs: 160,
    fadeOutMs: 120,
  },
  drawer: {
    minWidth: 200,
    maxWidth: 300,
    widthRatio: 0.88,
    rowHeight: 64,
    cardRadius: radii['2xl'],
    sectionGap: spacing.lg,
    screenGap: spacing.md,
  },
  cards: {
    radius: radii['2xl'],
    padding: spacing.md,
  },
  settings: {
    sectionGap: spacing.lg,
    cardGap: spacing.md,
    integrationCardMinHeight: 152,
  },
} as const;
