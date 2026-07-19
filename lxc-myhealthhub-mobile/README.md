# MyHealthHub Mobile App by Lexvora

MyHealthHub is a React Native Android app for patient health records, appointments, prescriptions, vitals, and profile management.

## Current Status

- [x] React Native project metadata created
- [x] TypeScript app source created
- [x] Android native project files created
- [x] App navigation shell created
- [x] Dashboard screen created
- [x] Medical records screen created
- [x] Appointments screen created
- [x] Prescriptions screen created
- [x] Vitals screen created
- [x] Profile screen created
- [x] Mock health service data added
- [x] Environment sample file added
- [x] Android build scripts added
- [ ] Node.js available in local shell
- [ ] npm packages installed
- [ ] Java JDK 17 available in local shell
- [ ] Android Studio installed
- [ ] Android SDK Platform 35 installed
- [ ] Android Gradle wrapper generated or Gradle installed
- [ ] Android debug build verified
- [ ] Android emulator/device run verified
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

The project now contains a working React Native app structure:

```text
lxc-myhealthhub-mobile/
├── android/                # Android native app and Gradle config
├── src/
│   ├── api/                # API client and health service
│   ├── components/         # Shared UI components
│   ├── hooks/              # React Query data hooks
│   ├── navigation/         # Bottom tab navigation
│   ├── screens/            # App screens
│   ├── theme/              # Colors and spacing
│   └── types/              # TypeScript app types
├── .env.example
├── app.json
├── index.js
├── package.json
└── tsconfig.json
```

## Prerequisites

Install these before running the app:

- Node.js 18 or newer
- npm or Yarn
- Java JDK 17
- Android Studio
- Android SDK Platform 35
- Android emulator or physical Android device

## Setup

```bash
cd lxc-myhealthhub-mobile
cp .env.example .env
npm install
```

## Run Android App

Start Metro:

```bash
npm run start
```

In another terminal:

```bash
npm run android
```

## Build Android APK

```bash
npm run build:android:debug
```

The debug APK should be generated under:

```text
android/app/build/outputs/apk/debug/
```

## Important Note

This shell currently cannot run `node` or `npm`, so package installation and Android build verification are still pending. Once Node.js is available, run:

```bash
node -v
npm -v
npm install
java -version
npm run typecheck
npm run build:android:debug
```

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
- [ ] Open `android/` in Android Studio and sync Gradle
- [ ] Run the debug app on emulator
- [ ] Fix any native dependency autolinking issues
- [ ] Add login screen and auth flow
- [ ] Connect records, appointments, prescriptions, and vitals APIs
- [ ] Add forms for booking appointments and logging vitals
- [ ] Add push/local notification permission flow
- [ ] Add production app icon and splash screen
- [ ] Configure release keystore
- [ ] Generate signed Android App Bundle
