// ============================================================================
// FILE        : menuData.ts
// PROJECT     : LXC-Health
// AUTHOR      : Vishal Kumar
// UPDATED BY  : Vishal Kumar
// VERSION     : 1.0.0
// DATE-TIME   : 26-July-2026 | 00:00 Hrs
//
// PURPOSE     : Drawer content model for the premium slide-in Account Menu.
// ============================================================================

import type {SettingsSectionKey} from '../settings/settingsData';

export type MenuKey =
  | 'view-profile'
  | 'family-members'
  | 'profile-management'
  | 'health-summary'
  | 'switch-family'
  | 'app-settings'
  | 'apple-health'
  | 'android-health'
  | 'data-compliance'
  | 'privacy-settings'
  | 'data-export'
  | 'help-support'
  | 'whats-new'
  | 'refer-earn'
  | 'rate-app'
  | 'logout';

export type MenuItem = {
  key: MenuKey;
  title: string;
  subtitle: string;
  glyph: string;
  tone: string;
  badge?: string;
  destructive?: boolean;
  focusSection?: SettingsSectionKey;
};

export type MenuGroup = {
  title: string;
  items: MenuItem[];
};

export const drawerProfile = {
  name: 'Priya Sharma',
  email: 'pri***@gmail.com',
  initials: 'P',
  cta: 'View Profile',
};

export const drawerGroups: MenuGroup[] = [
  {
    title: 'Family & Profiles',
    items: [
      {
        key: 'family-members',
        title: 'Family Members',
        subtitle: 'Manage family profiles',
        glyph: 'F',
        tone: '#F41678',
      },
      {
        key: 'profile-management',
        title: 'Profile Management',
        subtitle: 'Personal info, preferences',
        glyph: 'P',
        tone: '#0D63B7',
      },
      {
        key: 'health-summary',
        title: 'Health Summary',
        subtitle: 'View family health overview',
        glyph: 'H',
        tone: '#7D5AF2',
      },
      {
        key: 'switch-family',
        title: 'Switch Family',
        subtitle: 'Manage multiple families',
        glyph: '↺',
        tone: '#17A66A',
      },
    ],
  },
  {
    title: 'App Settings',
    items: [
      {
        key: 'app-settings',
        title: 'App Settings',
        subtitle: 'Behavior, privacy, and device rules',
        glyph: '⚙',
        tone: '#0D63B7',
        focusSection: 'behavior',
      },
      {
        key: 'apple-health',
        title: 'Apple Health',
        subtitle: 'Health sync for iPhone users',
        glyph: '',
        tone: '#F41678',
        focusSection: 'integrations',
      },
      {
        key: 'android-health',
        title: 'Android Health Connect',
        subtitle: 'Health sync for Android users',
        glyph: 'A',
        tone: '#1599EA',
        focusSection: 'integrations',
      },
    ],
  },
  {
    title: 'Data & Privacy',
    items: [
      {
        key: 'data-compliance',
        title: 'Data Compliance',
        subtitle: 'Manage consent and permissions',
        glyph: '✓',
        tone: '#17A66A',
        focusSection: 'privacy',
      },
      {
        key: 'privacy-settings',
        title: 'Privacy Settings',
        subtitle: 'Control your data visibility',
        glyph: '🔒',
        tone: '#0D63B7',
        focusSection: 'privacy',
      },
      {
        key: 'data-export',
        title: 'Data Export',
        subtitle: 'Download your health data',
        glyph: '⇩',
        tone: '#7D5AF2',
        focusSection: 'privacy',
      },
    ],
  },
  {
    title: 'Support & More',
    items: [
      {
        key: 'help-support',
        title: 'Help & Support',
        subtitle: 'FAQs, guides & contact us',
        glyph: '?',
        tone: '#F59E0B',
      },
      {
        key: 'whats-new',
        title: "What's New",
        subtitle: 'Latest updates & features',
        glyph: 'N',
        tone: '#0D63B7',
        badge: 'NEW',
      },
      {
        key: 'refer-earn',
        title: 'Refer & Earn',
        subtitle: 'Invite friends and earn rewards',
        glyph: '✦',
        tone: '#F41678',
      },
      {
        key: 'rate-app',
        title: 'Rate MyHealthHub',
        subtitle: 'Share your feedback',
        glyph: '★',
        tone: '#F59E0B',
      },
    ],
  },
];

