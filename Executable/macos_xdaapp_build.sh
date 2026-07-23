#!/bin/bash
# =============================================================================
#  macos_xdaapp_build.sh
#
#  Copyright (c) 2026 Lexvora Consulting. All rights reserved.
#  Author:  Sage Vish
#  Created: 2026-07-23
# =============================================================================
#
# macos_xdaapp_build.sh — build + launch MyHealthHub (Android / "xda" native project)
#
# Usage:
#   ./macos_xdaapp_build.sh          # debug build, installed on whatever adb sees
#   ./macos_xdaapp_build.sh release  # release build (installs, does not auto-launch)
#
# If anything required is missing (toolchain, repo folders, a connected
# device/emulator...) this script stops immediately and prints what's missing
# in plain language plus the exact developer fix — no guessing needed.
#
# Sequence this script runs, in order:
#   1. Preflight checks — confirm the repo folders this script depends on exist.
#   2. Load the project-independent Android toolchain (Node, JDK 17, Android SDK,
#      Gradle) from frameworks/android/env.sh — see repo CLAUDE.md — and confirm
#      node/adb/java actually resolved afterward.
#   3. List every device/emulator adb can see, along with its Android version —
#      if more than one is connected, let the user pick which to target. Fails
#      fast here (before a multi-minute Gradle build) if nothing is connected.
#   4. Install JS dependencies in lxc-myhealthhub-shared if node_modules is missing.
#   5. Build the APK via Gradle in lxc-myhealthhub-xda (assembleDebug or assembleRelease).
#   6. Install the APK on the chosen device/emulator via adb, and for debug
#      builds, launch the app immediately.
#
# Requires a device/emulator already running — this script does not boot one
# for you. Plug in a device, or start an emulator via Android Studio / `emulator
# -avd <name>`, before running.

set -euo pipefail

FRAMEWORKS_ROOT="/Users/SageVish/Documents/Development Work/frameworks"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SHARED_DIR="$REPO_ROOT/lxc-myhealthhub-shared"
XDA_DIR="$REPO_ROOT/lxc-myhealthhub-xda"
APP_ID="com.lxcmyhealthhub"

BUILD_TYPE="${1:-debug}"   # debug | release

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

if [ ! -f "$FRAMEWORKS_ROOT/android/env.sh" ]; then
  fail "Android toolchain script" \
    "The shared build tools this project needs (Node, Java, Android SDK, Gradle) aren't set up on this Mac yet." \
    "Expected file not found: $FRAMEWORKS_ROOT/android/env.sh — set up the frameworks/ directory per this repo's macOS toolchain docs (CLAUDE.md), or edit FRAMEWORKS_ROOT at the top of this script to point at your own toolchain."
fi

if [ ! -f "$SHARED_DIR/package.json" ]; then
  fail "lxc-myhealthhub-shared folder" \
    "The app's source code folder is missing or this script is in the wrong place." \
    "Expected file not found: $SHARED_DIR/package.json — this script must live in an Executable/ folder that is a sibling of lxc-myhealthhub-shared in the repo."
fi

if [ ! -f "$XDA_DIR/gradlew" ]; then
  fail "lxc-myhealthhub-xda folder" \
    "The native Android project folder is missing or this script is in the wrong place." \
    "Expected file not found: $XDA_DIR/gradlew — this script must live in an Executable/ folder that is a sibling of lxc-myhealthhub-xda in the repo."
fi
echo "    OK"

echo "==> [2/6] Loading Android toolchain"
source "$FRAMEWORKS_ROOT/android/env.sh"

if ! command -v node >/dev/null 2>&1; then
  fail "node" \
    "Node.js didn't load correctly, so nothing after this point can run." \
    "NODE_HOME in $FRAMEWORKS_ROOT/android/env.sh doesn't point at a working Node install — check that path exists and contains bin/node."
fi

if ! command -v java >/dev/null 2>&1; then
  fail "java" \
    "Java didn't load correctly, so Gradle can't run." \
    "JAVA_HOME in $FRAMEWORKS_ROOT/android/env.sh doesn't point at a working JDK — check that path exists and contains bin/java."
fi

if ! command -v adb >/dev/null 2>&1; then
  fail "adb (Android Debug Bridge)" \
    "The tool used to talk to Android devices/emulators isn't available." \
    "ANDROID_HOME in $FRAMEWORKS_ROOT/android/env.sh doesn't point at a working Android SDK — check that path exists and contains platform-tools/adb."
fi

echo "==> [3/6] Checking for a connected device/emulator"
mapfile -t SERIALS < <(adb devices | awk 'NR>1 && $2=="device" {print $1}')

if [ ${#SERIALS[@]} -eq 0 ]; then
  fail "Device/emulator" \
    "No Android phone or emulator is currently connected." \
    "Plug in an Android device (with USB debugging enabled and the machine authorized), or start an emulator with Android Studio / \`emulator -avd <name>\`, then re-run this script. Check with: adb devices"
fi

echo "    Connected:"
declare -a LABELS=()
for serial in "${SERIALS[@]}"; do
  model="$(adb -s "$serial" shell getprop ro.product.model 2>/dev/null | tr -d '\r')"
  version="$(adb -s "$serial" shell getprop ro.build.version.release 2>/dev/null | tr -d '\r')"
  LABELS+=("$model (Android $version) [$serial]")
  echo "      - ${LABELS[-1]}"
done

TARGET_SERIAL="${SERIALS[0]}"
if [ ${#SERIALS[@]} -gt 1 ]; then
  if [ -t 0 ]; then
    i=1
    for label in "${LABELS[@]}"; do
      echo "      [$i] $label"
      i=$((i + 1))
    done
    read -rp "    Multiple devices found — pick a number [Enter = 1]: " choice
    if [[ "$choice" =~ ^[0-9]+$ ]] && [ "$choice" -ge 1 ] && [ "$choice" -le "${#SERIALS[@]}" ]; then
      TARGET_SERIAL="${SERIALS[$((choice - 1))]}"
    fi
  else
    echo "    Multiple devices found and no interactive terminal to ask — defaulting to the first one."
  fi
fi
echo "    Building against: $TARGET_SERIAL"

echo "==> [4/6] Installing JS dependencies (lxc-myhealthhub-shared)"
cd "$SHARED_DIR"
if [ ! -d node_modules ]; then
  npm install
else
  echo "    node_modules already present, skipping npm install"
fi

echo "==> [5/6] Building $BUILD_TYPE APK (lxc-myhealthhub-xda)"
cd "$XDA_DIR"
if [ "$BUILD_TYPE" = "release" ]; then
  ./gradlew assembleRelease
  APK_PATH="$XDA_DIR/app/build/outputs/apk/release/app-release.apk"
else
  ./gradlew assembleDebug
  APK_PATH="$XDA_DIR/app/build/outputs/apk/debug/app-debug.apk"
fi

echo "==> [6/6] Installing on $TARGET_SERIAL"
adb -s "$TARGET_SERIAL" install -r "$APK_PATH"

if [ "$BUILD_TYPE" != "release" ]; then
  adb -s "$TARGET_SERIAL" shell monkey -p "$APP_ID" -c android.intent.category.LAUNCHER 1
fi

echo "==> Done. APK: $APK_PATH"
