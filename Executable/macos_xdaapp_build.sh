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
# If anything required is missing (toolchain, repo folders, a device/emulator
# and no AVD to fall back to...) this script stops immediately and prints
# what's missing in plain language plus the exact developer fix — no guessing.
#
# Sequence this script runs, in order:
#   1. Preflight checks — confirm the repo folders this script depends on exist.
#   2. Load the project-independent Android toolchain (Node, JDK 17, Android SDK,
#      Gradle) from frameworks/android/env.sh — see repo CLAUDE.md — and confirm
#      node/adb/java actually resolved afterward.
#   3. Choose a target: if a device/emulator is already connected, use it (and
#      let the user pick if more than one is). If nothing is connected, list
#      the installed emulators (AVDs), boot one (lowest API level by default),
#      and wait for it to finish booting before continuing.
#   4. Install JS dependencies in lxc-myhealthhub-shared if node_modules is missing.
#   5. Build the APK via Gradle in lxc-myhealthhub-xda (assembleDebug or assembleRelease).
#   6. Install the APK on the chosen device/emulator via adb, and for debug
#      builds, launch the app immediately.

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

echo "==> [3/6] Choosing a device/emulator"

SERIALS=()
while IFS= read -r line; do
  [ -n "$line" ] && SERIALS+=("$line")
done < <(adb devices | awk 'NR>1 && $2=="device" {print $1}')

if [ ${#SERIALS[@]} -eq 0 ]; then
  echo "    Nothing connected — checking for installed emulators (AVDs)..."

  AVDS=()
  while IFS= read -r line; do
    [ -n "$line" ] && AVDS+=("$line")
  done < <(emulator -list-avds 2>/dev/null)

  if [ ${#AVDS[@]} -eq 0 ]; then
    fail "Device/emulator" \
      "No Android phone is plugged in, and there's no emulator set up on this Mac to fall back to." \
      "Plug in an Android device (USB debugging enabled, machine authorized), or create an emulator via Android Studio's Device Manager. Check with: adb devices / emulator -list-avds"
  fi

  # Default to the lowest API level installed, matching the iOS script's
  # "lowest simulator by default" convention.
  DEFAULT_AVD="${AVDS[0]}"
  LOWEST_API=999999
  for avd in "${AVDS[@]}"; do
    api="$(echo "$avd" | grep -oE '[0-9]+$')"
    if [ -n "$api" ] && [ "$api" -lt "$LOWEST_API" ]; then
      LOWEST_API="$api"
      DEFAULT_AVD="$avd"
    fi
  done

  echo "    Emulators installed on this Mac:"
  i=1
  for avd in "${AVDS[@]}"; do
    marker=""
    [ "$avd" = "$DEFAULT_AVD" ] && marker="  <- default"
    echo "      [$i] $avd$marker"
    i=$((i + 1))
  done

  CHOSEN_AVD="$DEFAULT_AVD"
  if [ -t 0 ]; then
    read -rp "    Pick an emulator number [Enter = \"$DEFAULT_AVD\"]: " choice
    if [[ "$choice" =~ ^[0-9]+$ ]] && [ "$choice" -ge 1 ] && [ "$choice" -le "${#AVDS[@]}" ]; then
      CHOSEN_AVD="${AVDS[$((choice - 1))]}"
    fi
  fi

  EMU_LOG="/tmp/${CHOSEN_AVD}-emulator.log"
  echo "    Booting \"$CHOSEN_AVD\" (first boot can take a minute or two)..."
  nohup emulator -avd "$CHOSEN_AVD" -netdelay none -netspeed full >"$EMU_LOG" 2>&1 &
  disown

  adb wait-for-device
  BOOT_TIMEOUT=180
  elapsed=0
  while [ "$(adb shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" != "1" ]; do
    sleep 3
    elapsed=$((elapsed + 3))
    if [ "$elapsed" -ge "$BOOT_TIMEOUT" ]; then
      fail "Emulator boot timed out" \
        "\"$CHOSEN_AVD\" took longer than $BOOT_TIMEOUT seconds to start." \
        "Check what went wrong in its log: $EMU_LOG — or launch it manually from Android Studio's Device Manager to see the failure directly."
    fi
  done
  echo "    Emulator ready."

  SERIALS=()
  while IFS= read -r line; do
    [ -n "$line" ] && SERIALS+=("$line")
  done < <(adb devices | awk 'NR>1 && $2=="device" {print $1}')
fi

echo "    Connected:"
LABELS=()
for serial in "${SERIALS[@]}"; do
  model="$(adb -s "$serial" shell getprop ro.product.model 2>/dev/null | tr -d '\r')"
  version="$(adb -s "$serial" shell getprop ro.build.version.release 2>/dev/null | tr -d '\r')"
  label="$model (Android $version) [$serial]"
  LABELS+=("$label")
  echo "      - $label"
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
else
  ./gradlew assembleDebug
fi

# This project builds per-ABI split APKs (e.g. MyHealthHub-debug-arm64-v8a.apk),
# not a single universal app-debug.apk, so pick the one matching the target's ABI.
OUT_DIR="$XDA_DIR/app/build/outputs/apk/$BUILD_TYPE"
ABI="$(adb -s "$TARGET_SERIAL" shell getprop ro.product.cpu.abi 2>/dev/null | tr -d '\r')"

APK_PATH="$OUT_DIR/app-$BUILD_TYPE.apk"
if [ ! -f "$APK_PATH" ] && [ -n "$ABI" ]; then
  APK_PATH="$OUT_DIR/MyHealthHub-$BUILD_TYPE-$ABI.apk"
fi

if [ ! -f "$APK_PATH" ]; then
  APKS=()
  while IFS= read -r f; do
    [ -n "$f" ] && APKS+=("$f")
  done < <(find "$OUT_DIR" -maxdepth 1 -name "*.apk" 2>/dev/null)

  APK_PATH=""
  if [ -n "$ABI" ]; then
    for f in "${APKS[@]}"; do
      case "$f" in
        *"$ABI"*) APK_PATH="$f" ;;
      esac
    done
  fi
  if [ -z "$APK_PATH" ] && [ ${#APKS[@]} -eq 1 ]; then
    APK_PATH="${APKS[0]}"
  fi
fi

if [ -z "$APK_PATH" ] || [ ! -f "$APK_PATH" ]; then
  fail "Built APK not found" \
    "Gradle reported a successful build, but this script can't tell which output file to install for a \"$ABI\" device." \
    "See what Gradle actually produced with: ls \"$OUT_DIR\" — the output filename pattern or ABI splits in app/build.gradle may have changed."
fi

echo "==> [6/6] Installing on $TARGET_SERIAL"
adb -s "$TARGET_SERIAL" install -r "$APK_PATH"

if [ "$BUILD_TYPE" != "release" ]; then
  adb -s "$TARGET_SERIAL" shell am start -n "$APP_ID/.MainActivity" >/dev/null
fi

echo "==> Done. APK: $APK_PATH"
