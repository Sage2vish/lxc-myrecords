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

## © 2026 Lexvora Consulting

This project is the intellectual property of **Lexvora Consulting**. All rights reserved. For more information, visit [lexvoraconsulting.com](https://lexvoraconsulting.com).
