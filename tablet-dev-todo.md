# Tablet Dev TODO

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
- Audit current shared source to separate common vs mobile-only vs tablet-only code.
- Identify screens that need tablet-specific layouts.
- Create the `mobile` and `tablet` folder structure under shared.
- Wire the iPadOS app and Android tablet app to the correct shared entry path.
- Validate builds after the split to make sure both platforms still run.
- Recreate the tablet home screen first, then work through the rest of the tablet-specific screens.
- Define the image generation list needed for the tablet home screen, including banners, icons, and supporting artwork.
- Map the time-of-day design states before implementing the dynamic home screen variants.
- Define the mobile and tablet entry files before moving any screens.
- Verify the iPhone bundle does not import anything from the tablet tree.

## Open Decisions
- Decide which screens are fully shared and which need tablet-specific presentation.
- Decide whether tablet-only assets should live beside tablet screens or in a dedicated assets folder.
- Decide the naming pattern for any tablet-specific component files.
- Decide whether the time-of-day home screen variants should be driven by local time, user preference, or backend config.
- Decide which parts of the tablet home screen should remain visually identical across morning, afternoon, evening, and night.
- Decide whether the tablet app should ship with generated placeholder artwork first or wait for final assets.
- Decide whether the mobile entry file should be named `index.mobile.tsx` or follow the current project naming style.
- Decide whether the tablet entry file should be named `index.tablet.tsx` or follow the current project naming style.
