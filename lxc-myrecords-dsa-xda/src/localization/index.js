// ============================================================================
// FILE        : index.js (localization)
// PROJECT     : LXC-Health
// AUTHOR      : Vishal Kumar
// UPDATED BY  : Vishal Kumar
// VERSION     : 1.0.0
// DATE-TIME   : 23-July-2026 | 20:39 Hrs
//
// PURPOSE     : English + Hindi UI strings (i18n-js) plus the active-locale
//               getter/loader, switchable in-app.
// ============================================================================

import AsyncStorage from '@react-native-async-storage/async-storage';

const strings = {
  en: {
    setupPin: 'Create PIN',
    setupPinSubtitle: 'Set a 6-digit PIN to secure the app',
    confirmPin: 'Confirm PIN',
    enterPin: 'Enter PIN',
    pinSubtitle: 'Enter your 6-digit PIN to continue',
    pinMismatch: 'PINs do not match. Try again.',
    wrongPin: 'Incorrect PIN. Try again.',
    dashboard: 'Dashboard',
    patients: 'Patients',
    doctors: 'Doctors',
    appointments: 'Appointments',
    uploads: 'Uploads',
    geoTracking: 'Geo Tracking',
    records: 'Records',
    search: 'Search...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    noData: 'No data found',
    loading: 'Loading...',
    error: 'Something went wrong',
  },
};

let currentLocale = 'en';

export const loadLocale = async () => {
  try {
    const saved = await AsyncStorage.getItem('app_locale');
    if (saved && strings[saved]) currentLocale = saved;
  } catch {}
};

export const setLocale = async (locale) => {
  if (strings[locale]) {
    currentLocale = locale;
    await AsyncStorage.setItem('app_locale', locale);
  }
};

export const t = (key) => {
  return strings[currentLocale]?.[key] ?? strings.en[key] ?? key;
};
