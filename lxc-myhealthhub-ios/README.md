# MyHealthHub — iOS Native Project

This folder is the **iOS builder** for the MyHealthHub app. It contains only the
Xcode project and CocoaPods config (`LxcMyHealthHub.xcodeproj`,
`LxcMyHealthHub.xcworkspace`, `Podfile`) — there is no JS/TS source here.

## History

This is the `ios/` folder from the original `lxc-myhealthhub-mobile` project, moved
out to a sibling folder on 2026-07-21 so the native iOS build project is separated
from the shared app source. Git history was preserved as a rename. As of the move,
this folder exists but a real device/simulator run has not yet been verified —
building for Android was the initial focus.

## Where the app code lives

All screens, components, navigation, theme, and API code live in
[`../lxc-myhealthhub-shared`](../lxc-myhealthhub-shared/). This folder just builds it
for iOS. The `Podfile` points at `../lxc-myhealthhub-shared` as the JS project root
and `node_modules` location.

## Building

Run these from `lxc-myhealthhub-shared` (where `package.json` lives), not from here:

```bash
cd ../lxc-myhealthhub-shared
npm run pod:install   # cd's here and runs `pod install`
npm run ios           # build + run on simulator/device
```

You can also open `LxcMyHealthHub.xcworkspace` (not the `.xcodeproj`) directly in
Xcode after running `pod install`.

See [`../lxc-myhealthhub-shared/README.md`](../lxc-myhealthhub-shared/README.md) for
prerequisites and full build/run instructions.
