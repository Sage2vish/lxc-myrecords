#!/bin/bash
# ============================================================================
# FILE        : macos_iosapp_build.sh
# PROJECT     : LXC-Health
# AUTHOR      : Vishal Kumar
# UPDATED BY  : Vishal Kumar
# VERSION     : 1.0.0
# DATE-TIME   : 23-July-2026 | 20:39 Hrs
#
# PURPOSE     : One-shot build+launch script for MyHealthHub (iOS). Loads the
#               local macOS toolchain, installs JS/CocoaPods dependencies,
#               guards against Xcode's ENABLE_USER_SCRIPT_SANDBOXING build
#               regression, and builds+runs on a chosen iOS Simulator or
#               physical device. See Executable/README.md for full details.
# ============================================================================
#
# macos_iosapp_build.sh — build + launch MyHealthHub (iOS)
#
# Usage:
#   ./macos_iosapp_build.sh                      # run on simulator "iPhone 14" (lowest-tier default)
#   ./macos_iosapp_build.sh simulator "iPhone 17" # run on a different named simulator
#   ./macos_iosapp_build.sh device                # run on the physical device "Sage 14Pro"
#   ./macos_iosapp_build.sh device "Some Other iPhone"
#
# If anything required is missing (Xcode, the shared toolchain, a folder, a
# named simulator/device, signing setup...) this script stops immediately and
# prints what's missing in plain language plus the exact developer fix — no
# guessing, no need to hand the error to anyone/anything to interpret.
#
# Sequence this script runs, in order:
#   1. Preflight checks — confirm Xcode and the repo folders this script
#      depends on actually exist before doing anything else.
#   2. Load the project-independent macOS toolchains (Node via frameworks/android/env.sh,
#      Ruby/CocoaPods via frameworks/ios/env.sh) — see repo CLAUDE.md — and confirm
#      `node` and `pod` actually resolved afterward.
#   3. Install JS dependencies in lxc-myhealthhub-shared if node_modules is missing.
#   4. Install CocoaPods dependencies in lxc-myhealthhub-ios, but only if Podfile.lock
#      and Pods/Manifest.lock have drifted (skips the slow `pod install` otherwise).
#   5. Guard against Xcode re-enabling ENABLE_USER_SCRIPT_SANDBOXING on project open —
#      this breaks CocoaPods' "[CP] Embed Pods Frameworks" script with a sandbox
#      rsync/unlink denial on hermes.framework. Force it back to NO if present.
#   6. Confirm the target simulator/device actually exists (and, for a physical
#      device, that the project has a signing team set), then build and launch.

set -euo pipefail

FRAMEWORKS_ROOT="/Users/SageVish/Documents/Development Work/frameworks"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SHARED_DIR="$REPO_ROOT/lxc-myhealthhub-shared"
IOS_DIR="$REPO_ROOT/lxc-myhealthhub-ios"
PBXPROJ="$IOS_DIR/LxcMyHealthHub.xcodeproj/project.pbxproj"

TARGET="${1:-simulator}"                 # simulator | device
NAME="${2:-}"                            # optional simulator/device name override
DEFAULT_SIMULATOR="iPhone 14"
DEFAULT_DEVICE="Sage 14Pro"

# fail TITLE "plain-language explanation" "exact developer fix"
fail() {
  echo ""
  echo "✗ MISSING/BROKEN: $1"
  echo ""
  echo "  In plain terms:  $2"
  echo "  For developers:  $3"
  echo ""
  exit 1
}

echo "==> [1/6] Preflight checks"

if ! xcodebuild -version >/dev/null 2>&1; then
  fail "Xcode" \
    "This Mac doesn't have Xcode set up, and Xcode is required to build and run iOS apps." \
    "Install Xcode from the App Store, then run: sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer && sudo xcodebuild -license accept"
fi

if [ ! -f "$FRAMEWORKS_ROOT/android/env.sh" ]; then
  fail "Node toolchain script" \
    "The shared build tools this project needs (Node.js) aren't set up on this Mac yet." \
    "Expected file not found: $FRAMEWORKS_ROOT/android/env.sh — set up the frameworks/ directory per this repo's macOS toolchain docs (CLAUDE.md), or edit FRAMEWORKS_ROOT at the top of this script to point at your own toolchain."
fi

if [ ! -f "$FRAMEWORKS_ROOT/ios/env.sh" ]; then
  fail "iOS toolchain script (Ruby/CocoaPods)" \
    "The shared build tools this project needs (Ruby + CocoaPods) aren't set up on this Mac yet." \
    "Expected file not found: $FRAMEWORKS_ROOT/ios/env.sh — set up the frameworks/ios directory (Ruby + CocoaPods gems), or edit FRAMEWORKS_ROOT at the top of this script."
fi

if [ ! -f "$SHARED_DIR/package.json" ]; then
  fail "lxc-myhealthhub-shared folder" \
    "The app's source code folder is missing or this script is in the wrong place." \
    "Expected file not found: $SHARED_DIR/package.json — this script must live in an Executable/ folder that is a sibling of lxc-myhealthhub-shared in the repo."
fi

if [ ! -f "$IOS_DIR/Podfile" ]; then
  fail "lxc-myhealthhub-ios folder" \
    "The native iOS project folder is missing or this script is in the wrong place." \
    "Expected file not found: $IOS_DIR/Podfile — this script must live in an Executable/ folder that is a sibling of lxc-myhealthhub-ios in the repo."
fi
echo "    OK"

echo "==> [2/6] Loading toolchains"
source "$FRAMEWORKS_ROOT/android/env.sh"   # provides Node
source "$FRAMEWORKS_ROOT/ios/env.sh"       # provides Ruby + CocoaPods

if ! command -v node >/dev/null 2>&1; then
  fail "node" \
    "Node.js didn't load correctly, so nothing after this point can run." \
    "NODE_HOME in $FRAMEWORKS_ROOT/android/env.sh doesn't point at a working Node install — check that path exists and contains bin/node."
fi

if ! command -v pod >/dev/null 2>&1; then
  fail "CocoaPods (pod)" \
    "The tool that installs this iOS app's native dependencies isn't available." \
    "GEM_HOME/RUBY_HOME in $FRAMEWORKS_ROOT/ios/env.sh don't point at a working CocoaPods install — check that path exists and contains bin/pod, or reinstall with: gem install cocoapods"
fi

echo "==> [3/6] Installing JS dependencies (lxc-myhealthhub-shared)"
cd "$SHARED_DIR"
if [ ! -d node_modules ]; then
  npm install
else
  echo "    node_modules already present, skipping npm install"
fi

echo "==> [4/6] Checking CocoaPods dependencies (lxc-myhealthhub-ios)"
cd "$IOS_DIR"
if [ -f Podfile.lock ] && [ -f Pods/Manifest.lock ] && diff -q Podfile.lock Pods/Manifest.lock >/dev/null 2>&1; then
  echo "    Pods already up to date, skipping pod install"
else
  pod install
fi

echo "==> [5/6] Verifying build-sandbox setting stayed disabled"
if grep -q "ENABLE_USER_SCRIPT_SANDBOXING = YES;" "$PBXPROJ"; then
  echo "    Xcode re-enabled ENABLE_USER_SCRIPT_SANDBOXING (breaks Pods embed script) — forcing back to NO"
  sed -i '' 's/ENABLE_USER_SCRIPT_SANDBOXING = YES;/ENABLE_USER_SCRIPT_SANDBOXING = NO;/g' "$PBXPROJ"
else
  echo "    OK"
fi

echo "==> [6/6] Choosing a target and launching"
cd "$SHARED_DIR"

if [ "$TARGET" = "device" ]; then
  echo "    Physical devices this Mac can currently see:"
  DEVICE_LINES=()
  while IFS= read -r line; do
    [ -n "$line" ] && DEVICE_LINES+=("$line")
  done < <(xcrun xctrace list devices 2>/dev/null | awk '/^== Devices ==/{f=1;next} /^==/{f=0} f && NF {print}')

  if [ ${#DEVICE_LINES[@]} -eq 0 ]; then
    fail "Physical device" \
      "This Mac doesn't currently see any iPhone/iPad plugged in." \
      "Connect the device via USB (or same-network Wi-Fi sync), unlock it, and tap \"Trust This Computer\" if prompted. Check with: xcrun xctrace list devices"
  fi

  declare -a DEVICE_NAMES=()
  i=1
  for line in "${DEVICE_LINES[@]}"; do
    # e.g. "Sage 14Pro (26.5.2) (00008120-001E15DE1EFBC01E)" -> name "Sage 14Pro"
    name="$(echo "$line" | sed -E 's/ \([0-9A-Fa-f.-]+\)( \([0-9A-Fa-f-]+\))?$//')"
    DEVICE_NAMES+=("$name")
    marker=""
    [ "$name" = "${NAME:-$DEFAULT_DEVICE}" ] && marker="  <- selected"
    echo "      [$i] $line$marker"
    i=$((i+1))
  done

  DEVICE_NAME="${NAME:-$DEFAULT_DEVICE}"
  if [ -z "$NAME" ] && [ -t 0 ]; then
    read -rp "    Pick a device number [Enter = \"$DEFAULT_DEVICE\"]: " choice
    if [[ "$choice" =~ ^[0-9]+$ ]] && [ "$choice" -ge 1 ] && [ "$choice" -le "${#DEVICE_NAMES[@]}" ]; then
      DEVICE_NAME="${DEVICE_NAMES[$((choice - 1))]}"
    fi
  fi

  if ! printf '%s\n' "${DEVICE_NAMES[@]}" | grep -qxF "$DEVICE_NAME"; then
    fail "Physical device \"$DEVICE_NAME\"" \
      "This Mac doesn't currently see an iPhone/iPad named \"$DEVICE_NAME\" plugged in." \
      "Connect the device via USB (or same-network Wi-Fi sync), unlock it, and tap \"Trust This Computer\" if prompted. Check the exact name with: xcrun xctrace list devices"
  fi

  if grep -q "DEVELOPMENT_TEAM = ;" "$PBXPROJ"; then
    fail "Xcode signing team" \
      "The app can't be installed on a real device because no Apple Developer signing team is configured." \
      "Open $IOS_DIR/LxcMyHealthHub.xcworkspace in Xcode → select the LxcMyHealthHub target → Signing & Capabilities → sign in with an Apple ID and pick a Team. This is a one-time, GUI-only step that can't be scripted."
  fi

  echo "    Target: physical device \"$DEVICE_NAME\""
  npx react-native run-ios --device "$DEVICE_NAME"
else
  echo "    iOS Simulator versions installed on this Mac:"
  SIM_LINES=()
  while IFS= read -r line; do
    [ -n "$line" ] && SIM_LINES+=("$line")
  done < <(
    xcrun simctl list devices available 2>/dev/null | awk '
      /^-- .* --$/ { gsub(/^-- | --$/, ""); ver = $0; next }
      /^    / { line = $0; sub(/^    /, "", line); sub(/ \([0-9A-Fa-f-]+\).*/, "", line); print line " | " ver }
    '
  )

  if [ ${#SIM_LINES[@]} -eq 0 ]; then
    fail "iOS Simulator runtimes" \
      "This Mac has no iOS Simulator versions installed, so there's nothing to run the app on." \
      "Open Xcode → Settings → Platforms and install at least one iOS Simulator runtime."
  fi

  declare -a SIM_NAMES=()
  i=1
  for line in "${SIM_LINES[@]}"; do
    name="${line%% | *}"
    ver="${line##* | }"
    SIM_NAMES+=("$name")
    marker=""
    [ "$name" = "${NAME:-$DEFAULT_SIMULATOR}" ] && marker="  <- selected"
    echo "      [$i] $name (iOS $ver)$marker"
    i=$((i+1))
  done

  SIM_NAME="${NAME:-$DEFAULT_SIMULATOR}"
  if [ -z "$NAME" ] && [ -t 0 ]; then
    read -rp "    Pick a simulator number [Enter = \"$DEFAULT_SIMULATOR\"]: " choice
    if [[ "$choice" =~ ^[0-9]+$ ]] && [ "$choice" -ge 1 ] && [ "$choice" -le "${#SIM_NAMES[@]}" ]; then
      SIM_NAME="${SIM_NAMES[$((choice - 1))]}"
    fi
  fi

  if ! printf '%s\n' "${SIM_NAMES[@]}" | grep -qxF "$SIM_NAME"; then
    fail "Simulator \"$SIM_NAME\"" \
      "There's no installed iOS Simulator named \"$SIM_NAME\" on this Mac." \
      "Install it via Xcode → Settings → Platforms, or pick one that's already installed with: xcrun simctl list devices available"
  fi

  echo "    Target: simulator \"$SIM_NAME\""
  npx react-native run-ios --simulator "$SIM_NAME"
fi

echo "==> Done"
