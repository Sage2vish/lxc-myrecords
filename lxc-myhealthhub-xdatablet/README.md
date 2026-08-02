<p align="center">
  <h1 align="center">🤖 MyHealthHub — Android Tablet Native Project</h1>
</p>

<p align="center">
  <strong>The Gradle builder for the MyHealthHub Android tablet shell.</strong><br/>
  No JS/TS source lives here — see <a href="../lxc-myhealthhub-shared/">lxc-myhealthhub-shared</a> for that.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/platform-Android%2010%2B-3DDC84?logo=android&logoColor=white" alt="Android 10+">
  <img src="https://img.shields.io/badge/build-Gradle-02303A?logo=gradle&logoColor=white" alt="Gradle">
  <img src="https://img.shields.io/badge/status-verified%20working-brightgreen" alt="Verified working">
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-Proprietary-red" alt="License: Proprietary"></a>
</p>

---

## 📚 Table of Contents

- [📖 Overview](#-overview)
- [🕘 History & Status](#-history--status)
- [🗺️ Current Context](#️-current-context)
- [🗺️ Device/Emulator Selection](#️-deviceemulator-selection)
- [📂 Where the App Code Lives](#-where-the-app-code-lives)
- [🚀 Building](#-building)
- [📦 APK Output](#-apk-output)

---

## 📖 Overview

This folder is the **tablet Android builder** for the MyHealthHub app. It
contains only the Gradle/native Android project — `app/`, `gradle/`,
`build.gradle`, `settings.gradle` — there is no JS/TS source here.

The app shell itself is driven from `../lxc-myhealthhub-shared/src/tablet/`
and the shared platform code stays in `../lxc-myhealthhub-shared/src/common/`.

## 🗺️ Current Context

- Weather/API work was merged into `main` on 2026-07-25
- Android release builds are split by ABI
- The tablet shell is verified working and launches from `index.tablet.js`
- The app uses the Hostinger-backed [`../lxc-databases-apis/lxc-api`](../lxc-databases-apis/lxc-api/) project for weather data
- Tablet UI source lives in `../lxc-myhealthhub-shared/src/tablet/`
- Shared API, hook, and type logic still comes from `../lxc-myhealthhub-shared/src/common/`
- `../Executable/macos_xdatabletapp_build.sh` is the preferred run path for local tablet validation

## 🕘 History & Status

This is the `android/` folder from the original `lxc-myhealthhub-mobile`
project, moved out to a sibling folder on 2026-07-21 so the native Android
build project is separated from the shared app source. Git history was
preserved as a rename.

> **Status (2026-08-02): verified working.** The tablet shell builds from the
> dedicated `lxc-myhealthhub-xdatablet` project and the local run script has
> been validated with emulator install/launch flow.

## 🗺️ Device/Emulator Selection

`../Executable/macos_xdatabletapp_build.sh` doesn't just fail when nothing's
plugged in — it lists the installed emulators (AVDs) and boots one for you:

```mermaid
flowchart TD
    A([Run macos_xdatabletapp_build.sh]) --> B{adb sees a device?}
    B -->|One| C[Build against it]
    B -->|Several| D[Prompt: pick a number]
    D --> C
    B -->|None| E[List installed AVDs]
    E --> F[Boot lowest-API AVD by default]
    F --> G[Wait for sys.boot_completed]
    G --> C
    C --> H([Install + Launch 🚀])

    classDef step fill:#E8F8EF,stroke:#17A66A,color:#0B5C36,stroke-width:1.5px
    classDef decision fill:#FFEAF4,stroke:#F41678,color:#073B86,stroke-width:1.5px
    classDef terminal fill:#3DDC84,stroke:#0B5C36,color:#0B2A1A,stroke-width:1.5px
    class C,D,E,F,G step
    class B decision
    class A,H terminal
```

## 📂 Where the App Code Lives

All screens, components, navigation, theme, and API code live in
[`../lxc-myhealthhub-shared`](../lxc-myhealthhub-shared/). This folder just
builds it for Android — `settings.gradle` and `app/build.gradle` point at
`../lxc-myhealthhub-shared/node_modules` and treat that folder as the JS
project root.

## 🚀 Building

**Fastest path** — one-shot script that loads the toolchain, auto-boots an
emulator if nothing's connected, builds, and installs+launches (see
[`../Executable/README.md`](../Executable/README.md) for details):

```bash
../Executable/macos_xdatabletapp_build.sh
```

**Or manually**, from `lxc-myhealthhub-shared` (where `package.json` lives):

| Command | What it does |
|---|---|
| `npm run android` | Build + run on emulator/device |
| `npm run build:android:debug` | `cd`'s here and runs `./gradlew assembleDebug` |
| `npm run clean:android` | `cd`'s here and runs `./gradlew clean` |

```bash
cd ../lxc-myhealthhub-shared
npm run android
```

You can also open this folder directly in Android Studio.

For a tablet-only smoke test, the build script is the canonical path:

1. It loads the Android toolchain.
2. It chooses a connected tablet or boots an emulator.
3. It builds the tablet app shell from the shared React Native source.
4. It installs and launches the tablet app automatically.

## 📦 APK Output

> ⚠️ **This project builds per-ABI split APKs, not a single universal APK.**
> There is no `app-debug.apk`.

```text
app/build/outputs/apk/debug/MyHealthHub-debug-arm64-v8a.apk   (and armeabi-v7a / x86 / x86_64)
```

`../Executable/macos_xdatabletapp_build.sh` picks the right split automatically
based on the target device's ABI (`adb shell getprop ro.product.cpu.abi`).

See [`../lxc-myhealthhub-shared/README.md`](../lxc-myhealthhub-shared/README.md)
for prerequisites, the macOS local toolchain setup, and full build/run
instructions.
