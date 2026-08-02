import {colors} from '../theme/colors';

export type TabletSectionKey = 'home' | 'health' | 'schedules' | 'vault' | 'reports';

export type TabletDetailKey =
  | 'appointments'
  | 'lab-reports'
  | 'document-vault'
  | 'family-profiles'
  | 'health-overview';

export type TabletSectionConfig = {
  key: TabletSectionKey;
  title: string;
  subtitle: string;
  accent: string;
};

export type TabletDetailConfig = {
  key: TabletDetailKey;
  title: string;
  eyebrow: string;
  summary: string;
  bullets: string[];
  accent: string;
};

export const tabletSections: TabletSectionConfig[] = [
  {
    key: 'home',
    title: 'Home',
    subtitle: 'Dashboard',
    accent: colors.accent,
  },
  {
    key: 'health',
    title: 'Health',
    subtitle: 'Overview',
    accent: colors.primary,
  },
  {
    key: 'schedules',
    title: 'Schedules',
    subtitle: 'Appointments',
    accent: colors.sky,
  },
  {
    key: 'vault',
    title: 'Vault',
    subtitle: 'Records',
    accent: '#7D5AF2',
  },
  {
    key: 'reports',
    title: 'Reports',
    subtitle: 'Insights',
    accent: '#FB7543',
  },
];

export const tabletDetails: Record<TabletDetailKey, TabletDetailConfig> = {
  appointments: {
    key: 'appointments',
    title: 'Upcoming Appointments',
    eyebrow: 'Schedules',
    summary: 'Review the next confirmed visits, who they belong to, and where they happen.',
    bullets: [
      'Open the schedules section for the full appointment timeline.',
      'Use this surface for quick date and doctor checks before the visit.',
      'Keep the most urgent visit visible at the top of the tablet shell.',
    ],
    accent: colors.sky,
  },
  'lab-reports': {
    key: 'lab-reports',
    title: 'Lab Reports & Results',
    eyebrow: 'Reports',
    summary: 'Surface recent lab and imaging activity with enough room for desktop-style review.',
    bullets: [
      'Group reports by test type and date.',
      'Allow drill-down into the source record or PDF view later.',
      'Keep status and uploaded date visible at a glance.',
    ],
    accent: '#FB7543',
  },
  'document-vault': {
    key: 'document-vault',
    title: 'Document Vault',
    eyebrow: 'Vault',
    summary: 'Show the secure storage summary and the latest uploads together.',
    bullets: [
      'Highlight the latest documents first.',
      'Keep family-level access clear in tablet layout.',
      'Use the wider screen for richer metadata and previews.',
    ],
    accent: '#7D5AF2',
  },
  'family-profiles': {
    key: 'family-profiles',
    title: 'Family Profiles',
    eyebrow: 'Family',
    summary: 'Present family members as primary cards so the tablet feels like a shared health space.',
    bullets: [
      'Keep each profile visually distinct.',
      'Show relationships and the active profile state.',
      'Allow future edits and permissions work from this surface.',
    ],
    accent: colors.accent,
  },
  'health-overview': {
    key: 'health-overview',
    title: 'Health Overview',
    eyebrow: 'Health',
    summary: 'Use the tablet canvas to compare vitals, sleep, movement, and hydration side by side.',
    bullets: [
      'Make it easy to scan multiple cards at once.',
      'Keep trend colors meaningful and consistent.',
      'Reserve the right side for summary callouts and next actions.',
    ],
    accent: colors.primary,
  },
};

