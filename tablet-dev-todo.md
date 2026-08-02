# Tablet Dev TODO

_Last updated: 2026-08-02 on `lxc-tablet-app-dev`._

## Goals
- Keep `lxc-myhealthhub-shared` as the single shared source of truth.
- Split tablet-specific UI from mobile-specific UI without duplicating business logic.
- Support iPadOS and Android tablet with the same architecture pattern.
- Use the attached tablet home screen as the visual direction for the tablet app shell.
- Keep the iPhone app fully separate from tablet-only UI.

## Proposed Structure
- Keep shared logic in `lxc-myhealthhub-shared/src/common`.
- Add mobile-only UI in `lxc-myhealthhub-shared/src/mobile`.
- Add tablet-only UI in `lxc-myhealthhub-shared/src/tablet`.
- Use shared models, services, hooks, and utilities from `common` in both platforms.
- Keep the tablet home screen layout, navigation shell, and visual composition in the tablet layer.
- Use separate entry points for mobile and tablet so each bundle only loads its own platform UI.

## File and Folder Split
- Move reusable API, state, and data logic into `common`.
- Put phone-specific screens, components, and assets into `mobile`.
- Put tablet-specific screens, components, and assets into `tablet`.
- Keep platform-specific screen layouts separate when the presentation differs.
- Keep logo and core brand assets consistent unless a tablet-specific treatment is required.
- Avoid importing tablet screens from mobile code paths.
- Allow tablet code to reuse `common` components, but not mobile-only layouts.

## Screen Strategy
- Treat screens with the same user intent as one product screen.
- Allow different mobile and tablet implementations for the same screen.
- Reuse shared subcomponents only when their rendering and behavior are truly identical.
- Give tablet layouts room for tables, wider spacing, and multi-column views.
- Use the tablet home screen as the default reference for spacing, card composition, and sidebar layout.
- Add time-of-day behavior so the tablet home screen can change based on morning, afternoon, evening, and night.
- Keep the background, hero area, and top banner responsive to the selected time period.
- Keep mobile screen layouts compact and phone-first even when the same data is shown.
- Treat tablet differences as presentation changes over the same shared data model.

## App-Specific Direction
- Keep the existing iPadOS native app folder as a separate native shell.
- Create a separate Android tablet app folder when ready, similar to the iPadOS setup.
- Keep the shared React Native source compatible with both shells.
- Keep tablet-specific assets available for the home screen, including banners, illustrations, and any tablet-only decorative images.
- Decide which assets can stay shared and which need tablet-only versions.
- Point the iPhone app to the mobile entry path only.
- Point the tablet app to the tablet entry path only.

## Next Implementation Steps

### High Priority
- [x] Audit current shared source to separate common vs mobile-only vs tablet-only code.
- [x] Identify the home screen as the first tablet-specific layout.
- [x] Create the `mobile` and `tablet` folder structure under shared.
- [x] Wire the iPadOS app to the tablet entry path while preserving the mobile entry path.
- [x] Define separate mobile (`index.js`) and tablet (`index.tablet.js`) entry files.
- [x] Add an initial tablet-only home screen with a sidebar and wide dashboard layout.
- [x] Reuse the existing four time-period hero themes for the tablet home banner.
- [x] Confirm the iPhone entry path imports the mobile root only.
- [x] Add the first tracked tablet development branch and start the split work on GitHub.
- [x] Fix the iPadOS Podfile post-install hook so shell phases do not crash when output arrays are nil.
- [x] Validate the iPadOS simulator launch end-to-end.
  - [x] Run `Executable/macos_ipadosapp_build.sh` with the default simulator path.
  - [x] Confirm CocoaPods completes without the post-install hook crashing.
  - [x] Confirm the app launches from `index.tablet.js`.
  - [x] Verify the visible first screen is the tablet home shell, not the phone shell.
- [x] Validate the iPhone build still points at the mobile entry path.
  - [x] Confirm `index.js` continues to register `src/mobile/MobileApp`.
  - [x] Confirm the phone bundle does not import tablet-only screens.
  - [x] Confirm the iOS project still runs with the existing mobile navigation tree.
- [x] Replace placeholder tablet navigation with real section routing.
  - [x] Connect Home to the current dashboard.
  - [x] Add Health as a dedicated tablet view.
  - [x] Add Schedules as a dedicated tablet view.
  - [x] Add Vault as a dedicated tablet view.
  - [x] Add Reports as a dedicated tablet view.
- [x] Turn the compact cards on the tablet home screen into real drill-down surfaces.
  - [x] Make upcoming appointments open the appointment detail flow.
  - [x] Make lab report cards open a report summary surface.
  - [x] Make document vault cards open a storage/detail surface.
  - [x] Make the family cards open a profile or member detail surface.

### Medium Priority
- [x] Move reusable API, client, hook, and type code into `src/common` with compatibility re-exports.
  - [x] Move API client configuration first.
  - [x] Move weather fetch logic next.
  - [x] Move health service and hook logic.
  - [x] Move shared health types.
  - [x] Update imports in mobile and tablet code after each move.
  - [x] Keep re-export shims in place until the migration is stable.
- [x] Define the image generation list for tablet banners, supporting art, and empty states.
  - [x] Tablet hero banners for morning, afternoon, evening, and night.
  - [x] Tablet-wide support art for the empty appointment, report, and vault surfaces.
  - [x] Section icon badges for the sidebar, cards, and top actions.
  - [x] Illustration assets for empty data states and low-activity states.
  - [x] Background treatment assets for the hero card and the detail surface.
  - [x] Mark which assets can be reused from the phone app.
  - [x] Mark which assets need tablet-only variants.
  - [x] Decide whether generated assets should ship as temporary placeholders or final art.
- [x] Add responsive behavior for the four hero dayparts.
  - [x] Morning layout should feel light and fresh.
  - [x] Afternoon layout should keep the hero readable under bright content.
  - [x] Evening layout should darken the banner without losing contrast.
  - [x] Night layout should lean into the most dramatic treatment.
  - [x] Keep the sidebar and card grid stable while only the hero treatment changes.
- [x] Shape the tablet-specific UI components into reusable building blocks.
  - [x] Extract a shared section header for card groups.
  - [x] Extract a reusable metric card component.
  - [x] Extract a reusable appointment row component.
  - [x] Extract a reusable profile chip/avatar component.

### Low Priority
- [x] Create the Android tablet native shell (`lxc-myhealthhub-xdatablet`).
  - [x] Mirror the iPadOS entry strategy with a tablet-specific entry file.
  - [x] Reuse the same shared source and tablet route split.
  - [x] Confirm the Android tablet shell only loads tablet UI.
- [x] Add release-archive verification after simulator validation stabilizes.
  - [x] Generate an iPadOS archive from the same code path.
  - [x] Confirm the release bundle still resolves the tablet entry file.
  - [x] Confirm signing and archive settings are clean.
- [x] Tighten visual polish on the tablet home screen.
  - [x] Match spacing and outer edge alignment to the supplied mock.
  - [x] Keep the right alignment of summary values consistent.
  - [x] Keep the top of the API/detail areas pinned without drifting.
  - [x] Keep the color palette and card rhythm consistent with the brand.

## Progress Snapshot
- Completed: 21 of 21 top-level tasks, including tablet branch setup, mobile/tablet entry split, iPadOS tablet entry wiring, initial tablet home shell, time-of-day hero reuse, the Podfile hook fix needed for CocoaPods on Xcode 26, the iPhone build validation, the tablet routing model, the tablet drill-down surfaces, the shared-code migration, the image-generation inventory, the responsive daypart refinement, the reusable tablet component extraction, the Android tablet shell, the iPadOS simulator launch, the release archive verification, and the final tablet home visual polish pass.
- In progress: none.
- Pending: none.

## Verification Log
- `2026-08-02`: `Executable/macos_ipadosapp_build.sh` reached CocoaPods integration and failed only in the iPadOS Podfile post-install hook before the patch.
- `2026-08-02`: Updated the Podfile guard so nil shell-script output arrays cannot crash the post-install hook.
- `2026-08-02`: `Executable/macos_ipadosapp_build.sh` completed the build and launched `com.lxcmyhealthhub.ipados` on `iPad (A16)` successfully.
- `2026-08-02`: `Executable/macos_iosapp_build.sh` completed the build and launched `com.lxcmyhealthhub` on `iPhone 14` successfully.
- `2026-08-02`: Rehomed the shared API/client/hook/type surface into `src/common` and kept compatibility shims in the old paths.
- `2026-08-02`: Added the time-of-day tablet hero text, tint, and copy treatment so the shell changes by morning/afternoon/evening/night.
- `2026-08-02`: Extracted reusable tablet section header, stat card, and detail panel components and verified the shell still launches.
- `2026-08-02`: Created the `lxc-myhealthhub-xdatablet` Android tablet shell and confirmed `./gradlew assembleDebug` succeeds in the new project.
- `2026-08-02`: Patched Hermes release extraction to use `execFileSync('tar', ...)` so the archive step works with the workspace path that contains a space.
- `2026-08-02`: Tightened the tablet home and section layouts so they size naturally instead of relying on a fixed desktop width.
- `2026-08-02`: Verified the iPadOS release archive completes successfully after moving the Hermes helper into tracked repo code.

## Open Decisions
- Decide which screens are fully shared and which need tablet-specific presentation.
- Decide whether tablet-only assets should live beside tablet screens or in a dedicated assets folder.
- Decide the naming pattern for any tablet-specific component files.
- Decide whether the time-of-day home screen variants should be driven by local time, user preference, or backend config.
- Decide which parts of the tablet home screen should remain visually identical across morning, afternoon, evening, and night.
- Decide whether the tablet app should ship with generated placeholder artwork first or wait for final assets.
- Decide whether the mobile entry file should be named `index.mobile.tsx` or follow the current project naming style.
- Decide whether the tablet entry file should be named `index.tablet.tsx` or follow the current project naming style.
