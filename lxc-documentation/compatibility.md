# Platform & Device Compatibility

This document records the current compatibility stance for the MyHealthHub
ecosystem.

## Mobile Targets

| Platform | Target / Support | Notes |
|---|---|---|
| iOS | 15 and newer | Primary design fidelity target |
| Android | 10 and newer | Main Android baseline |
| React Native | Shared app versioned by subproject | Confirm exact version in the app README |
| Node.js API | 20.x LTS recommended | Best fit for Hostinger Node deployments |

## Device Classes

| Device Class | Why It Matters |
|---|---|
| iPhone Pro / Dynamic Island devices | Verifies safe-area handling and top banner bleed |
| Standard iPhones | Confirms spacing on smaller screens |
| Pixel devices | Good baseline for Android UI behavior |
| OnePlus / OPPO devices | Useful for real-world Android OEM skin checks |
| Mid-range Android phones | Ensures cards, fonts, and scroll behavior remain readable |

## UI Compatibility Checks

The app should be checked for the following on each supported device class:

- Header and top-shell spacing
- Safe-area handling
- Glass background opacity
- Card overlap behavior
- Typography scale
- Bottom tab visibility
- Scroll smoothness

## Emulator Guidance

| Environment | Recommendation |
|---|---|
| iOS Simulator | Latest iPhone Pro profile available |
| Android Emulator | Pixel-class device with a modern API level |
| OEM Validation | At least one real OnePlus or OPPO device if available |

## Feature Compatibility

| Feature | Compatibility Notes |
|---|---|
| Weather display | Should render city and temperature clearly in all screen sizes |
| Shared top shell | Must stay visually consistent across non-Home screens |
| Appointment cards | Must remain legible on compact devices |
| Glass panels | Should not over-blur text or reduce contrast too much |

## Typography Expectations

- Avoid oversized default fonts.
- Keep title/subtitle spacing compact.
- Prefer theme tokens over one-off font values.
- Use the same scale across screens unless the design intentionally differs.

## Known Assumptions

- Phone location is expected to be available for the best experience.
- Dubai is the fallback city if location lookup or weather resolution fails.
- Home may keep a bespoke layout while the shared shell is used elsewhere.

## Related Docs

- [README](./README.md)
- [architecture](./architecture.md)
- [deployment](./deployment.md)
- [release-runbook](./release-runbook.md)
