# MyHealthHub — iOS Native Project

This folder is the **iOS builder** for the MyHealthHub app. It contains only the
Xcode project and CocoaPods config (`LxcMyHealthHub.xcodeproj`,
`LxcMyHealthHub.xcworkspace`, `Podfile`) — there is no JS/TS source here.

## History

This is the `ios/` folder from the original `lxc-myhealthhub-mobile` project, moved
out to a sibling folder on 2026-07-21 so the native iOS build project is separated
from the shared app source. Git history was preserved as a rename.

**Status (2026-07-23): verified working.** Builds and launches successfully on
both the iOS Simulator and a physical device via `npx react-native run-ios`.

**Known gotcha:** Xcode auto-upgrading `project.pbxproj` (e.g. after opening it
in a newer Xcode version) sets `ENABLE_USER_SCRIPT_SANDBOXING = YES`, which
breaks CocoaPods' "[CP] Embed Pods Frameworks" build phase with a sandbox
`rsync`/`unlink` denial on `hermes.framework`. If a build suddenly fails there,
set `ENABLE_USER_SCRIPT_SANDBOXING` back to `NO` for both Debug and Release in
this project's build settings.
`../Executable/macos_iosapp_build.sh` checks and re-applies this fix
automatically on every run.

## Where the app code lives

All screens, components, navigation, theme, and API code live in
[`../lxc-myhealthhub-shared`](../lxc-myhealthhub-shared/). This folder just builds it
for iOS. The `Podfile` points at `../lxc-myhealthhub-shared` as the JS project root
and `node_modules` location.

## Building

Fastest path — one-shot script that loads the toolchain, installs deps, and
builds+launches for you (see `../Executable/macos_iosapp_build.sh` for details):

```bash
../Executable/macos_iosapp_build.sh              # simulator (default: iPhone 14)
../Executable/macos_iosapp_build.sh device        # physical device
```

Or manually, from `lxc-myhealthhub-shared` (where `package.json` lives):

```bash
cd ../lxc-myhealthhub-shared
npm run pod:install   # cd's here and runs `pod install`
npm run ios           # build + run on simulator/device
```

You can also open `LxcMyHealthHub.xcworkspace` (not the `.xcodeproj`) directly in
Xcode after running `pod install`.

See [`../lxc-myhealthhub-shared/README.md`](../lxc-myhealthhub-shared/README.md) for
prerequisites and full build/run instructions.
