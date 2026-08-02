#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
FRAMEWORKS_ROOT="/Users/SageVish/Documents/Development Work/frameworks"
IPADOS_DIR="$REPO_ROOT/lxc-myhealthhub-iPadOS"
WORKSPACE="$IPADOS_DIR/LxcMyHealthHubiPadOS.xcworkspace"
ARCHIVE_PATH="$IPADOS_DIR/build/archive/LxcMyHealthHubiPadOS.xcarchive"

[ -f "$FRAMEWORKS_ROOT/ios/env.sh" ] || { echo "Missing iOS toolchain: $FRAMEWORKS_ROOT/ios/env.sh" >&2; exit 1; }
[ -d "$WORKSPACE" ] || { echo "Missing iPadOS workspace: $WORKSPACE" >&2; exit 1; }

source "$FRAMEWORKS_ROOT/ios/env.sh"
mkdir -p "$(dirname "$ARCHIVE_PATH")"
xcodebuild -workspace "$WORKSPACE" -scheme LxcMyHealthHub -configuration Release -sdk iphoneos -archivePath "$ARCHIVE_PATH" archive
echo "Archive created: $ARCHIVE_PATH"
