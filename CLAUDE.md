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

## Current status — read this first

Last updated: 2026-07-23. This section exists so a new chat can pick up work
without re-discovering what's already been verified.

**MyHealthHub — done / verified:**
- Login screen (`screens/LoginScreen.tsx`) built: mobile+OTP flow (mock, no real
  backend) and biometric login via `react-native-keychain`. It **is** wired as
  an auth gate — `App.tsx` renders `LoginScreen` until `isAuthenticated` is set
  via `onLoginSuccess`, then renders the tab navigator. The gate lives in
  `App.tsx`, not `RootNavigator.tsx`.
- `AccountMenu.tsx` (slide-in account panel: View Profile / Log Out) and
  `context/AccountMenuContext.tsx` (exposes `openMenu()` so any screen can open
  it without prop-drilling) were added alongside the login work.
- `theme/typography.ts` added (font size/weight scale) and wired into
  `LoginScreen.tsx`. Other screens still hardcode font sizes/weights — not yet
  migrated to the token scale.
- iOS build **verified working end-to-end**: builds and launches on the iOS
  Simulator via `npx react-native run-ios`. Physical-device build also verified
  against a connected iPhone 14 Pro Max ("Sage 14Pro", signing team
  `6EERS23K5D` already set in the pbxproj).
- Fixed a real build breakage: Xcode auto-upgrading `project.pbxproj` sets
  `ENABLE_USER_SCRIPT_SANDBOXING = YES`, which makes CocoaPods' "[CP] Embed Pods
  Frameworks" script phase fail with a sandbox `rsync`/`unlink` denial on
  `hermes.framework`. Fixed by forcing that setting to `NO` for both the Debug
  and Release configs. `Executable/macos_iosapp_build.sh` re-applies this fix
  automatically on every run in case Xcode flips it again.
- `Executable/` folder added at the repo root: `macos_iosapp_build.sh` and
  `macos_xdaapp_build.sh` are one-shot build+install+launch scripts — see
  "Executable build scripts" below. They're the preferred way to build+run
  now, over calling `npm run ios`/`npm run android` by hand.
- `HomeScreen.tsx` / `RootNavigator.tsx` had a UI-density pass (smaller tab
  bar, custom vector-free quick-action icons via `View`-based shapes instead
  of emoji, horizontally-scrolling quick actions).
- Android build **verified end-to-end via `Executable/macos_xdaapp_build.sh`**:
  the script now detects when nothing is connected, lists installed AVDs, boots
  one automatically (lowest API level by default), waits for boot, builds, and
  installs+launches. Two real bugs were found and fixed while verifying this:
  `mapfile`/`${arr[-1]}` don't exist in bash 3.2 (macOS's default `/bin/bash`,
  vs. the bash 4+ assumed) — replaced with portable `while read` loops; and
  this project outputs per-ABI split APKs (`MyHealthHub-debug-arm64-v8a.apk`,
  not `app-debug.apk`) — the script now resolves the right one from the target
  device's ABI. Launch uses `adb shell am start -n <pkg>/.MainActivity`, not
  `monkey` (monkey's exit code is unreliable and was tripping `set -e`).

**Not done yet (unchanged from before):** no real backend integration, no JWT
storage wired up despite the dependency being present — the login gate in
`App.tsx` only tracks `isAuthenticated` in local component state, it doesn't
call a real API or persist a session. See each app's own README for the
fuller task checklist.

**Where to start next:** likely real API integration in `api/healthService.ts`
plus wiring `LoginScreen`'s mock OTP submit to an actual `POST /auth/login`
and persisting the session via `react-native-keychain`. Ask the user before
starting, don't assume.

### Executable build scripts

See `Executable/README.md` for the full breakdown of what each script does.
`Executable/macos_iosapp_build.sh` and `Executable/macos_xdaapp_build.sh` are
self-contained, run-from-anywhere scripts for MyHealthHub — they load the
toolchain, install JS/CocoaPods deps if needed, verify prerequisites (Xcode,
toolchain scripts, folders, connected device/simulator) with plain-language +
developer-fix error messages, and build+launch. Prefer pointing the user at
these over walking them through the manual `npm run ios`/`android` steps by
hand.

```bash
./Executable/macos_iosapp_build.sh                  # iOS Simulator (default: iPhone 14)
./Executable/macos_iosapp_build.sh device            # physical device (default: "Sage 14Pro")
./Executable/macos_xdaapp_build.sh                   # Android debug build — auto-boots an AVD if nothing's connected
```

Both scripts are written for bash 3.2 (macOS's stock `/bin/bash`) on purpose —
don't reach for `mapfile`/`readarray` or `${arr[-1]}` negative indexing when
editing them, neither exists there; use a `while read` loop into an array and
`${arr[$((${#arr[@]}-1))]}` instead.

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

Debug APK output: `lxc-myhealthhub-xda/app/build/outputs/apk/debug/` — this project
builds per-ABI split APKs (e.g. `MyHealthHub-debug-arm64-v8a.apk`), not a single
`app-debug.apk`. `Executable/macos_xdaapp_build.sh` picks the right one automatically
based on the target device's ABI.

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
under `frameworks/` instead of global installs. There are two loader scripts:

```bash
source "/Users/SageVish/Documents/Development Work/frameworks/android/env.sh"  # Node, JDK 17, Android SDK, Gradle
source "/Users/SageVish/Documents/Development Work/frameworks/ios/env.sh"      # Ruby + CocoaPods (needed for iOS builds)
```

Building iOS requires sourcing **both** — Node comes from the `android/env.sh`
script even for iOS work. The `Executable/*.sh` scripts source both automatically.

## Architecture

### MyHealthHub (`lxc-myhealthhub-shared/src/`)

- `App.tsx` — root component: renders `LoginScreen` until `isAuthenticated` is
  set (via `onLoginSuccess`), then wraps the tab navigator in
  `QueryClientProvider` (TanStack Query), `SafeAreaProvider`, and
  `AccountMenuProvider` (for the slide-in `AccountMenu` panel).
- `navigation/RootNavigator.tsx` — bottom tab navigator; the single place that wires
  together all screens except `LoginScreen` (gated separately in `App.tsx`).
- `screens/` — one file per screen (Home, Records, Appointments, Prescriptions,
  Vitals, Profile, ScheduleVisit, Login, Notifications). Screens compose shared
  components rather than defining their own primitives. `LoginScreen.tsx` is a
  mobile+OTP mock flow (no real backend) plus biometric login.
- `components/` — shared UI primitives (`Card`, `ListRow`, `PrimaryButton`, `Screen`,
  `SectionHeader`, `AccountMenu`) used across most screens.
- `context/AccountMenuContext.tsx` — exposes `openMenu()` via context so any
  screen can open the `AccountMenu` panel without prop-drilling.
- `api/client.ts` — single Axios instance (`apiClient`), base URL from
  `react-native-config` (`Config.API_BASE_URL`), falls back to the production API.
- `api/healthService.ts` — currently returns **mock data**; real API integration
  (and JWT storage, despite `zod`/`react-native-keychain` already being in
  `package.json` for that) is not yet wired up. Login is UI-only/mock so far.
- `hooks/useHealthData.ts` — React Query hooks consumed by screens.
- `theme/colors.ts`, `theme/spacing.ts`, `theme/typography.ts` — the MyHealthHub
  blue/pink design tokens plus a font size/weight scale; screens should use these
  rather than hardcoding colors/spacing/fonts. Only `LoginScreen.tsx` has been
  migrated to `theme/typography.ts` so far — other screens still hardcode
  `fontSize`/`fontWeight`.

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
