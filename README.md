<h1 id="myrecords-healthcare-platform" align="center">🩺 MyRecords Healthcare Platform</h1>

<p align="center">
  <a href="https://lexvoraconsulting.com" target="_blank"><strong>lexvoraconsulting.com</strong></a>
</p>

<p align="center">
    <img src="https://img.shields.io/badge/status-active-brightgreen" alt="Status">
    <img src="https://img.shields.io/badge/license-Proprietary-red" alt="License">
    <img src="https://img.shields.io/badge/React%20Native-0.78%20%7C%200.75-61DAFB" alt="React Native">
    <img src="https://img.shields.io/badge/TypeScript-5.5-3178C6" alt="TypeScript">
</p>

---

<h2 id="myhealthhub-premium-showcase">✨ MyHealthHub Premium Showcase</h2>

<p align="center">
  <img src="./lxc-myhealthhub-shared/assets/myhealthhub-icon.png" alt="MyHealthHub logo" width="112" />
</p>

<h2 align="center">AI Powered Personal Health Ecosystem</h2>

<p align="center"><strong>One App. One Health Identity. One Secure Digital Vault.</strong></p>
<p align="center">iOS • Android • Web</p>

<p align="center">
  <a href="https://github.com/Sage2vish/lxc-myrecords"><img src="https://img.shields.io/badge/Star-Repository-111827?style=for-the-badge" alt="Star"></a>
  <a href="https://github.com/Sage2vish/lxc-myrecords/fork"><img src="https://img.shields.io/badge/Fork-Project-0F766E?style=for-the-badge" alt="Fork"></a>
  <a href="#setup-and-running-the-apps"><img src="https://img.shields.io/badge/Download-Builds-7C3AED?style=for-the-badge" alt="Download"></a>
  <a href="#myhealthhub-premium-showcase"><img src="https://img.shields.io/badge/Documentation-Read_More-0A6BFF?style=for-the-badge" alt="Documentation"></a>
  <a href="https://github.com/Sage2vish/lxc-myrecords/issues"><img src="https://img.shields.io/badge/Issues-Track-B91C1C?style=for-the-badge" alt="Issues"></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React%20Native-0.78%20%7C%200.75-61DAFB?style=for-the-badge" alt="React Native">
  <img src="https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge" alt="TypeScript">
  <img src="https://img.shields.io/badge/Android-API%2036-34A853?style=for-the-badge" alt="Android">
  <img src="https://img.shields.io/badge/iOS-15.1%2B-000000?style=for-the-badge" alt="iOS">
  <img src="https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge" alt="Node.js">
  <img src="https://img.shields.io/badge/Express-API%20Layer-4B5563?style=for-the-badge" alt="Express">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/ABDM-aware-0EA5E9?style=for-the-badge" alt="ABDM aware">
  <img src="https://img.shields.io/badge/FHIR-friendly-14B8A6?style=for-the-badge" alt="FHIR friendly">
  <img src="https://img.shields.io/badge/Security-first-111827?style=for-the-badge" alt="Security first">
  <img src="https://img.shields.io/badge/Build-Passing-16A34A?style=for-the-badge" alt="Build passing">
  <img src="https://img.shields.io/badge/Version-main-8B5CF6?style=for-the-badge" alt="Version">
</p>

<table>
  <tr>
    <td align="center"><strong>MyHealthHub</strong><br/>Patient-focused mobile experience</td>
    <td align="center"><strong>LXC-Health-API</strong><br/>Reusable Lexvora backend module</td>
    <td align="center"><strong>Hostinger</strong><br/>Production deployment target</td>
  </tr>
</table>

### Screenshots

<table>
  <tr>
    <th>Home</th>
    <th>Health</th>
    <th>Reports</th>
  </tr>
  <tr>
    <td>Glass hero, family cards, weather, quick actions</td>
    <td>Vitals, timelines, and health insights</td>
    <td>Documents, labs, and medical records</td>
  </tr>
  <tr>
    <th>Appointments</th>
    <th>Vault</th>
    <th>Profile</th>
  </tr>
  <tr>
    <td>Upcoming visits and scheduling</td>
    <td>Secure storage for health assets</td>
    <td>Identity, settings, and family management</td>
  </tr>
</table>

> Add real screenshots under a future `docs/screenshots/` folder to turn this
> table into a true gallery. The layout is already ready for it.

### Feature Cards

<table>
  <tr>
    <td width="33%"><strong>❤️ Health Dashboard</strong><br/>A calm, glassy home surface that keeps the most important health signals visible first.</td>
    <td width="33%"><strong>📅 Smart Appointments</strong><br/>Appointment previews, scheduled visits, and quick access to the next action.</td>
    <td width="33%"><strong>📑 Medical Reports</strong><br/>Labs, radiology, and records grouped into a clean, scannable experience.</td>
  </tr>
  <tr>
    <td><strong>💊 Medication</strong><br/>Medication-aware spaces for future prescribing and adherence workflows.</td>
    <td><strong>🧬 Health Timeline</strong><br/>A structured view of patient history and change over time.</td>
    <td><strong>🔔 Notifications</strong><br/>Useful reminders and state updates without clutter.</td>
  </tr>
  <tr>
    <td><strong>🔐 Secure Vault</strong><br/>Private storage for records, documents, and sensitive attachments.</td>
    <td><strong>🤖 AI Assistant</strong><br/>A future-ready layer for intelligent guidance and workflow help.</td>
    <td><strong>☁ Cloud Sync</strong><br/>The app is structured to connect to a secure backend when the service is ready.</td>
  </tr>
</table>

### Architecture

```mermaid
flowchart TB
    IOS[iOS]
    AND[Android]
    WEB[Web]
    SHARED[Shared Screens<br/>lxc-myhealthhub-shared]
    API[LXC-Health-API<br/>Node.js + Express<br/>/v1 routes]
    AUTH[Authentication]
    BIZ[Business Services]
    AI[AI / Integrations]
    DB[(Database)]

    IOS --> SHARED
    AND --> SHARED
    WEB --> SHARED
    SHARED --> API
    API --> AUTH --> BIZ --> AI --> DB
```

### Technology Stack

| Layer | Technology |
|---|---|
| Mobile | React Native |
| Language | TypeScript + JavaScript |
| Backend | Node.js + Express |
| Database | SQLite today, backend-ready for future shared services |
| Cloud | Hostinger |
| Authentication | Device auth now, OAuth2-ready later |
| API Docs | Swagger / OpenAPI |
| External Providers | WeatherAPI.com through `LXC-Health-API` |

### Folder Structure

```text
MyRecords/
├── Executable
├── lxc-health-api
├── lxc-myhealthhub-ios
├── lxc-myhealthhub-shared
│   ├── assets
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   ├── navigation
│   │   ├── screens
│   │   ├── services
│   │   ├── hooks
│   │   ├── utils
│   │   └── theme
├── lxc-myhealthhub-xda
├── lxc-myrecords-dsa-xda
├── docs
└── README.md
```

### Roadmap

- [x] Login
- [x] Dashboard
- [x] Health Records
- [x] Reports
- [ ] Doctor Consultation
- [ ] Wearables
- [ ] Apple Health
- [ ] Google Fit
- [ ] AI Health Coach

### Project Status

```text
███████████░░░░░░

65% Complete
```

### Documentation Links

| Doc | Purpose |
|---|---|
| Architecture | How the shared app, native shells, and backend fit together |
| API Documentation | Swagger/OpenAPI for `LXC-Health-API` |
| Release Notes | Stable build and deployment notes |
| Version History | What changed, when, and why |
| User Guide | End-user workflows for MyHealthHub |
| Developer Guide | Setup, conventions, and implementation details |

### Contributors

<table>
  <tr>
    <td><strong>👨‍💻 Vishal</strong><br/>Enterprise Architect</td>
    <td><strong>👨‍💻 Navneet</strong><br/>Principal Developer</td>
  </tr>
</table>

### License

Proprietary Lexvora Consulting codebase. Internal use and controlled distribution only.

### Contact

| Channel | Link |
|---|---|
| Website | [lexvoraconsulting.com](https://lexvoraconsulting.com) |
| Repository | [GitHub](https://github.com/Sage2vish/lxc-myrecords) |
| Issues | [Bug tracker](https://github.com/Sage2vish/lxc-myrecords/issues) |
| Docs | This README plus the app and API subproject READMEs |

### Footer

Made with ❤️ by Lexvora Consulting  
Copyright 2026

### Premium Extras

<details>
<summary>GitHub features this README can use later</summary>

- Animated GIFs
- SVG banners
- Mermaid flowcharts
- Collapsible sections
- Image galleries
- Task lists
- Syntax-highlighted code blocks
- Shields.io badges
- Release badges
- CI/CD badges

</details>

---

## 📖 Platform Dossier

This repository is the home of the **Lexvora MyRecords healthcare platform**.
It contains two independently built React Native applications:

1. **MyHealthHub**: a patient-facing mobile app for managing health records.
2. **DSA Tablet App**: an offline-first tablet app for field agents.

> **Note**: The two apps do not share code or dependencies. They are versioned
> and built separately inside the same monorepo.

### Current Context

**Weather integration status**

- Main branch contains the Hostinger weather integration as of 2026-07-25
- Reusable backend module: [`lxc-health-api`](./lxc-health-api/)
- `LXC-Health-API` is not only a MyHealthHub helper. It is a shared Lexvora API
  module that any Lexvora app can consume, and it is eligible to become its own
  repository or package later.
- MyHealthHub calls `LXC-Health-API` first, and `LXC-Health-API` calls
  WeatherAPI.com internally.
- Production WeatherAPI secrets belong in Hostinger environment variables, not in app source
- Temporary dev fallback support exists in the mobile app so the home temperature can still render during backend setup
- Weather uses phone latitude/longitude when available and falls back to Dubai
- Current production API deployment target shown in Hostinger: `https://apis.lexvoraconsulting.com`

### Application & Engines

| App / Engine | Who it's for | Platforms | Folder(s) |
|---|---|---|---|
| **MyHealthHub** | Patients | Android, iOS | [`lxc-myhealthhub-shared`](./lxc-myhealthhub-shared/), [`lxc-myhealthhub-xda`](./lxc-myhealthhub-xda/), [`lxc-myhealthhub-ios`](./lxc-myhealthhub-ios/) |
| **DSA Tablet App** | Field agents (Direct Sales Agents) | Android tablet | `lxc-myrecords-dsa-xda` |
| **LXC-Health-API** | Backend services | Node.js | `lxc-health-api` |

---

### 1. 🏥 MyHealthHub Mobile App

The MyHealthHub app is a modern, patient-centric mobile application that helps
patients manage health information, connect with providers, and stay informed
about their care.

**Key Features:**
- 🗂️ View and manage health records, prescriptions, and vitals
- 📅 Schedule and track appointments, with a dedicated schedule-visit flow
- 👨‍👩‍👧 Family Health Space — family member cards, add-member action, family health score
- ⚡ Quick actions: Health Records, Reports & Visits, Find Nearby Care, Appointments,
  Health App Sync, Family Profiles
- 📅 Upcoming Appointments card with collapsible top-3 preview, split detail rows,
  and doctor-gender icons
- 🧪 Lab Reports & Results card with tabbed Medication / Laboratory / Radiology views
- 📂 Document Vault card with secure uploads and top-5 preview when expanded
- 📞 One-call support card (India head office line)
- 🧑‍⚕️ DSA Assisted Setup card — bridges to in-person agent support
- 🔒 Privacy/security card
- 👤 Profile and settings management
- 🌤️ Weather integration through `/v1/weather/today`; city and Celsius temperature render below the top glass header, outside the header slab, in ruby pink

> **Status**: Android build verified (debug APK builds successfully). iOS build
> verified end-to-end and launches on both the iOS Simulator and a physical
> device.
>
> **Important iOS note**: when opening the native iOS project in Xcode, use
> `LxcMyHealthHub.xcworkspace` and not `LxcMyHealthHub.xcodeproj`. The
> workspace is the correct entry point because CocoaPods-generated targets and
> framework links live there.

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

### Platform & Device Compatibility

This section explains which devices and operating systems are supported by each
application in easy-to-understand terms.

### Backend Runtime

| Engine | Frameworks | Hostinger Preset | Recommended Runtime | Deployment / Swagger URL |
|---|---|---|---|---|
| `LXC-Health-API` | Node.js, Express.js | `Express` | Node.js `20.x` | `https://apis.lexvoraconsulting.com` |

`LXC-Health-API` deploys from `lxc-health-api/publish/`. It is intentionally
kept as a separate backend engine so any Lexvora application can reuse it, and
it can later move into its own repository/package without coupling the mobile
apps to external providers directly.

### MyHealthHub Android Compatibility

| Android Version | API Level | Support Status | Compatible Device Examples | Notes |
|---|---:|---|---|---|
| Android 16 | API 36 | Target platform | Pixel 8 Pro, Pixel 9 Pro, modern Samsung/OnePlus flagships when updated | Current Android project target baseline. |
| Android 15 | API 35 | Supported | Pixel 6+, Samsung Galaxy S21+, OnePlus 9+, OPPO Reno modern models | Verified local framework currently has Android SDK Platform 35. |
| Android 14 | API 34 | Supported | Pixel 4a 5G+, Galaxy S20+, OnePlus 8+, many 2020+ phones | Good production compatibility band. |
| Android 13 | API 33 | Supported | Pixel 4+, Galaxy S10/S20+, OnePlus 7T+, many 2019+ phones | Supported by the app baseline. |
| Android 12 / 12L | API 31 / 32 | Supported | Pixel 3+, Galaxy S10+, OnePlus 7+, tablets on Android 12L | Compatible with current React Native baseline. |
| Android 11 | API 30 | Supported | Pixel 2+, Galaxy S9/S10+, OnePlus 6T+ | Supported, but test on real device before release. |
| Android 10 | API 29 | Minimum supported | Galaxy S10 series, Pixel 4, OnePlus 7 series, OPPO Reno class devices | Minimum Android version for MyHealthHub. |
| Android 9 and below | API 28 and below | Not supported | Older phones released before Android 10 | Outside current app support. |

### MyHealthHub iPhone Compatibility

| iPhone / iOS Band | Minimum iOS | Support Status | Compatible Device Examples | Notes |
|---|---:|---|---|---|
| Latest iPhones | iOS 17 / 18+ | Supported | iPhone 15, 15 Plus, 15 Pro, 15 Pro Max, newer models | Preferred modern test band. |
| Recent iPhones | iOS 16+ | Supported | iPhone 12, 13, 14 series and SE 3rd generation | Strong production compatibility band. |
| Older supported iPhones | iOS 15.1+ | Supported | iPhone 6s, 6s Plus, SE 1st generation, 7, 7 Plus, 8, 8 Plus, X, XS, XR, 11 series | iOS `15.1` is the minimum supported iOS version. |
| Below iOS 15.1 | Below iOS 15.1 | Not supported | Devices that cannot install iOS 15.1 or newer | Outside current app support. |

### DSA Tablet Compatibility

| App | Device Type | OS Support | Device Examples | Notes |
|---|---|---|---|---|
| DSA Tablet App | Android tablets | Modern Android tablet versions | Samsung Galaxy Tab series, Lenovo Android tablets, other enterprise Android tablets | Built for field-agent tablet workflows. |
| DSA Tablet App | Phones | Not intended | Android phones | Use MyHealthHub for phone workflows. |
| DSA Tablet App | iPad | Not supported today | iPad / iPadOS | Future iPad support would need its own native builder folder. |

### Weather API Contract

| Consumer | Preferred Location Input | Fallback | API Contract |
|---|---|---|---|
| MyHealthHub mobile app | Phone latitude and longitude | Dubai | `GET /v1/weather/today?lat=<lat>&lon=<lon>` |

---

### Architecture Details

The platform is intentionally split into independent layers. The mobile apps
own the user experience, `LXC-Health-API` owns healthcare-facing backend
contracts, and external providers stay behind the backend boundary. This makes
the system secure, reusable, and loosely coupled.

`LXC-Health-API` is a separate module inside this monorepo today, but it should
be treated as a product-grade service boundary. Any Lexvora app can call it in
the future, and the folder is eligible to be extracted into its own repository
or published package when the platform grows.

```mermaid
flowchart LR
    subgraph Mobile["MyHealthHub Mobile Shells"]
        IOS["iOS Native Builder\nlxc-myhealthhub-ios"]
        AND["Android Native Builder\nlxc-myhealthhub-xda"]
        SHARED["Shared React Native Screens\nlxc-myhealthhub-shared"]
        IOS --> SHARED
        AND --> SHARED
    end

    subgraph APIBox["Reusable Lexvora API Module"]
        API["LXC-Health-API\nNode.js + Express\n/v1 routes"]
        REGISTRY["Central Provider Registry\napis.weather.weatherapi.forecastv1"]
        SWAGGER["Swagger / OpenAPI\n/docs + /openapi.json"]
        API --> REGISTRY
        API --> SWAGGER
    end

    SHARED -->|GET /v1/weather/today\nlat/lon from phone| API
    API -->|WeatherAPI.com request| WEATHER["External WeatherAPI.com"]

    subgraph Security["Security + Coupling Rules"]
        S1["Mobile apps call Lexvora APIs, not provider APIs"]
        S2["Provider keys stay in Hostinger env vars"]
        S3["External providers can change without app rewrites"]
        S4["API contracts are versioned under /v1"]
    end

    API --- Security

    classDef mobile fill:#EAF4FF,stroke:#0D63B7,color:#073B86,stroke-width:1.5px;
    classDef api fill:#FFF4F8,stroke:#F41678,color:#7A1847,stroke-width:1.5px;
    classDef ext fill:#F4F7FB,stroke:#66758C,color:#10254A,stroke-width:1.5px;
    classDef sec fill:#F8FAFC,stroke:#94A3B8,color:#334155,stroke-width:1px;
    class IOS,AND,SHARED mobile
    class API,REGISTRY,SWAGGER api
    class WEATHER ext
    class S1,S2,S3,S4 sec
```

### Mobile Layer

MyHealthHub is split into three folders so native build concerns and shared app
logic stay clean:

| Layer | Folder | Responsibility |
|---|---|---|
| iOS native shell | [`lxc-myhealthhub-ios`](./lxc-myhealthhub-ios/) | Xcode project, CocoaPods, iOS build and signing setup |
| Android native shell | [`lxc-myhealthhub-xda`](./lxc-myhealthhub-xda/) | Gradle project, Android manifest, APK/AAB build setup |
| Shared app source | [`lxc-myhealthhub-shared`](./lxc-myhealthhub-shared/) | Screens, navigation, assets, theme, API callers, React Native app logic |

Both iOS and Android render the same shared screens. That means a screen change,
theme token update, or API call flow usually happens once in
`lxc-myhealthhub-shared` and is then built by both native shells.

### API Layer

`LXC-Health-API` lives in [`lxc-health-api`](./lxc-health-api/) and is the
backend contract layer for health-related API capabilities. It is currently
deployed as a Hostinger Node.js app, but it is designed as a reusable Lexvora
service module.

| API Capability | Current Status | Notes |
|---|---|---|
| Runtime | Node.js + Express | Recommended Hostinger runtime: Node.js `20.x` |
| Versioning | `/v1/...` | Keeps mobile contracts stable as new versions are introduced |
| Documentation | Swagger at `/docs` | Raw OpenAPI available at `/openapi.json` |
| Health check | `GET /v1/health` | Confirms the service is alive |
| Weather | `GET /v1/weather/today` | Accepts `lat`/`lon` or `q`; falls back to Dubai |
| Provider registry | `apis.weather.weatherapi.forecastv1` | Keeps external provider URLs and keys in one common place |

### External Provider Boundary

The mobile apps do not need to know WeatherAPI.com URLs, query rules, or secret
keys. They only call Lexvora-owned endpoints. `LXC-Health-API` then talks to
the external provider internally.

This gives the platform several advantages:

- **Security**: provider API keys stay in Hostinger environment variables.
- **Loose coupling**: mobile apps are not tied to WeatherAPI.com directly.
- **Provider flexibility**: WeatherAPI.com can be replaced or supplemented later
  without changing every mobile app screen.
- **Shared reuse**: other Lexvora apps can use the same weather endpoint without
  copying provider logic.
- **Version safety**: `/v1` contracts can keep working while `/v2` evolves.
- **Testing clarity**: Swagger lets the backend be tested online before mobile
  apps depend on it.

### Request Flow

Current weather flow:

1. The phone provides latitude and longitude when available.
2. `lxc-myhealthhub-shared/src/api/weather.ts` calls
   `GET /v1/weather/today?lat=<lat>&lon=<lon>`.
3. `LXC-Health-API` reads the WeatherAPI.com provider config from the central
   API registry.
4. `LXC-Health-API` calls WeatherAPI.com using server-side credentials.
5. The backend normalizes the provider response into an app-friendly JSON shape.
6. MyHealthHub renders the city and Celsius temperature on the home screen.

If phone location or provider lookup fails, the backend falls back to Dubai so
the app can still show a predictable weather result.

### Future Extraction Path

`LXC-Health-API` is intentionally kept in its own folder with its own
`package.json`, `tsconfig.json`, README, env contract, Swagger config, routes,
services, and publish workflow. That makes future extraction straightforward:

| Future Step | Why It Is Possible |
|---|---|
| Move to a separate repository | The module already has its own source, package metadata, docs, and deployment bundle |
| Publish as an internal package | API registry, service modules, and typed contracts can be packaged independently |
| Serve multiple Lexvora apps | The API contract is app-agnostic and versioned under `/v1` |
| Add more providers | External APIs are hidden behind backend services and central config |
| Add auth and rate limits | Mobile callers already route through one backend boundary |

---

### Developer's Guide

This section provides a deeper look into the architecture and technology choices for developers working on the codebase.

### Core Philosophy
The repository is a monorepo of two separate applications. A change in one app
does not affect the other. That allows each app to keep its own technology and
release decisions.

### MyHealthHub Architecture
- **Structure**: The app is split into three folders to cleanly separate the shared JavaScript/TypeScript code from the native Android and iOS build projects.
  - `lxc-myhealthhub-shared`: Contains all app logic, screens, components, and assets. **99% of development happens here.**
  - `lxc-myhealthhub-xda`: The native Android project (Gradle).
  - `lxc-myhealthhub-ios`: The native iOS project (Xcode/CocoaPods).
- **Technology**: Built with modern tools including **TypeScript**, **React
  Navigation 7**, and **TanStack Query** for asynchronous state management. It
  uses a mock service for now, but is architected for a seamless transition to
  a live backend.
- **Current UI pattern**: The MyHealthHub home dashboard now uses rounded badge
  icons, collapsible cards, tabbed lab results, and a document vault section.
  The bottom navigation uses a five-tab layout with `Home`, `Health`,
  `Schedules`, `Vault`, and `Reports`, with pink icons by default and blue
  icons for the active tab.
- **Weather/API pattern**: `lxc-myhealthhub-shared/src/api/weather.ts` reads
  phone lat/lon and calls `WEATHER_API_BASE_URL/v1/weather/today` through the
  shared API config. If device location or backend access fails in dev, it can
  temporarily fall back to WeatherAPI.com using `WEATHER_PROVIDER_DEV_KEY`.
- **Home hero pattern**: The brand row stays in the top glass header. Weather
  city/temp stays outside that header. The greeting copy sits in a separate
  glass slab with only top corners rounded from `radii.card`; the slab grows
  behind the Family Health Space card without shifting the card.
- **iOS native setup**: the iPhone build path was verified on a physical device after fixing the CocoaPods/Xcode integration for the monorepo layout. The iOS project resolves the shared JS source from `../lxc-myhealthhub-shared`, and the workspace is the file to open in Xcode.

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

### Setup and Running the Apps

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

### Common Commands

All commands should be run from within the specific app's directory (`lxc-myhealthhub-shared` or `lxc-myrecords-dsa-xda`).

| Command | MyHealthHub (`lxc-myhealthhub-shared`) | DSA Tablet App (`lxc-myrecords-dsa-xda`) |
|---|---|---|
| **Install Dependencies** | `npm install` | `npm install` |
| **Start Metro Bundler** | `npm run start` | `npm run start` |
| **Run on Android** | `npm run android` | `npm run android` |
| **Run on iOS** | `npm run ios` | `npm run ios` (not used) |
| **Lint Code** | `npm run lint` | `npm run lint` |
| **Build Debug APK** | `npm run build:android:debug` | `cd android && ./gradlew assembleDebug` |

### Hostinger API Deployment Bundle

The Node backend is packaged from `lxc-health-api/` using:

```sh
./Executable/macos_healthapi_package.sh
```

The script writes deployable archives to:

```text
lxc-health-api/publish/
```

Use the `.tar` file for manual Hostinger upload. The accidental root-level
`publish/` folder is not used and should not exist.

### Local macOS Development Setup

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

### Project History
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
- **2026-07-25 — Hostinger weather API integration.** Added `lxc-health-api`,
  Swagger/OpenAPI docs, `/v1/health`, `/v1/weather/today`, centralized provider
  config, Hostinger packaging, and MyHealthHub home weather UI using device
  lat/lon with Dubai fallback.

### AI Assistant Guide

This repository includes a `CLAUDE.md` file containing detailed context for AI coding assistants. It covers the repository layout, the unique macOS toolchain setup, and architectural conventions. To ensure the best results when using an AI assistant, please provide it with the contents of this file.

---

### License

This project is the intellectual property of **Lexvora Consulting**. All rights
reserved. © 2024–2026 Lexvora Consulting. See [`LICENSE`](./LICENSE) for the
full terms — the native builders each carry their own copy
([`lxc-myhealthhub-ios/LICENSE`](./lxc-myhealthhub-ios/LICENSE),
[`lxc-myhealthhub-xda/LICENSE`](./lxc-myhealthhub-xda/LICENSE)). For more
information, visit [lexvoraconsulting.com](https://lexvoraconsulting.com).
