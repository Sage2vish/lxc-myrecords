<p align="center">
  <a href="https://lexvoraconsulting.com" target="_blank">
    <h1 align="center">🩺 Lexvora Consulting - Health</h1>
  </a>
  <p align="center"><strong>MyRecords Healthcare Platform</strong></p>
</p>

<p align="center">
  Two React Native applications — a patient-facing mobile app and a field-agent tablet app —
  built and maintained by <a href="https://lexvoraconsulting.com" target="_blank">Lexvora Consulting</a>.
</p>

---

## 📚 Table of Contents

- [Overview](#-overview)
- [Applications at a Glance](#-applications-at-a-glance)
- [1. MyHealthHub Mobile App](#1--myhealthhub-mobile-app)
- [2. MyRecords DSA Tablet App](#2--myrecords-dsa-tablet-app)
- [Tech Stack](#-tech-stack)
- [Repository Structure](#-repository-structure)
- [Getting Started](#-getting-started)
- [Local macOS Development Setup](#local-macos-development-setup)
- [Project History](#-project-history)
- [Working with Claude Code](#-working-with-claude-code)
- [License](#-license)

---

## 📖 Overview

This repository contains the source for the **Lexvora MyRecords healthcare platform**:
a patient-facing mobile app (**MyHealthHub**) and an offline-first field-agent tablet
app (**DSA**). Both are independent React Native projects living side by side in this
monorepo — they don't share code or a dependency tree, and are built/versioned
separately.

## 📱 Applications at a Glance

| App | Who it's for | Platforms | Folder(s) |
|---|---|---|---|
| **MyHealthHub** | Patients | Android, iOS | [`lxc-myhealthhub-shared`](./lxc-myhealthhub-shared/), [`lxc-myhealthhub-xda`](./lxc-myhealthhub-xda/), [`lxc-myhealthhub-ios`](./lxc-myhealthhub-ios/) |
| **DSA Tablet App** | Field agents (Direct Sales Agents) | Android tablet (+ Expo web for dev preview) | [`lxc-myrecords-dsa-xda`](./lxc-myrecords-dsa-xda/) |

---

## 1. 🏥 MyHealthHub Mobile App

The MyHealthHub app is a modern, patient-centric mobile application. It lets patients
manage their health information, connect with providers, and stay informed about their
care, built around a "Family Health Space" concept.

### Features

- 🗂️ View and manage health records, prescriptions, and vitals
- 📅 Schedule and track appointments, with a dedicated schedule-visit flow
- 👨‍👩‍👧 Family Health Space — family member cards, add-member action, family health score
- ⚡ Quick actions: Health Records, Reports & Visits, Find Nearby Care, Appointments,
  Health App Sync, Family Profiles
- 📞 One-call support card (India head office line)
- 🧑‍⚕️ DSA Assisted Setup card — bridges to in-person agent support
- 🔒 Privacy/security card
- 👤 Profile and settings management

### Platform & Device Compatibility

| | Requirement |
|---|---|
| **Android** | minSdk 29 (Android 10+) · compileSdk/targetSdk 35 (Android 15) · preferred ABI `arm64-v8a` (`x86_64` retained for emulators) |
| **iOS** | iOS 15.1+ (`IPHONEOS_DEPLOYMENT_TARGET`) |
| App ID | `com.lxcmyhealthhub` |
| Version | `0.1.0` (Android `versionName`) / `1.0` (iOS marketing version) |

> Status: Android build verified (debug APK builds successfully). iOS project exists
> and is configured but a real device/simulator run has not yet been verified.

> For detailed setup and development instructions, see
> [`lxc-myhealthhub-shared/README.md`](./lxc-myhealthhub-shared/README.md).

---

## 2. 🚐 MyRecords DSA Tablet App

The DSA (Direct Sales Agent) app is a robust, offline-first tablet application for
field agents. It lets agents manage patient and doctor information, book appointments,
and upload documents — even with zero internet connectivity.

### Features

- 🔐 PIN-based authentication (4-6 digit, device-locked)
- 👤 Patient management — profiles, medical history, doctor assignment
- 🩺 Doctor management — specialization, schedule, patient assignment
- 📅 Appointments — booking, status tracking, consultation types
- 📎 Document uploads — camera, file picker, document scanner
- 📍 Geo-tracking — GPS tracking, visit logging linked to patients/doctors
- 📋 Medical records — diagnosis, treatment, prescriptions, follow-ups
- 🌐 English + Hindi UI (switchable)
- 💾 **100% offline** — local SQLite storage, sync-ready (`sync_status` column) for
  when a backend is live

### Platform & Device Compatibility

| | Requirement |
|---|---|
| **Android** | Android tablet target. A native Android project has not been generated yet in this repo (Expo/Metro-based dev flow so far) — SDK floor is not yet pinned. |
| **iOS** | Not targeted currently (Android tablet only). An iPadOS build is a possible future addition — see the app's own README. |
| **Web** | Expo Webpack config present, used for in-browser dev preview only |
| App ID | `LexvoraDSA` |
| Version | `1.0.0` |

> For detailed setup and development instructions, see
> [`lxc-myrecords-dsa-xda/README.md`](./lxc-myrecords-dsa-xda/README.md).

---

## ⚙️ Tech Stack

| | MyHealthHub | DSA Tablet App |
|---|---|---|
| **Language** | TypeScript | JavaScript |
| **React** | 19.0.0 | 18.3.1 |
| **React Native** | 0.78.3 | 0.75.4 |
| **Navigation** | React Navigation 7 (bottom tabs) | React Navigation 6 (bottom tabs + native stack) |
| **Data fetching** | TanStack Query 5 + Axios | — (local-only, no backend calls yet) |
| **Local storage** | AsyncStorage 2, `react-native-keychain` (installed, not yet wired up) | SQLite (`react-native-sqlite-storage`) + AsyncStorage |
| **Validation** | `zod` (installed, not yet wired up) | — |
| **State management** | `zustand` (installed, not yet wired up) | React local state |
| **i18n** | `i18n-js` (installed, not yet wired up) | `i18n-js` — English + Hindi, active |
| **Env config** | `react-native-config` | — |
| **Bundler** | Metro | Metro (native) + Webpack via `@expo/webpack-config` (web preview) |
| **Testing** | Jest configured (no test files written yet) | — |
| **Linting** | ESLint (`@react-native/eslint-config`) | ESLint (`@react-native/eslint-config`) |
| **Node engine** | `>=18` | `>=18` |

Some MyHealthHub dependencies (`zod`, `zustand`, `i18n-js`, `react-native-keychain`)
are pre-installed for near-term roadmap items (auth, secure token storage, Hindi
translations) and aren't wired into the app yet — see
[`lxc-myhealthhub-shared/README.md`](./lxc-myhealthhub-shared/README.md) for the
current build/backend TODO list.

## 🗂️ Repository Structure

```text
lxc-myrecords/
├── lxc-myhealthhub-shared/   # MyHealthHub: shared JS/TS source, assets, package.json
├── lxc-myhealthhub-xda/      # MyHealthHub: Android native project (Gradle)
├── lxc-myhealthhub-ios/      # MyHealthHub: iOS native project (Xcode/CocoaPods)
├── lxc-myrecords-dsa-xda/    # DSA Tablet App (Android + Expo web, self-contained)
├── CLAUDE.md                 # Instructions for Claude Code / AI assistants working in this repo
└── README.md                 # This file
```

Both apps are React Native. MyHealthHub targets Android and iOS; the DSA app currently
targets Android tablets only (an iPadOS build is a possible future addition — see
`lxc-myrecords-dsa-xda`'s own README for its roadmap notes).

## 🚀 Getting Started

1. **Clone the repo** and `cd` into it.
2. **Set up the local toolchain** (macOS) — see
   [Local macOS Development Setup](#local-macos-development-setup) below.
3. **Pick an app** and install its dependencies:

   ```bash
   # MyHealthHub
   cd lxc-myhealthhub-shared
   cp .env.example .env
   npm install

   # DSA Tablet App
   cd lxc-myrecords-dsa-xda
   npm install
   ```

4. **Run it** — each app's own README has the full command set (Metro, Android,
   iOS/Pods, linting, builds):
   - [`lxc-myhealthhub-shared/README.md`](./lxc-myhealthhub-shared/README.md)
   - [`lxc-myrecords-dsa-xda/README.md`](./lxc-myrecords-dsa-xda/README.md)

## Local macOS Development Setup

Development on this repo has been done on macOS using a local, project-independent
toolchain kept outside the repo under a shared `frameworks/` folder, rather than relying
on global/system installs of Node, Java, or the Android SDK:

```text
frameworks/
├── android/           # Android SDK, platform tools, emulator tools
├── android-emulator/  # Dedicated emulator installer and AVD files
├── jdk/                # JDK 17
├── node/               # Node.js and npm
└── gradle/             # Gradle
```

Before working on either app, the toolchain is loaded into the shell with:

```bash
source "/Users/SageVish/Documents/Development Work/frameworks/android/env.sh"
```

This keeps Node, Java, the Android SDK, and Gradle versions consistent and isolated per
machine, without changing global package-manager state. See
[`lxc-myhealthhub-shared/README.md`](./lxc-myhealthhub-shared/README.md) for the exact
verified tool versions.

## 📜 Project History

- **Initial build-out** — MyHealthHub (patient-facing, Android-first) and the DSA
  tablet app (field-agent, offline-first with SQLite) were developed as two separate
  React Native apps under this repo.
- **2026-07-21 — MyHealthHub split into shared/platform folders.** The single
  `lxc-myhealthhub-mobile` app was split into `lxc-myhealthhub-shared` (JS/TS source,
  the common area) plus `lxc-myhealthhub-xda` (Android builder) and
  `lxc-myhealthhub-ios` (iOS builder), so the native Android/iOS build projects are
  clearly separated from the app code they both build. React Native's own file-suffix
  convention (`Thing.ios.tsx` / `Thing.android.tsx`) is still the mechanism for any
  platform-specific code — the split is about build-project layout, not forking the
  JS source.
- **2026-07-21 — DSA app renamed.** `lxc-myrecords-dsaapp-xda` was renamed to
  `lxc-myrecords-dsa-xda` for naming consistency with the rest of the repo.

## 🤖 Working with Claude Code

This repo includes a [`CLAUDE.md`](./CLAUDE.md) file with project-specific context and
rules for Claude Code (or other AI coding assistants). Anyone — including future team
members — picking up this project with Claude Code should have it pick up that file
automatically; it covers the repo layout, the macOS toolchain setup, and conventions to
follow when making changes.

---

## © License

This project is the intellectual property of **Lexvora Consulting**. All rights
reserved. © 2026 Lexvora Consulting. For more information, visit
[lexvoraconsulting.com](https://lexvoraconsulting.com).
