<p align="center">
  <a href="https://lexvoraconsulting.com" target="_blank">
    <h1 align="center">🩺 MyRecords Healthcare Platform</h1>
  </a>
</p>

<p align="center">
  <a href="https://lexvoraconsulting.com" target="_blank"><strong> lexvoraconsulting.com</strong></a>
</p>

<p align="center">
    <img src="https://img.shields.io/badge/status-active-brightgreen" alt="Status">
    <img src="https://img.shields.io/badge/license-Proprietary-red" alt="License">
    <img src="https://img.shields.io/badge/React%20Native-0.78%20%7C%200.75-61DAFB" alt="React Native">
    <img src="https://img.shields.io/badge/TypeScript-5.5-3178C6" alt="TypeScript">
</p>

---

## 📚 Table of Contents

- [📖 Overview](#-overview)
- [📱 The Applications](#-the-applications)
- [🎯 Platform & Device Targets](#-platform--device-targets)
- [👩‍💻 Developer's Guide](#-developers-guide)
- [🚀 Setup and Running the Apps](#-setup-and-running-the-apps)
- [⚡️ Common Commands](#️-common-commands)
- [�️ Local macOS Development Setup](#️-local-macos-development-setup)
- [📜 Repository History](#-repository-history)
- [🤖 AI Assistant Guide](#-ai-assistant-guide)
- [© License](#-license)

---

## 📖 Overview

This repository is the home of the **Lexvora MyRecords healthcare platform**. It contains two distinct React Native applications:

1.  **MyHealthHub**: A patient-facing mobile app for managing health records.
2.  **DSA Tablet App**: An offline-first tablet app for field agents.

> **Note**: These projects are developed independently within this monorepo. They do not share code or dependencies and are versioned and built separately.

## 📱 The Applications

| App | Who it's for | Platforms | Folder(s) |
|---|---|---|---|
| **MyHealthHub** | Patients | Android, iOS | [`lxc-myhealthhub-shared`](./lxc-myhealthhub-shared/), [`lxc-myhealthhub-xda`](./lxc-myhealthhub-xda/), [`lxc-myhealthhub-ios`](./lxc-myhealthhub-ios/) |
| **DSA Tablet App** | Field agents (Direct Sales Agents) | Android tablet | `lxc-myrecords-dsa-xda` |

---

### 1. 🏥 MyHealthHub Mobile App

The MyHealthHub app is a modern, patient-centric mobile application that empowers patients to manage their health information, connect with providers, and stay informed about their care.

**Key Features:**
- 🗂️ View and manage health records, prescriptions, and vitals
- 📅 Schedule and track appointments, with a dedicated schedule-visit flow
- 👨‍👩‍👧 Family Health Space — family member cards, add-member action, family health score
- ⚡ Quick actions: Health Records, Reports & Visits, Find Nearby Care, Appointments,
  Health App Sync, Family Profiles
- 📞 One-call support card (India head office line)
- 🧑‍⚕️ DSA Assisted Setup card — bridges to in-person agent support
- 🔒 Privacy/security card
- 👤 Profile and settings management

> **Status**: Android build verified (debug APK builds successfully). iOS build verified end-to-end — builds and launches on both the iOS Simulator and a physical device.

> For detailed setup and development instructions, see the app's dedicated README:
> **➡️ `lxc-myhealthhub-shared/README.md`**

---

### 2. 🚐 MyRecords DSA Tablet App

The DSA (Direct Sales Agent) app is a robust, offline-first tablet application for
field agents. It lets agents manage patient and doctor information, book appointments,
and upload documents — even with zero internet connectivity.

### Features

- 🔐 PIN-based authentication (4-6 digit, device-locked)
- 🩺 Doctor management — specialization, schedule, patient assignment
- 📅 Appointments — booking, status tracking, consultation types
- 📎 Document uploads — camera, file picker, document scanner
- 📍 Geo-tracking — GPS tracking, visit logging linked to patients/doctors
- 📋 Medical records — diagnosis, treatment, prescriptions, follow-ups
- 🌐 English + Hindi UI (switchable)
- 💾 **100% offline** — local SQLite storage, sync-ready (`sync_status` column) for
  when a backend is live

> For detailed setup and development instructions, see the app's dedicated README:
> **➡️ `lxc-myrecords-dsa-xda/README.md`**

---

## 🎯 Platform & Device Compatibility

This section explains which devices and operating systems are supported by each application in easy-to-understand terms.

### 🏥 MyHealthHub (Patient App)

This application is designed for patients to use on their personal smartphones.

#### **For Android Users**
*   **Supported OS:** Android 10 or any newer version.
*   **Compatible Devices:** The app is designed for modern Android smartphones released from **late 2019 onwards**. This includes, but is not limited to:
    *   Samsung Galaxy S10 series and newer
    *   Google Pixel 4 and newer
    *   OnePlus 7 series and newer
    *   And any other phone that originally came with Android 10 or has been updated to it.
*   **How to Check:** You can find your Android version in `Settings > About phone > Android version`.

#### **For iPhone Users**
*   **Supported OS:** iOS 15.1 or any newer version.
*   **Compatible Devices:** The app works on the **iPhone 6s and all newer models**. This includes:
    *   iPhone SE (all generations)
    *   iPhone 7, 8, X, 11, 12, 13, 14, 15 and their Plus/Pro/Max variants.
*   **How to Check:** You can find your iOS version in `Settings > General > About`.

---

### 🚐 DSA Tablet App (Field Agent App)

This application is built specifically for field agents to use on Android tablets.

#### **For Android Tablet Users**
*   **Supported OS:** Designed for modern versions of the Android operating system.
*   **Compatible Devices:** The app is intended for use on Android tablets. Specific device compatibility is being finalized, but it is built to perform well on standard, modern tablets from major manufacturers.
*   **Note:** This app is not intended for use on smartphones or Apple iPads.

---

## �‍💻 Developer's Guide

This section provides a deeper look into the architecture and technology choices for developers working on the codebase.

### Core Philosophy
The repository is a "monorepo" of two completely separate applications. A change in one app does not affect the other. This allows for tailored technology choices for each app's specific needs.

### MyHealthHub Architecture
- **Structure**: The app is split into three folders to cleanly separate the shared JavaScript/TypeScript code from the native Android and iOS build projects.
  - `lxc-myhealthhub-shared`: Contains all app logic, screens, components, and assets. **99% of development happens here.**
  - `lxc-myhealthhub-xda`: The native Android project (Gradle).
  - `lxc-myhealthhub-ios`: The native iOS project (Xcode/CocoaPods).
- **Technology**: Built with modern tools including **TypeScript**, **React Navigation 7**, and **TanStack Query** for asynchronous state management. It uses a mock service for now, but is architected for a seamless transition to a live backend.

### DSA Tablet App Architecture
- **Structure**: This app is self-contained within the `lxc-myrecords-dsa-xda` folder.
- **Technology**: Built with **JavaScript** and designed to be **100% offline-first**. All data is stored and managed in a local **SQLite** database. It features a `sync_status` column in its tables, preparing it for future backend synchronization without requiring a constant internet connection.

### Tech Stack Comparison

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

---

##  Setup and Running the Apps

Follow these steps to get a local development environment running.

### Step 1: Set Up The Local Toolchain (CRITICAL)

This project uses a sandboxed, version-pinned toolchain for macOS instead of relying on globally installed tools. Before doing anything else, you **must** load this environment. See the Local macOS Development Setup section for details.

In your terminal, run:
```sh
source "/Users/SageVish/Documents/Development Work/frameworks/android/env.sh"
```

### Step 2: Clone the Repository

```sh
git clone <repository-url>
cd lxc-myrecords
```

### Step 3: Install Dependencies and Run an App

Choose which app you want to work on and run the commands from within its directory.

#### To run the MyHealthHub App:
```sh
cd lxc-myhealthhub-shared
npm install
npm run android # Or npm run ios
```

#### To run the DSA Tablet App:
```sh
cd lxc-myrecords-dsa-xda
npm install
npm run android
```

### Fastest path: one-shot build scripts

For MyHealthHub specifically, `Executable/` at the repo root has scripts that do
everything above in one command — load the toolchain, install deps, build, and
launch — with clear error messages if a prerequisite (Xcode, a device, a folder)
is missing:

```sh
./Executable/macos_iosapp_build.sh          # iOS Simulator/device
./Executable/macos_xdaapp_build.sh          # Android debug/release build
```

## ⚡️ Common Commands

All commands should be run from within the specific app's directory (`lxc-myhealthhub-shared` or `lxc-myrecords-dsa-xda`).

| Command | MyHealthHub (`lxc-myhealthhub-shared`) | DSA Tablet App (`lxc-myrecords-dsa-xda`) |
|---|---|---|
| **Install Dependencies** | `npm install` | `npm install` |
| **Start Metro Bundler** | `npm run start` | `npm run start` |
| **Run on Android** | `npm run android` | `npm run android` |
| **Run on iOS** | `npm run ios` | `npm run ios` (not used) |
| **Lint Code** | `npm run lint` | `npm run lint` |
| **Build Debug APK** | `npm run build:android:debug` | `cd android && ./gradlew assembleDebug` |

## 🛠️ Local macOS Development Setup

> **Important**: This repository uses a sandboxed, project-independent toolchain instead of relying on globally installed packages like Node or Java.

Development on this repo has been done on macOS using a local, project-independent
toolchain kept outside the repo under a shared `frameworks/` folder, rather than relying
on global/system installs of Node, Java, or the Android SDK:

```text
frameworks/
├── android/          # Android SDK, platform tools, emulator tools
├── android-emulator/ # Dedicated emulator installer and AVD files
├── ios/              # Ruby + CocoaPods (needed for iOS builds)
├── jdk/              # JDK 17
├── node/             # Node.js and npm
└── gradle/           # Gradle
```

Before working on either app, the toolchain is loaded into the shell with:

```sh
source "/Users/SageVish/Documents/Development Work/frameworks/android/env.sh"  # Node, Java, Android SDK, Gradle
source "/Users/SageVish/Documents/Development Work/frameworks/ios/env.sh"      # Ruby + CocoaPods — iOS builds only
```

This keeps Node, Java, the Android SDK, and Gradle versions consistent and isolated per
machine, without changing global package-manager state. See
[`lxc-myhealthhub-shared/README.md`](./lxc-myhealthhub-shared/README.md) for the exact
verified tool versions.

## 📜 Project History
- **Initial build-out** — MyHealthHub (patient-facing, Android-first) and the DSA
  tablet app (field-agent, offline-first with SQLite) were developed as two separate
  React Native apps under this repo.
- **2024-07-21 — MyHealthHub split into shared/platform folders.** The single
  `lxc-myhealthhub-mobile` app was split into `lxc-myhealthhub-shared` (JS/TS source,
  the common area) plus `lxc-myhealthhub-xda` (Android builder) and
  `lxc-myhealthhub-ios` (iOS builder), so the native Android/iOS build projects are
  clearly separated from the app code they both build. React Native's own file-suffix
  convention (`Thing.ios.tsx` / `Thing.android.tsx`) is still the mechanism for any
  platform-specific code.
- **2024-07-21 — DSA app renamed.** `lxc-myrecords-dsaapp-xda` was renamed to
  `lxc-myrecords-dsa-xda` for naming consistency with the rest of the repo.

## 🤖 AI Assistant Guide

This repository includes a `CLAUDE.md` file containing detailed context for AI coding assistants. It covers the repository layout, the unique macOS toolchain setup, and architectural conventions. To ensure the best results when using an AI assistant, please provide it with the contents of this file.

---

## © License

This project is the intellectual property of **Lexvora Consulting**. All rights
reserved. © 2024 Lexvora Consulting. For more information, visit
[lexvoraconsulting.com](https://lexvoraconsulting.com).
