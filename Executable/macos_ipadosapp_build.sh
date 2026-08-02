#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
FRAMEWORKS_ROOT="/Users/SageVish/Documents/Development Work/frameworks"
SHARED_DIR="$REPO_ROOT/lxc-myhealthhub-shared"
IPADOS_DIR="$REPO_ROOT/lxc-myhealthhub-iPadOS"
PROJECT_PATH="$IPADOS_DIR/LxcMyHealthHubiPadOS.xcodeproj"
PBXPROJ="$PROJECT_PATH/project.pbxproj"
TARGET="${1:-menu}"
TARGET_NAME="${2:-}"
DEFAULT_SIMULATOR="iPad (A16)"

fail() {
  echo "iPadOS build setup failed: $1" >&2
  echo "Fix: $2" >&2
  exit 1
}

choose_target() {
  local choice=""
  local i=1
  DEVICE_NAMES=()
  SIMULATOR_NAMES=()

  while IFS= read -r name; do
    [ -n "$name" ] && DEVICE_NAMES+=("$name")
  done < <(xcrun devicectl list devices 2>/dev/null | awk 'NR > 2 && /iPad/ {sub(/  .*/, ""); print}')

  while IFS= read -r name; do
    [ -n "$name" ] && SIMULATOR_NAMES+=("$name")
  done < <(xcrun simctl list devices available 2>/dev/null | sed -n 's/^    \(iPad.*\) (.*/\1/p')

  echo ""
  echo "========================================"
  echo " MyHealthHub iPadOS"
  echo "========================================"
  echo " 1) Install and run on a connected iPad"
  for name in "${DEVICE_NAMES[@]}"; do
    echo "      $name"
  done
  echo " 2) Build and run iPad simulator (default: $DEFAULT_SIMULATOR)"
  echo " 3) Choose a compatible iPad simulator"
  echo " q) Quit"
  echo "========================================"
  read -rp "Choose [2]: " choice

  case "${choice:-2}" in
    1)
      [ ${#DEVICE_NAMES[@]} -gt 0 ] || fail "no physical iPad is connected" "Connect, unlock, and trust an iPad, then rerun this script."
      if [ ${#DEVICE_NAMES[@]} -eq 1 ]; then
        TARGET="device"
        TARGET_NAME="${DEVICE_NAMES[0]}"
        return
      fi
      echo "Connected iPads:"
      i=1
      for name in "${DEVICE_NAMES[@]}"; do echo " [$i] $name"; i=$((i + 1)); done
      read -rp "Pick device [1]: " choice
      TARGET="device"
      TARGET_NAME="${DEVICE_NAMES[$(( ${choice:-1} - 1 ))]}"
      ;;
    2) TARGET="simulator"; TARGET_NAME="$DEFAULT_SIMULATOR" ;;
    3)
      [ ${#SIMULATOR_NAMES[@]} -gt 0 ] || fail "no iPad simulators are installed" "Install an iPad simulator runtime in Xcode Settings > Platforms."
      echo "Compatible iPad simulators:"
      i=1
      for name in "${SIMULATOR_NAMES[@]}"; do echo " [$i] $name"; i=$((i + 1)); done
      read -rp "Pick simulator [1]: " choice
      TARGET="simulator"
      TARGET_NAME="${SIMULATOR_NAMES[$(( ${choice:-1} - 1 ))]}"
      ;;
    q|Q) exit 0 ;;
    *) fail "unknown menu option" "Choose 1, 2, 3, or q." ;;
  esac
}

[ -d "$SHARED_DIR" ] || fail "shared app source is missing" "Expected: $SHARED_DIR"
[ -f "$IPADOS_DIR/Podfile" ] || fail "iPadOS Podfile is missing" "Expected: $IPADOS_DIR/Podfile"
[ -d "$PROJECT_PATH" ] || fail "iPadOS Xcode project is missing" "Expected: $PROJECT_PATH"
[ -f "$FRAMEWORKS_ROOT/android/env.sh" ] || fail "Node toolchain loader is missing" "Expected: $FRAMEWORKS_ROOT/android/env.sh"
[ -f "$FRAMEWORKS_ROOT/ios/env.sh" ] || fail "iOS toolchain loader is missing" "Expected: $FRAMEWORKS_ROOT/ios/env.sh"

source "$FRAMEWORKS_ROOT/android/env.sh"
source "$FRAMEWORKS_ROOT/ios/env.sh"
command -v node >/dev/null || fail "Node did not load" "Check $FRAMEWORKS_ROOT/android/env.sh"
command -v pod >/dev/null || fail "CocoaPods did not load" "Check $FRAMEWORKS_ROOT/ios/env.sh"

if [ "$TARGET" = "menu" ]; then
  if [ -t 0 ]; then
    choose_target
  else
    TARGET="simulator"
    TARGET_NAME="$DEFAULT_SIMULATOR"
  fi
fi

cd "$SHARED_DIR"
[ -d node_modules ] || npm install

cd "$IPADOS_DIR"
if [ ! -f Podfile.lock ] || [ ! -f Pods/Manifest.lock ] || [ Podfile -nt Pods/Manifest.lock ] || ! diff -q Podfile.lock Pods/Manifest.lock >/dev/null 2>&1; then
  pod install
fi

if grep -q "ENABLE_USER_SCRIPT_SANDBOXING = YES;" "$PBXPROJ"; then
  sed -i '' 's/ENABLE_USER_SCRIPT_SANDBOXING = YES;/ENABLE_USER_SCRIPT_SANDBOXING = NO;/g' "$PBXPROJ"
fi

cd "$SHARED_DIR"
case "$TARGET" in
  device)
    [ -n "$TARGET_NAME" ] || fail "no iPad name was selected" "Choose option 1 from the iPadOS menu."
    xcrun devicectl list devices | grep -F "$TARGET_NAME" >/dev/null || fail "iPad '$TARGET_NAME' is not connected" "Unlock it, trust this Mac, and reconnect the cable."
    LXC_IOS_SOURCE_DIR="../lxc-myhealthhub-iPadOS" npx react-native run-ios --scheme LxcMyHealthHub --device "$TARGET_NAME"
    ;;
  simulator)
    LXC_IOS_SOURCE_DIR="../lxc-myhealthhub-iPadOS" npx react-native run-ios --scheme LxcMyHealthHub --simulator "${TARGET_NAME:-$DEFAULT_SIMULATOR}"
    ;;
  *)
    fail "unknown target '$TARGET'" "Use: simulator [name] or device [name]"
    ;;
esac
