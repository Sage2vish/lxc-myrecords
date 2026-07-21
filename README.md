<p align="center">
  <a href="https://lexvoraconsulting.com" target="_blank">
    <h3 align="center">Lexvora Consulting</h3>
  </a>
</p>

This repository contains the source code for the Lexvora MyRecords healthcare platform, which includes a patient-facing mobile application and a field agent tablet application.

## 📂 Projects

This monorepo contains two primary React Native applications:

1.  **MyHealthHub Mobile App** — split into three folders:
    - [**lxc-myhealthhub-shared**](./lxc-myhealthhub-shared/) — all JS/TS source, screens, and assets (start here)
    - [**lxc-myhealthhub-xda**](./lxc-myhealthhub-xda/) — Android native project (Gradle)
    - [**lxc-myhealthhub-ios**](./lxc-myhealthhub-ios/) — iOS native project (Xcode/CocoaPods)
2.  [**MyRecords DSA Tablet App**](./lxc-myrecords-dsa-xda/)

---

### 1. MyHealthHub Mobile App (`lxc-myhealthhub-shared` + `lxc-myhealthhub-xda` + `lxc-myhealthhub-ios`)

The MyHealthHub app is a modern, patient-centric mobile application for Android and iOS. It allows patients to manage their health information, connect with providers, and stay informed about their care.

**Key Features:**
-   View and manage health records, prescriptions, and vitals.
-   Schedule and track appointments.
-   Manage user profile and settings.
-   Designed with a clean, user-friendly interface.

**Technology:**
-   React Native
-   TypeScript

> For detailed setup and development instructions, please see the MyHealthHub README.

---

### 2. MyRecords DSA Tablet App (`lxc-myrecords-dsa-xda`)

The DSA (Direct Sales Agent) app is a robust, offline-first tablet application designed for field agents. It enables agents to manage patient and doctor information, book appointments, and upload documents, even without an internet connection.

**Key Features:**
-   **100% Offline Functionality** using a local SQLite database.
-   PIN-based authentication for security.
-   Comprehensive management of patients, doctors, appointments, and medical records.
-   Document uploads via camera and file picker.
-   Geo-tracking for logging field visits.

> For detailed setup and development instructions, please see the DSA App README.

---

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

Both apps are React Native + TypeScript/JavaScript. MyHealthHub targets Android and iOS;
the DSA app currently targets Android tablets only (an iPadOS build is a possible future
addition — see `lxc-myrecords-dsa-xda`'s own README for its roadmap notes).

### Local macOS Development Setup

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

- **Initial build-out** — MyHealthHub (patient-facing, Android-first) and the DSA tablet
  app (field-agent, offline-first with SQLite) were developed as two separate React
  Native apps under this repo.
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

## © 2026 Lexvora Consulting

This project is the intellectual property of **Lexvora Consulting**. All rights reserved. For more information, visit [lexvoraconsulting.com](https://lexvoraconsulting.com).
