# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository overview

This repo (`lxc-myrecords`) is the Lexvora MyRecords healthcare platform and contains
**two independent React Native apps**:

1. **MyHealthHub** — patient-facing mobile app (Android + iOS), split across three
   sibling folders:
   - `lxc-myhealthhub-shared/` — all JS/TS source, assets, and `package.json`. This is
     where you make almost all code changes. TypeScript.
   - `lxc-myhealthhub-xda/` — Android native project (Gradle). Native/build config
     only, no app source.
   - `lxc-myhealthhub-ios/` — iOS native project (Xcode/CocoaPods). Native/build
     config only, no app source.
2. **DSA Tablet App** (`lxc-myrecords-dsa-xda/`) — offline-first field-agent app,
   Android + Expo web, self-contained in one folder (JS, not TypeScript).

These two apps do not share code or dependencies. They are on different React /
React Native / navigation major versions and should be treated as separate projects
when making changes — a fix in one does not need to be ported to the other unless
explicitly asked.

### Why MyHealthHub is split into three folders

`lxc-myhealthhub-shared/react-native.config.js` tells the React Native CLI (and the
Gradle/CocoaPods tooling in the other two folders) where the sibling native projects
live. `lxc-myhealthhub-xda/settings.gradle` + `app/build.gradle`, and
`lxc-myhealthhub-ios/Podfile`, are configured to resolve `node_modules` and the JS
project root at `../lxc-myhealthhub-shared`. If you rename or move any of these three
folders, those path references must be updated together — see each folder's README
for exactly what points where.

Platform-specific *code* (as opposed to native build config) still uses React
Native's normal file-suffix convention (`Thing.ios.tsx` / `Thing.android.tsx`) inside
`lxc-myhealthhub-shared/src` — the folder split is about separating native build
projects, not about forking the JS source per platform.

## Commands

All commands below are run with that folder as the working directory.

### MyHealthHub (`lxc-myhealthhub-shared/`)

```bash
npm install                  # install JS dependencies
npm run start                # start Metro bundler
npm run start:reset          # start Metro with cache reset
npm run android               # build + run on Android emulator/device
npm run ios                   # build + run on iOS simulator/device
npm run pod:install           # cd ../lxc-myhealthhub-ios && pod install
npm run build:android:debug   # cd ../lxc-myhealthhub-xda && ./gradlew assembleDebug
npm run build:android:release # cd ../lxc-myhealthhub-xda && ./gradlew assembleRelease
npm run clean:android         # cd ../lxc-myhealthhub-xda && ./gradlew clean
npm run lint                  # eslint .
npm run typecheck             # tsc --noEmit
npm run test                  # jest (no test files exist yet)
```

Debug APK output: `lxc-myhealthhub-xda/app/build/outputs/apk/debug/app-debug.apk`

### DSA Tablet App (`lxc-myrecords-dsa-xda/`)

```bash
npm install
npm run start     # start Metro bundler
npm run android    # build + run on Android
npm run ios        # not currently used — this app targets Android only today
npm run lint       # eslint src --ext .js,.jsx
```

### macOS local toolchain

Development on this repo uses a project-independent toolchain kept outside the repo
under `frameworks/` (Node, JDK 17, Android SDK, Gradle) instead of global installs.
Load it before building either app:

```bash
source "/Users/SageVish/Documents/Development Work/frameworks/android/env.sh"
```

## Architecture

### MyHealthHub (`lxc-myhealthhub-shared/src/`)

- `App.tsx` — root component: wraps the app in `QueryClientProvider` (TanStack Query),
  `SafeAreaProvider`, and `NavigationContainer`.
- `navigation/RootNavigator.tsx` — bottom tab navigator; the single place that wires
  together all screens.
- `screens/` — one file per screen (Home, Records, Appointments, Prescriptions,
  Vitals, Profile, ScheduleVisit). Screens compose shared components rather than
  defining their own primitives.
- `components/` — shared UI primitives (`Card`, `ListRow`, `PrimaryButton`, `Screen`,
  `SectionHeader`) used across most screens.
- `api/client.ts` — single Axios instance (`apiClient`), base URL from
  `react-native-config` (`Config.API_BASE_URL`), falls back to the production API.
- `api/healthService.ts` — currently returns **mock data**; real API integration is
  not yet wired up (no login/auth flow, no JWT storage yet, despite `zod` and
  `react-native-keychain` already being in `package.json` for that upcoming work).
- `hooks/useHealthData.ts` — React Query hooks consumed by screens.
- `theme/colors.ts`, `theme/spacing.ts` — the MyHealthHub blue/pink design tokens;
  screens should use these rather than hardcoding colors/spacing.

### DSA Tablet App (`lxc-myrecords-dsa-xda/src/`)

- `App.js` — root component: initializes the local SQLite DB via `getDB()` before
  rendering anything, then gates the app behind `PinScreen` (PIN stored in
  AsyncStorage) before showing `AppNavigator`.
- `storage/database.js` — the entire local data layer: opens the SQLite DB and
  defines the full schema (`patients`, `doctors`, `appointments`, `medical_records`,
  `uploads`, `geo_visits`, `activity_log`) plus CRUD. This app is offline-first —
  every table has a `sync_status` column (`pending`/`synced`) for a future backend
  sync pass; there is no live backend integration yet.
  `storage/database.web.js` / `storage/sqlite-web-stub.js` are the Expo-web platform
  variants, aliased in `webpack.config.js`.
  `navigation/AppNavigator.js` — tab + stack navigator wiring together the
  Dashboard/Patients/Doctors/Appointments/Uploads/GeoTracking/Records screens.
- `localization/index.js` — English + Hindi strings (i18n-js), switchable in-app.
- `theme/index.js` — colors/typography/spacing tokens (JS, not TS, unlike
  MyHealthHub's theme files).
