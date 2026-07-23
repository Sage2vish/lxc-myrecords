# Executable

One-shot build+launch scripts for **MyHealthHub** (Android + iOS). Each script
loads the required toolchain, installs missing dependencies, verifies
prerequisites, picks a target, builds, and installs+launches — no manual
multi-step setup needed. They do not apply to the DSA Tablet App
(`lxc-myrecords-dsa-xda`), which has its own build flow — see that app's README.

Both scripts are written for **bash 3.2**, macOS's stock `/bin/bash`, on
purpose — they do not use bash-4+-only features like `mapfile`/`readarray` or
`${arr[-1]}` negative indexing, since those don't exist on a default Mac and
will fail with a `command not found` error that has nothing to do with the
actual build.

## `macos_iosapp_build.sh`

```bash
./macos_iosapp_build.sh                       # iOS Simulator, default: iPhone 14
./macos_iosapp_build.sh simulator "iPhone 17" # a different named simulator
./macos_iosapp_build.sh device                # physical device, default: "Sage 14Pro"
./macos_iosapp_build.sh device "Some Other iPhone"
```

What it does, in order:
1. Preflight checks — Xcode, the toolchain loader scripts, and the repo's
   sibling folders all have to exist before anything else runs.
2. Loads the toolchain (`frameworks/android/env.sh` for Node,
   `frameworks/ios/env.sh` for Ruby/CocoaPods) and confirms `node`/`pod`
   actually resolved.
3. Installs JS deps (`npm install`) if `node_modules` is missing.
4. Installs CocoaPods deps (`pod install`) only if `Podfile.lock` and
   `Pods/Manifest.lock` have drifted.
5. Guards against a real recurring build breakage: Xcode auto-upgrading
   `project.pbxproj` sets `ENABLE_USER_SCRIPT_SANDBOXING = YES`, which makes
   CocoaPods' "[CP] Embed Pods Frameworks" script phase fail with a sandbox
   `rsync`/`unlink` denial on `hermes.framework`. The script detects this and
   forces it back to `NO` before building, every run.
6. Lists the installed simulators (or currently-visible physical devices),
   lets you pick one interactively, and builds + launches via
   `npx react-native run-ios`. For a physical device it also checks that a
   signing team is configured and fails with GUI instructions if not (that
   part genuinely can't be scripted).

## `macos_xdaapp_build.sh`

```bash
./macos_xdaapp_build.sh          # debug build
./macos_xdaapp_build.sh release  # release build (installs, does not auto-launch)
```

What it does, in order:
1. Preflight checks — the toolchain loader script and the repo's sibling
   folders have to exist.
2. Loads `frameworks/android/env.sh` (Node, JDK 17, Android SDK, Gradle) and
   confirms `node`/`java`/`adb` actually resolved.
3. Picks a target: if a device/emulator is already connected, uses it (and
   lets you choose if more than one is connected). If nothing is connected,
   lists the installed emulators (AVDs), boots one automatically (lowest API
   level by default, but shown as a numbered pick-list), and waits for it to
   finish booting before continuing.
4. Installs JS deps if `node_modules` is missing.
5. Builds the APK via Gradle (`assembleDebug`/`assembleRelease`). This
   project builds **per-ABI split APKs** (e.g. `MyHealthHub-debug-arm64-v8a.apk`),
   not a single `app-debug.apk` — the script resolves the correct split from
   the target device's actual ABI (`adb shell getprop ro.product.cpu.abi`).
6. Installs the APK via `adb install -r` and, for debug builds, launches it
   directly with `adb shell am start -n com.lxcmyhealthhub/.MainActivity`
   (not `monkey` — `monkey`'s exit code is unreliable for this and was
   tripping the script's error handling on a successful launch).

## Error messages

Both scripts fail loudly and early when something's missing, in this format:

```
✗ MISSING/BROKEN: <what>

  In plain terms:  <what this means, no jargon>
  For developers:  <the exact command/fix>
```

That's intentional — the goal is that a missing prerequisite is
self-explanatory without needing to hand the error to anyone (or anything) to
interpret.
