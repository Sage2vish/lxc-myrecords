#!/bin/bash
# ============================================================================
# FILE        : macos_xdaapp_release_build.sh
# PROJECT     : LXC-Health
# AUTHOR      : Vishal Kumar
# UPDATED BY  : Vishal Kumar
# VERSION     : 1.0.0
# DATE-TIME   : 25-July-2026 | 16:55 Hrs
#
# PURPOSE     : Release-only Android build script for MyHealthHub. Loads the
#               local macOS Android toolchain, installs JS dependencies when
#               needed, builds release split APKs, and prints the generated
#               release artifacts. This does not require a connected device.
# ============================================================================

set -euo pipefail

FRAMEWORKS_ROOT="/Users/SageVish/Documents/Development Work/frameworks"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SHARED_DIR="$REPO_ROOT/lxc-myhealthhub-shared"
XDA_DIR="$REPO_ROOT/lxc-myhealthhub-xda"
RELEASE_DIR="$XDA_DIR/app/build/outputs/apk/release"

CLEAN_FIRST="${1:-}"

fail() {
  echo ""
  echo "✗ MISSING/BROKEN: $1"
  echo ""
  echo "  In plain terms:  $2"
  echo "  For developers:  $3"
  echo ""
  exit 1
}

echo "==> [1/5] Preflight checks"

if [ ! -f "$FRAMEWORKS_ROOT/android/env.sh" ]; then
  fail "Android toolchain script" \
    "The shared Android build tools are not loaded on this Mac." \
    "Expected file not found: $FRAMEWORKS_ROOT/android/env.sh"
fi

if [ ! -f "$SHARED_DIR/package.json" ]; then
  fail "lxc-myhealthhub-shared folder" \
    "The shared React Native app folder is missing or this script is in the wrong repo." \
    "Expected file not found: $SHARED_DIR/package.json"
fi

if [ ! -f "$XDA_DIR/gradlew" ]; then
  fail "lxc-myhealthhub-xda folder" \
    "The Android native project folder is missing or this script is in the wrong repo." \
    "Expected file not found: $XDA_DIR/gradlew"
fi

echo "    OK"

echo "==> [2/5] Loading Android toolchain"
source "$FRAMEWORKS_ROOT/android/env.sh"

if ! command -v node >/dev/null 2>&1; then
  fail "node" \
    "Node.js did not load correctly." \
    "Check NODE_HOME in $FRAMEWORKS_ROOT/android/env.sh"
fi

if ! command -v java >/dev/null 2>&1; then
  fail "java" \
    "Java did not load correctly, so Gradle cannot build Android." \
    "Check JAVA_HOME in $FRAMEWORKS_ROOT/android/env.sh"
fi

echo "==> [3/5] Installing JS dependencies if needed"
cd "$SHARED_DIR"
if [ ! -d node_modules ]; then
  npm install
else
  echo "    node_modules already present, skipping npm install"
fi

echo "==> [4/5] Building Android release APKs"
cd "$XDA_DIR"
if [ "$CLEAN_FIRST" = "clean" ] || [ "$CLEAN_FIRST" = "--clean" ]; then
  echo "    Cleaning Gradle build first"
  ./gradlew clean
fi

./gradlew assembleRelease

echo "==> [5/5] Release artifacts"
if [ ! -d "$RELEASE_DIR" ]; then
  fail "release output folder" \
    "Gradle finished, but the expected release folder was not created." \
    "Expected folder not found: $RELEASE_DIR"
fi

APK_COUNT="$(find "$RELEASE_DIR" -maxdepth 1 -name "*.apk" | wc -l | tr -d ' ')"
if [ "$APK_COUNT" = "0" ]; then
  fail "release APK files" \
    "The release folder exists, but no APK files were generated." \
    "Check Gradle output above and inspect: $RELEASE_DIR"
fi

echo "    Release folder:"
echo "    $RELEASE_DIR"
echo ""
find "$RELEASE_DIR" -maxdepth 1 -type f | sort | while IFS= read -r file; do
  ls -lh "$file"
done

echo ""
if [ -f "$RELEASE_DIR/MyHealthHub-universal.apk" ]; then
  echo "    Safest APK to share broadly:"
  echo "    $RELEASE_DIR/MyHealthHub-universal.apk"
fi
if [ -f "$RELEASE_DIR/MyHealthHub-arm64-v8a.apk" ]; then
  echo "    Recommended APK for most modern Android phones:"
  echo "    $RELEASE_DIR/MyHealthHub-arm64-v8a.apk"
fi

echo ""
echo "✓ Android release build complete"
