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

Last updated: 2026-07-25. This section exists so a new chat can pick up work
without re-discovering what's already been verified.

**Branch context:**
- Weather work was merged into `main` on 2026-07-25
- New backend project: `lxc-databases-apis/lxc-api/`
- `lxc-databases-apis/` was restructured on 2026-08-02: `lxc-api` (the API
  itself) and `lxc-apim` (a separate, new API-management/showcase codebase)
  are sibling services under `lxc-databases-apis/`, sharing one MySQL
  database via `api_*`/`apim_*` table prefixes — see the "lxc-apim" section
  below. In-progress work on `lxc-apim` lives on the `lxc-apim` branch.
- Backend deployment target: Hostinger Node app
- Mobile app should call the backend first, and the backend should proxy WeatherAPI.com
- Production WeatherAPI keys must stay in Hostinger env vars. A temporary mobile
  dev fallback key path exists for local/demo continuity only and should be
  removed or replaced by app auth before production release.
- Hostinger app domain shown during setup: `apis.lexvoraconsulting.com`
- Hostinger supported Node versions shown in hPanel: 18.x, 20.x, 22.x, 24.x.
  Use Node 20.x for this backend unless there is a specific reason to change.

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
- Xcode usage note: open `lxc-myhealthhub-ios/LxcMyHealthHub.xcworkspace`
  rather than `LxcMyHealthHub.xcodeproj`. The workspace is required because
  CocoaPods-generated targets and framework links are part of the build.
- Monorepo iOS build fixes applied:
  - `lxc-myhealthhub-ios/Podfile` now resolves Node from the pinned local
    toolchain and exports the environment CocoaPods needs.
  - `lxc-myhealthhub-ios/LxcMyHealthHub.xcodeproj/project.pbxproj` now sets the
    React Native bundle script project root correctly for
    `../lxc-myhealthhub-shared`.
  - `Executable/macos_iosapp_build.sh` now re-applies the sandbox workaround
    before each build, so Xcode upgrades do not break the CocoaPods scripts.
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
  of emoji, horizontally-scrolling quick actions). The home screen now also
  includes collapsible `Family Health Space`, `Upcoming Appointments`,
  `Lab Reports & Results`, and `Document Vault` cards with rounded badge
  artwork and tabbed lab content.
- Home weather UI is wired through `src/api/weather.ts` and displays city +
  Celsius temperature below the top glass header, outside the header glass slab,
  aligned to the right in ruby pink. Do not move weather back inside
  `glassHeader`.
- The greeting copy ("Good morning, Priya" and subtitle) lives in
  `greetingGlassSlab`, a separate glass slab below the weather row. Only the
  top corners are rounded using `radii.card`; bottom corners stay square because
  the slab is visually attached to the Family Health Space card. The slab is
  intentionally taller and extends behind the Family card without shifting the
  Family card. `greetingHeroSub` uses `colors.greetingSubGrey`.
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

**Not done yet:** no real auth/JWT storage wired up despite the dependency being
present — the login gate in `App.tsx` only tracks `isAuthenticated` in local
component state, it doesn't call a real API or persist a session. Hostinger API
request authentication for mobile callers is also not implemented yet; there is
only a placeholder `WEATHER_API_REQUEST_KEY` header path. See each app's own
README for the fuller task checklist.

**Weather work status:**
- `lxc-databases-apis/lxc-api/` is scaffolded as a Hostinger-ready Express/TypeScript API.
- Versioned routes are available under `/v1`.
- Endpoints: `GET /v1/health`, `GET /v1/weather/today`, `GET /docs`, and
  `GET /openapi.json`.
- `GET /v1/weather/today` accepts `q`, or `lat` + `lon`, and falls back to
  Dubai. Phones should pass latitude/longitude because mobile devices already
  have location.
- API/provider config lives in `lxc-databases-apis/lxc-api/src/config/apis.ts` as
  `apis.weather.weatherapi.forecastv1`.
- Runtime env vars: `PORT`, `DEFAULT_WEATHER_CITY`,
  `WEATHER_WEATHERAPI_FORECASTV1_BASE_URL`,
  `WEATHER_WEATHERAPI_FORECASTV1_API_KEY`. Hostinger automation env vars
  `HOSTINGER_API_TOKEN` and `HOSTINGER_APP_ID` exist only for later automation.
- Startup logs intentionally print a clean readiness message showing whether
  required weather env vars are set, without printing secret values.
- A WeatherAPI.com call was manually verified for Dubai on 2026-07-25 and
  returned valid current weather. Keep the raw provider response standard in
  `lxc-databases-apis/lxc-api/README.md`.
- Deployment bundles are generated by `Executable/macos_healthapi_package.sh`
  into `lxc-databases-apis/lxc-api/publish/lxc-api-YYYY-MM-DD-HHMM.tar`. Do not use
  or recreate a root-level `publish/` folder.

**`lxc-apim` status (started 2026-08-02, on the `lxc-apim` branch):**
- `lxc-databases-apis/lxc-apim/` is a **separate codebase** from `lxc-api` —
  not shared code, not a shared package. It's the API management/showcase
  layer: catalogs the APIs LXC builds, owns admin users/roles/tokens, and
  will serve a themed showcase UI. `lxc-api` stays the actual API that serves
  requests; `lxc-apim` doesn't sit in the traffic path (no gateway/proxy
  behavior — out of scope by design).
- Stack mirrors `lxc-api`: Node.js + Express (`^4`, pinned to match `lxc-api`)
  + TypeScript + `tsx`, plus `mysql2`, `jsonwebtoken`, `bcrypt`, `zod`, `cors`,
  `ejs` (server-rendered showcase views — no separate SPA build pipeline),
  `swagger-ui-express`.
- Auth model: a **product-aware** auth API — login/authorization takes "which
  product/service" as an input rather than being hardcoded to one app, so
  MyHealthHub, the DSA app, and `lxc-apim` itself could all eventually
  authenticate through the same mechanism, each scoped to their own product.
  Product scoping lives on `apim_tokens.product_id`, not on `apim_user_roles`
  (roles are global to the apim admin surface).
- Deploys as a **single Node.js app** on Hostinger at
  `apim.lexvoraconsulting.com` (same Express/Node-app preset as `lxc-api`),
  serving both the admin/catalog API and the showcase UI's static build from
  one Express process — not split across Hostinger's separate static-website
  hosting product.
- Swagger `/docs` is planned as **multi-spec**: `swagger-ui-express`'s `urls`
  array, generated from the `apim_products` table rather than hardcoded, so
  it shows a dropdown across every registered LXC API (starting with
  `lxc-api`), not just `lxc-apim`'s own endpoints.
- **UI theme reversed course (2026-08-02):** an earlier pass matched
  `lexvoraconsulting_web`'s dark-navy/gold brand theme; that was explicitly
  overturned — `lxc-apim` now uses its **own** distinct palette (indigo
  `#6366f1`/`#818cf8` accent, slate `#0f172a`/`#f8fafc` neutrals, clean
  system sans-serif), styled like a dev/admin tool rather than matching the
  marketing site. Tokens in `public/css/theme.css`. Don't reintroduce the
  gold/navy/Georgia/Montserrat lexvora theme here without being asked.
- Database: `lxc-databases-apis/lxc-databases/api-apimgmt-db/` holds **only
  `.sql` files** (`migrations/0001`–`0005`, `seeds/0001`–`0002`) — no code,
  no `package.json`, no `node_modules`. By explicit instruction, that folder
  is pure data; the scripts that actually run those `.sql` files
  (`migrate.mjs`, `seed.mjs`, `seed-admin.mjs`) are real app code and live in
  **`lxc-apim/scripts/`** instead, run via `npm run db:migrate` /
  `npm run db:seed` / `npm run db:seed:admin` from inside `lxc-apim`. (An
  earlier pass put the runner scripts, `package.json`, and `node_modules`
  inside `api-apimgmt-db` itself — that was wrong and has been corrected;
  don't reintroduce code there.) Schema (`apim_products`, `apim_users`,
  `apim_roles`, `apim_user_roles`, `apim_tokens`, `apim_audit_log`) is
  defined, but **has not been run against the live Hostinger database
  yet** — that needs the real `MYSQL_PASSWORD` and an explicit go-ahead,
  deliberately not done automatically.
- **Node version: pinned to 24.18.0, not the repo-wide 20.x convention.**
  The locally pinned toolchain at `frameworks/node/` only has Node
  `24.18.0` installed — there is no 20.x there despite `lxc-api`'s `.nvmrc`
  and this file's general "use Node 20.x" guidance assuming one exists.
  `lxc-apim` uses `bcrypt`, which compiles a native binary tied to the Node
  ABI it's built under, so its `.nvmrc`/`package.json engines` are
  deliberately pinned to `24.18.0` to match what's actually installed and
  what it was actually built against (Hostinger does support 24.x, so this
  is a valid deploy target too — not just a local workaround). `lxc-api`
  has no native dependencies, so its 20.x pin is unaffected and unchanged.
  If a real Node 20.x ever gets installed into `frameworks/node/`, this
  pin can be revisited, but don't assume 20.x is available there without
  checking first.
- **Phase 0/1 done and verified**, and **Phase 4 (browser UI) is now
  substantially built**, not just a first-cut catalog page:
  - Pages: `/login`, `POST /logout`, `/dashboard` (landing after login),
    `/catalog` (its own page, separate from dashboard, env-aware URLs — see
    below), `/change-password` (admin-only), `/users/new` (create additional
    accounts). Root `/` redirects to `/dashboard` if logged in, else
    `/login`.
  - Session = a JWT issued on login and stored in an httpOnly cookie
    (`src/middleware/auth.ts`) — the same auth core intended for the future
    `/v1/auth/login` API, just a different transport (cookie vs.
    `Authorization` header) for the browser UI vs. programmatic clients.
  - **Two bootstrap accounts** (`scripts/seed-admin.mjs`, now create-once —
    uses a SELECT-then-INSERT guard, never overwrites `password_hash`/
    `is_active` on repeat idempotent runs, which is important since this
    script runs on every dev startup):
    - `admin` / `admin@1234` (default) — has a **DB-down code-level
      fallback** (`src/services/authService.ts`): a literal hardcoded check
      that logs `admin` in even if the MySQL query itself throws, so
      health-check/diagnostics stay reachable during a DB outage. Forced to
      `/change-password` on first login while the DB is reachable and still
      on the default password.
    - `superadmin` / `superadmin@#$1234` (fixed, the app never changes it) —
      DB-row only, no DB-down fallback. Auto-disabled
      (`apim_users.is_active = 0`) the instant admin's password changes away
      from the default; re-enable by flipping that flag directly in MySQL.
    - Both are **temporary, explicitly-requested dev backdoors** (2026-08-02,
      no public deployment yet) — must be revisited before `lxc-apim` is
      exposed anywhere real, especially the DB-down bypass, which doesn't
      depend on the database at all.
  - A session logged in via the DB-down fallback is marked "degraded": a
    site-wide banner shows, and `/catalog`, `/change-password`, `/users/new`
    all refuse to operate (503, clear message) rather than crashing.
  - `APIM_ENV` (`local` | `production`, `src/config/env.ts`) controls the
    catalog's displayed URLs: `local` (the dev default) overrides each
    product to its localhost equivalent (`src/config/localUrls.ts`:
    `lxc-api` → `:3000`, `lxc-apim` → `:3100`) instead of the DB-seeded
    production URL. The eventual Build to Publish flow will set this to
    `production`.
  - Verified locally against a deliberately-bad DB host: unauthenticated `/`
    redirects to `/login`; wrong credentials with DB down → 401; the
    `admin`/`admin@1234` backdoor pair with DB down → succeeds, degraded,
    dashboard shows the banner; `/catalog`, `/change-password`, `/users/new`
    all correctly return 503 while degraded; logout clears the session and
    redirects to `/login`.
  - **Deferred, still queued:** surfacing each API's Swagger endpoint list
    directly on its catalog card; role/authorization middleware to actually
    gate who can reach `/users/new` (today any authenticated session can,
    since only `admin`/`superadmin` exist); the `/v1/auth/login` JSON API
    itself for programmatic clients.
  - Live task tracker: `lxc-databases-apis/lxc-apim/README.md`.
- **Run it locally against the real remote database:**
  `Executable/macos_apim_run.sh` is a separate script (not merged into
  `macos_healthapi_package.sh`, which stays `lxc-api`-only) with a 5-option
  interactive menu:
  - **1) First Time** and **2) Regular** — identical underlying sequence,
    only messaging differs. Neither ever asks a question. Both require
    `lxc-apim/.env` to already exist (fail with a pointer to option 3 if
    not); otherwise: load the toolchain, `npm install` if needed, run
    `db:migrate` + `db:seed` + `db:seed:admin` on every invocation
    (idempotent, doubles as an "is everything actually in place" check, with
    a visible ✓ line per step), **best-effort start `lxc-api` too**
    (`start_lxc_api_if_possible` — skipped with a clear message if
    `lxc-api/.env` isn't set up; that needs its own separate secret, a real
    WeatherAPI.com key, which this script doesn't manage), start `npm run
    dev` for `lxc-apim`, run an **explicit health check** against
    `http://localhost:3100/v1/health`, then open the browser. Ctrl+C stops
    both servers (apim tracked via `$server_pid`, api via
    `$API_SERVER_PID`) and returns to the menu.
  - **3) Custom Run/Test Local (Dev APIM — Remote DB)** — the interactive
    path: prompts for MySQL user/password (hidden input, defaults to
    whatever's already in `.env`), writes/overwrites `lxc-apim/.env`
    (gitignored, never committed, never hardcoded in the script itself,
    includes `APIM_ENV=local`), then runs the same database + lxc-api +
    server + health-check sequence as 1/2.
  - **4) Make Build to Publish (PROD APIM — local DB)** — placeholder, just
    re-shows the menu. Not built yet.
  - **q) Quit**

  This script is meant to be run directly by the user in their own
  terminal, not executed on their behalf by an AI assistant, since option 3
  prompts for a real secret. The real Hostinger MySQL password (once
  supplied by the user) lives only in `lxc-apim/.env` — never in this
  script, never committed.
- **Caution:** during this build, files started appearing in
  `api-apimgmt-db/migrations/` that weren't written by the assisting session
  — two conflicting schema designs landed concurrently (different column
  sets for the same tables), plus a whole runner-scripts/package.json/
  node_modules tree that shouldn't have been there at all (see the Database
  bullet above). This was reconciled, but if another Claude Code session or
  agent is/was also working on this same repo, coordinate before both sides
  keep editing the same files.

**Where to start next:** likely Hostinger deployment verification for
`lxc-api`, then real API request auth for the mobile app, then wiring
`LoginScreen`'s mock OTP submit to an actual `POST /auth/login` and
persisting the session via `react-native-keychain` — or, on the `lxc-apim`
branch, continuing `lxc-apim`'s Phase 2/3 (the `/v1/auth/login` JSON API,
role/authorization middleware, admin/catalog CRUD API) and Phase 5
(multi-spec Swagger).

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
  The visible bottom tabs now use a five-tab layout: `Home`, `Health`,
  `Schedules`, `Vault`, and `Reports`. Pink image icons are used by default and
  blue image icons for the active tab. The shared slider uses the
  `radii.slider` token.
- `screens/` — one file per screen (Home, Records, Schedules, Prescriptions,
  Vitals, Profile, ScheduleVisit, Login, Notifications). Screens compose shared
  components rather than defining their own primitives. `LoginScreen.tsx` is a
  mobile+OTP mock flow (no real backend) plus biometric login.
  `HomeScreen.tsx` currently contains the main dashboard: `Family Health Space`,
  `Upcoming Appointments`, `Lab Reports & Results`, `Document Vault`, support,
  DSA setup, and privacy cards.
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
- `assets/` — now includes the current badge/icon artwork used by the dashboard
  and the bottom navigation (family, appointment, schedule, lab, document vault,
  home, health, reports, vault).

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
