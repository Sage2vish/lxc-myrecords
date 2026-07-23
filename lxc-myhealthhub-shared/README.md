# MyHealthHub Mobile App by Lexvora

MyHealthHub is a React Native app (Android and iOS) for patient health records, appointments, prescriptions, vitals, and profile management.

## History

This folder is the JS/TS "common area" for the MyHealthHub app. It was originally a
single project, `lxc-myhealthhub-mobile`, containing `src/`, `android/`, and `ios/`
together. On 2026-07-21 it was split into three sibling folders under the repo root so
the native Android and iOS build projects are separated from the shared app code they
both build from:

- `lxc-myhealthhub-shared` (this folder) — all JS/TS source, assets, `package.json`
- [`lxc-myhealthhub-xda`](../lxc-myhealthhub-xda/) — Android native project (Gradle)
- [`lxc-myhealthhub-ios`](../lxc-myhealthhub-ios/) — iOS native project (Xcode/CocoaPods)

`react-native.config.js` in this folder is what tells the React Native CLI (and the
Gradle/CocoaPods tooling in the other two folders) where to find each native project.
Git history for individual files was preserved as renames across the split.

## Current Status

- [x] React Native project metadata created
- [x] TypeScript app source created
- [x] Android native project files created
- [x] App navigation shell created
- [x] MyHealthHub launcher icon wired into Android manifest
- [x] Dashboard screen created
- [x] Medical records screen created
- [x] Appointments screen created
- [x] Prescriptions screen created
- [x] Vitals screen created
- [x] Profile screen created
- [x] Mock health service data added
- [x] Environment sample file added
- [x] Android build scripts added
- [x] Node.js available in local shell via `frameworks/node`
- [x] npm packages installed
- [x] Java JDK 17 available in local shell via `frameworks/jdk`
- [ ] Android Studio installed
- [ ] Android SDK Platform 36 installed under `frameworks/android/sdk`
- [x] Gradle 8.10.2 installed under `frameworks/gradle`
- [ ] Android Gradle wrapper generated
- [x] Android debug APK built successfully
- [x] Android emulator system image installed and device run verified (2026-07-23,
      via `../Executable/macos_xdaapp_build.sh`)
- [ ] API 36 Pixel 8 Pro/Pixel 9 Pro emulator configured
- [ ] Emulator configured for 2772 x 1240 resolution and 8 GB or 12 GB RAM
- [x] ARM64-v8a preferred app architecture configured
- [ ] Backend API connected
- [ ] Login/authentication implemented
- [ ] Secure token storage implemented
- [ ] Real record upload/download implemented
- [ ] Appointment booking form implemented
- [ ] Medication reminder notifications implemented
- [ ] Hindi translations implemented
- [ ] Release signing configured
- [ ] Play Store build generated

## What Has Been Built

The MyHealthHub app is split into three sibling folders: native builders for each
platform, and this shared JS/TS project that both of them build from.

```text
lxc-myhealthhub-xda/         # Android native app and Gradle config (builder only)
lxc-myhealthhub-ios/         # iOS native app and Xcode/Podfile config (builder only)
lxc-myhealthhub-shared/      # this folder — all JS/TS source and assets
├── src/
│   ├── api/                # API client and health service
│   ├── components/         # Shared UI components
│   ├── hooks/              # React Query data hooks
│   ├── navigation/         # Bottom tab navigation
│   ├── screens/            # App screens (incl. LoginScreen — mock OTP + biometric)
│   ├── theme/              # Colors, spacing, and typography (font scale)
│   └── types/              # TypeScript app types
├── assets/
├── react-native.config.js  # points the RN CLI at ../lxc-myhealthhub-xda and ../lxc-myhealthhub-ios
├── .env.example
├── app.json
├── index.js
├── package.json
└── tsconfig.json
```

## MyHealthHub Home Screen Design Implementation

The home screen has been redesigned to match the premium MyHealthHub Space concept:

- Blue MyHealthHub header with logo, greeting, notification, and profile avatar
- Family Health Space card with family members, add member action, status, and health score
- Upcoming appointment card
- Six quick actions: Health Records, Reports & Visits, Find Nearby Care, Appointments, Health App Sync, Family Profiles
- One-call support card using India Head Office number: `(+91) 767 647 7775`
- DSA Assisted Setup card
- Privacy/security card
- Bottom navigation styled as Home, Health, center Add, Vault, More

Primary files:

```text
src/screens/HomeScreen.tsx       # Main app home/dashboard UI
src/navigation/RootNavigator.tsx  # Bottom tab navigation styling
src/theme/colors.ts              # MyHealthHub blue/pink color theme
src/App.tsx                      # Status bar theme
assets/myhealthhub-icon.png      # Current app logo/icon asset
```

Color theme:

```text
Deep Blue:  #0D63B7
Dark Blue:  #073B86
Sky Blue:   #1599EA
Pink:       #F41678
Background: #F6FAFF
Text:       #10254A
```

No extra icon library or gradient package is required for this version. The UI is built with React Native core components so it is easy to open in VS Code and customize.

## Prerequisites

Install these before running the app:

- Node.js 18 or newer
- npm or Yarn
- Java JDK 17
- Android Studio
- Android SDK Platform 35
- Android emulator or physical Android device

## Setup

### macOS Local Framework Setup

Vishal has completed a local-framework setup for macOS. The required development tools are kept together under the shared `frameworks` folder and loaded for this project with one command:

```text
frameworks/
├── android/       # Android SDK, platform tools, emulator tools
├── android-emulator/ # Dedicated emulator installer and AVD files
├── jdk/           # JDK 17
├── node/          # Node.js 24 and npm
└── gradle/        # Gradle 8.10.2
```

Load the tools before working on the app:

```bash
source "/Users/SageVish/Documents/Development Work/frameworks/android/env.sh"
```

The emulator is kept separately in `frameworks/android-emulator` so emulator images and AVD files do not mix with the Android build SDK. Its installer is available at `frameworks/android-emulator/install.sh`.

This approach is better for the Mac setup because the project uses known, isolated tool versions without requiring global package-manager changes. It also keeps the Android SDK, Java, Node.js, and Gradle paths consistent across terminals and projects.

Verified locally:

- Node.js `v24.18.0`
- npm `11.16.0`
- Java `17.0.19`
- Gradle `8.10.2`
- Android SDK Platform `35`
- Android Debug Bridge `37.0.0`

```bash
cd lxc-myhealthhub-shared
cp .env.example .env
npm install
```

## Fastest path: one-shot build scripts

`../Executable/macos_iosapp_build.sh` and `../Executable/macos_xdaapp_build.sh`
load the toolchain, install deps, and build+launch in one command — including
auto-booting an Android emulator if nothing's connected. Both iOS (Simulator +
physical device) and Android (emulator, auto-booted) have been verified working
end-to-end through these scripts as of 2026-07-23. Prefer these over the manual
steps below unless you're debugging the build itself.

## Run Android App

### Recommended VS Code run flow

Use this flow whenever you want to see the latest React Native UI in the Android emulator.

Terminal 1:

```bash
cd "/Users/SageVish/Documents/Development Work/git-repos/LXC-Repos/lxc-myrecords/lxc-myhealthhub-shared"
source "/Users/SageVish/Documents/Development Work/frameworks/android/env.sh"
npm run start:reset
```

Terminal 2:

```bash
cd "/Users/SageVish/Documents/Development Work/git-repos/LXC-Repos/lxc-myrecords/lxc-myhealthhub-shared"
source "/Users/SageVish/Documents/Development Work/frameworks/android/env.sh"
npm run android
```

If the emulator ever shows an old screen, uninstall the old app once and run again:

```bash
adb uninstall com.lxcmyhealthhub
npm run android
```

Important: Android now launches the React Native app through `../lxc-myhealthhub-xda/app/src/main/java/com/lxcmyhealthhub/MainActivity.kt`. The old hardcoded native Kotlin “Health Vault” mock screen has been removed, so the emulator should load `src/screens/HomeScreen.tsx`.

Start Metro:

```bash
npm run start
```

In another terminal:

```bash
npm run android
```

## Test Devices

Physical test device profile:

```text
Device: OPPO Reno10 5G
ColorOS: 15
Android version: [confirm on phone]
CPU: MediaTek Dimensity 7050
RAM: 8 GB physical RAM
Storage: 256 GB
Architecture: [confirm arm64-v8a]
Network: 5G
USB debugging: Enabled
```

The exact Android version, supported ABIs, display resolution, and DPI must be read from the connected phone. Enable `Developer Options > USB debugging`, connect the phone by USB, accept the authorization prompt, then run:

```bash
source "/Users/SageVish/Documents/Development Work/frameworks/android/env.sh"
adb devices -l
adb shell getprop ro.build.version.release
adb shell getprop ro.product.cpu.abilist
adb shell wm size
adb shell wm density
```

Emulator profile:

```text
Device: Pixel 7 or Pixel 8
Android: same API level as the OPPO phone
Architecture: ARM64 preferred
RAM: 4-6 GB
Storage: 8-16 GB
Resolution: approximately 1080 x 2412
```

## Build Android APK

```bash
npm run build:android:debug
```

The debug APK should be generated under:

```text
../lxc-myhealthhub-xda/app/build/outputs/apk/debug/
```

## Android 16 Baseline

The Android project baseline is configured for Android 16 / API 36:

- `compileSdk`: 36
- `targetSdk`: 36
- `minSdk`: 29
- Preferred ABI: `arm64-v8a` (with `x86_64` retained for emulator support)
- Recommended device profile: Pixel 8 Pro, Pixel 9 Pro, or a custom device
- Recommended resolution: `2772 x 1240`
- Recommended RAM: 8 GB or 12 GB

Before building, install Android SDK Platform 36, API 36 build tools, and an Android 16 ARM64 system image. The current local framework bundle still needs these API 36 components added.

Last successful debug APK:

```text
/Users/SageVish/Documents/Development Work/git-repos/LXC-Repos/lxc-myrecords/lxc-myhealthhub-xda/app/build/outputs/apk/debug/app-debug.apk
```

Project-relative path:

```text
../lxc-myhealthhub-xda/app/build/outputs/apk/debug/app-debug.apk
```

## Validation

After loading the local macOS framework environment, run:

```bash
source "/Users/SageVish/Documents/Development Work/frameworks/android/env.sh"
node -v
npm -v
npm install
java -version
npm run typecheck
npm run lint
npm run build:android:debug
```

TypeScript and ESLint currently pass. The last Android debug build completed successfully. Emulator launch still needs the React Native native dependency crash to be resolved.

## Backend Work Needed

The app currently uses mock data in `src/api/healthService.ts`. To connect real data:

- Add login endpoint integration: `POST /auth/login`
- Store JWT securely using `react-native-keychain`
- Attach JWT to `apiClient` requests
- Replace mock service functions with API calls
- Add loading, empty, and error states for each screen
- Validate API responses with `zod`

## Suggested Next Development Order

- [ ] Install Node.js and npm dependencies
- [ ] Open `../lxc-myhealthhub-xda/` in Android Studio and sync Gradle
- [ ] Run the debug app on emulator
- [ ] Fix any native dependency autolinking issues
- [ ] Add login screen and auth flow
- [ ] Connect records, appointments, prescriptions, and vitals APIs
- [ ] Add forms for booking appointments and logging vitals
- [ ] Add push/local notification permission flow
- [ ] Add production app icon and splash screen
- [ ] Configure release keystore
- [ ] Generate signed Android App Bundle
