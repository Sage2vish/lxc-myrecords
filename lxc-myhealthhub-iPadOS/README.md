# MyHealthHub iPadOS Native Project

`lxc-myhealthhub-iPadOS` is the iPad-only Xcode and CocoaPods builder for MyHealthHub. It contains native platform configuration only; all React Native screens, API clients, theme, and assets remain in [`../lxc-myhealthhub-shared`](../lxc-myhealthhub-shared).

## Architecture

```text
lxc-myhealthhub-shared/  # shared React Native application source
lxc-myhealthhub-ios/     # iPhone/iOS native builder
lxc-myhealthhub-iPadOS/  # this iPad-only native builder
Executable/              # repeatable macOS build and release scripts
```

The iPad target uses bundle identifier `com.lxcmyhealthhub.ipados`, supports iPad only (`TARGETED_DEVICE_FAMILY = 2`), requires iPadOS 15.1 or newer, and does not enable Mac Catalyst.

## Connected Validation Device

- Name: `Kiara iPad Air 4`
- Xcode hardware model: iPad (10th generation), `iPad13,18`
- iPadOS: `26.5`
- Device identifier: `00008101-001E70E60CE3001E`

## Build

From the repository root:

```bash
./Executable/macos_ipadosapp_build.sh
```

The script opens a menu: option `1` installs on a connected iPad, option `2`
uses the default `iPad (A16)` simulator, and option `3` lists compatible iPad
simulators. Pressing Enter selects option `2`.

Open `LxcMyHealthHubiPadOS.xcworkspace`, not the `.xcodeproj`, when working in Xcode.

## Release Archive

```bash
./Executable/macos_ipadosapp_release_build.sh
```

The archive is written under `lxc-myhealthhub-iPadOS/build/archive/`. The Xcode project already includes the Apple signing team needed for device and archive builds, so the release script can run without extra project setup.

See [TODO.md](./TODO.md) for the active enablement checklist.
