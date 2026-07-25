// ============================================================================
// FILE        : dayparts.ts
// PROJECT     : LXC-Health
// AUTHOR      : Vishal Kumar
// UPDATED BY  : Vishal Kumar
// VERSION     : 1.0.0
// DATE-TIME   : 25-July-2026 | 00:00 Hrs
//
// PURPOSE     : Shared time-of-day theme reference for the MyHealthHub hero
//               header. Keeps the 4 day-part buckets in one place and falls
//               back to the default dark blue if anything goes wrong.
// ============================================================================

import {colors} from './colors';

export type DayPart = 'day' | 'afternoon' | 'evening' | 'night';

export type HeroTheme = {
  part: DayPart;
  backgroundColor: string;
  glowColor: string;
  bannerImage: number;
};

export const daypartRanges = {
  day: {startHour: 5, endHour: 11},
  afternoon: {startHour: 11, endHour: 17},
  evening: {startHour: 17, endHour: 21},
  night: {startHour: 21, endHour: 5},
} as const;

const heroThemes: Record<DayPart, HeroTheme> = {
  day: {
    part: 'day',
    backgroundColor: colors.primary,
    glowColor: '#74CCFF',
    bannerImage: require('../../assets/home-banner/hm-bnr-morning.png'),
  },
  afternoon: {
    part: 'afternoon',
    backgroundColor: '#0A70C4',
    glowColor: '#8FD2FF',
    bannerImage: require('../../assets/home-banner/hm-bnr-afternoon.png'),
  },
  evening: {
    part: 'evening',
    backgroundColor: '#0852A3',
    glowColor: '#79B8FF',
    bannerImage: require('../../assets/home-banner/hm-bnr-evening.png'),
  },
  night: {
    part: 'night',
    backgroundColor: colors.primaryDark,
    glowColor: '#4E8CFF',
    bannerImage: require('../../assets/home-banner/hm-bnr-night.png'),
  },
};

const defaultHeroTheme: HeroTheme = {
  part: 'night',
  backgroundColor: colors.primaryDark,
  glowColor: '#4E8CFF',
  bannerImage: require('../../assets/home-banner/hm-bnr-default.png'),
};

export function getDayPart(hour = new Date().getHours()): DayPart {
  if (hour >= daypartRanges.day.startHour && hour < daypartRanges.day.endHour) {
    return 'day';
  }

  if (hour >= daypartRanges.afternoon.startHour && hour < daypartRanges.afternoon.endHour) {
    return 'afternoon';
  }

  if (hour >= daypartRanges.evening.startHour && hour < daypartRanges.evening.endHour) {
    return 'evening';
  }

  return 'night';
}

export function getHeroThemeForHour(hour = new Date().getHours()): HeroTheme {
  try {
    const part = getDayPart(hour);
    return heroThemes[part];
  } catch {
    return defaultHeroTheme;
  }
}

export function getHeroTheme(now = new Date()): HeroTheme {
  try {
    return getHeroThemeForHour(now.getHours());
  } catch {
    return defaultHeroTheme;
  }
}
