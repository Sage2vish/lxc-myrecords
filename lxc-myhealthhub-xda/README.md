# MyHealthHub — Android Native Project

This folder is the **Android builder** for the MyHealthHub app. It contains only the
Gradle/native Android project (`app/`, `gradle/`, `build.gradle`, `settings.gradle`) —
there is no JS/TS source here.

## History

This is the `android/` folder from the original `lxc-myhealthhub-mobile` project,
moved out to a sibling folder on 2026-07-21 so the native Android build project is
separated from the shared app source. Git history was preserved as a rename.

## Where the app code lives

All screens, components, navigation, theme, and API code live in
[`../lxc-myhealthhub-shared`](../lxc-myhealthhub-shared/). This folder just builds it
for Android. `settings.gradle` and `app/build.gradle` point at
`../lxc-myhealthhub-shared/node_modules` and treat that folder as the JS project root.

## Building

Run these from `lxc-myhealthhub-shared` (where `package.json` lives), not from here:

```bash
cd ../lxc-myhealthhub-shared
npm run android              # build + run on emulator/device
npm run build:android:debug  # cd's here and runs ./gradlew assembleDebug
npm run clean:android        # cd's here and runs ./gradlew clean
```

You can also open this folder directly in Android Studio.

Debug APK output:

```text
app/build/outputs/apk/debug/app-debug.apk
```

See [`../lxc-myhealthhub-shared/README.md`](../lxc-myhealthhub-shared/README.md) for
prerequisites, the macOS local toolchain setup, and full build/run instructions.
