// ============================================================================
// FILE        : settingsData.ts
// PROJECT     : LXC-Health
// AUTHOR      : Vishal Kumar
// UPDATED BY  : Vishal Kumar
// VERSION     : 1.0.0
// DATE-TIME   : 26-July-2026 | 00:00 Hrs
//
// PURPOSE     : Shared App Settings content model for health integrations,
//               behavior controls, privacy actions, and support shortcuts.
// ============================================================================

export type SettingsSectionKey = 'integrations' | 'behavior' | 'privacy' | 'support';

export type HealthIntegrationCard = {
  key: 'apple-health' | 'android-health';
  title: string;
  subtitle: string;
  status: string;
  tone: string;
  glyph: string;
  chips: string[];
  actionLabel: string;
};

export type BehaviorToggleKey = 'deviceLocation' | 'weatherFallback' | 'compactDrawer' | 'autoPrivacyHints';

export const healthIntegrations: HealthIntegrationCard[] = [
  {
    key: 'apple-health',
    title: 'Apple Health',
    subtitle: 'Connect iPhone wellness data, step counts, sleep, and vitals.',
    status: 'Ready for iPhone',
    tone: '#F41678',
    glyph: '',
    chips: ['Steps', 'Sleep', 'Workouts', 'Vitals'],
    actionLabel: 'Connect',
  },
  {
    key: 'android-health',
    title: 'Android Health Connect',
    subtitle: 'Sync supported Android health data from the device health vault.',
    status: 'Ready for Android',
    tone: '#0D63B7',
    glyph: 'A',
    chips: ['Steps', 'Activity', 'Heart Rate', 'Weight'],
    actionLabel: 'Connect',
  },
];

export const behaviorDefaults: Record<BehaviorToggleKey, boolean> = {
  deviceLocation: true,
  weatherFallback: true,
  compactDrawer: true,
  autoPrivacyHints: false,
};

export const behaviorRows = [
  {
    key: 'deviceLocation' as const,
    title: 'Use device location for weather',
    subtitle: 'Prefer latitude and longitude from the phone when available.',
  },
  {
    key: 'weatherFallback' as const,
    title: 'Allow Dubai fallback weather',
    subtitle: 'Keep the home weather card stable if location or backend lookup fails.',
  },
  {
    key: 'compactDrawer' as const,
    title: 'Use compact side drawer',
    subtitle: 'Keep the menu fast, narrow, and easy to scan with a glass finish.',
  },
  {
    key: 'autoPrivacyHints' as const,
    title: 'Show privacy hints',
    subtitle: 'Surface short reminders when data permissions are missing.',
  },
];

export const privacyActions = [
  {
    key: 'data-compliance',
    title: 'Data compliance',
    subtitle: 'Consent, device permissions, and retention rules.',
    accent: '#17A66A',
    glyph: '✓',
  },
  {
    key: 'data-export',
    title: 'Data export',
    subtitle: 'Download your records and local app data archive.',
    accent: '#7D5AF2',
    glyph: '⇩',
  },
  {
    key: 'privacy-settings',
    title: 'Privacy settings',
    subtitle: 'Visibility, sharing, and app behavior controls.',
    accent: '#0D63B7',
    glyph: '🔒',
  },
];

export const supportActions = [
  {
    key: 'help',
    title: 'Help & Support',
    subtitle: 'FAQs, guides, and contact details.',
    accent: '#F59E0B',
    glyph: '?',
  },
  {
    key: 'whats-new',
    title: "What's New",
    subtitle: 'Product updates and release highlights.',
    accent: '#0D63B7',
    glyph: 'N',
    badge: 'NEW',
  },
  {
    key: 'rate',
    title: 'Rate MyHealthHub',
    subtitle: 'Leave feedback and star the experience.',
    accent: '#F59E0B',
    glyph: '★',
  },
  {
    key: 'refer',
    title: 'Refer & Earn',
    subtitle: 'Invite family and earn rewards.',
    accent: '#F41678',
    glyph: '✦',
  },
];

