# iPadOS Device Enablement TODO

## Complete

- [x] Created a dedicated top-level iPadOS native builder.
- [x] Reused `../lxc-myhealthhub-shared` for all React Native source and assets.
- [x] Configured the target for iPad only (`TARGETED_DEVICE_FAMILY = 2`).
- [x] Added a unique native bundle identifier: `com.lxcmyhealthhub.ipados`.
- [x] Added macOS build and release executable scripts.
- [x] Identified the physical validation device: Kiara iPad Air 4, iPadOS 26.5.

## Next

- [x] Ran `../Executable/macos_ipadosapp_build.sh device` against the connected iPad; CocoaPods and the React Native iPadOS build path completed successfully.
- [ ] Confirm the Apple signing team for `com.lxcmyhealthhub.ipados` in Xcode.
- [ ] Create iPad-specific app icon and launch-screen artwork.
- [ ] Add iPad layout refinements to shared React Native screens where a larger canvas needs a dedicated layout.
- [ ] Verify portrait and landscape flows on physical hardware and the iPad simulator matrix.
- [ ] Produce and validate a signed release archive.
