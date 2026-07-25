#!/bin/bash
# ============================================================================
# FILE        : macos_healthapi_package.sh
# PROJECT     : LXC-Health
# AUTHOR      : OpenAI Codex
# DATE-TIME   : 25-July-2026
#
# PURPOSE     : Package the lxc-health-api release files into a timestamped
#               .tar archive inside lxc-health-api/publish/ for manual Hostinger
#               deployment. Includes package.json, package-lock.json, tsconfig.json,
#               src/, and publish/import.env.
# ============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
API_DIR="$REPO_ROOT/lxc-health-api"
PUBLISH_DIR="$API_DIR/publish"

STAMP="${1:-$(date +%Y-%m-%d-%H%M)}"
ARCHIVE_NAME="lxc-health-api-${STAMP}.tar"
ARCHIVE_PATH="$PUBLISH_DIR/$ARCHIVE_NAME"

fail() {
  echo ""
  echo "✗ MISSING/BROKEN: $1"
  echo ""
  echo "  In plain terms:  $2"
  echo "  For developers:  $3"
  echo ""
  exit 1
}

if [ ! -d "$API_DIR" ]; then
  fail "lxc-health-api folder" \
    "The backend project folder isn't present where this script expects it." \
    "Expected directory not found: $API_DIR"
fi

if [ ! -f "$API_DIR/package.json" ]; then
  fail "package.json" \
    "The API project files are incomplete, so there is nothing to package." \
    "Expected file not found: $API_DIR/package.json"
fi

if [ ! -f "$API_DIR/package-lock.json" ]; then
  fail "package-lock.json" \
    "The API project is missing its lockfile, so the deploy bundle would be incomplete." \
    "Expected file not found: $API_DIR/package-lock.json"
fi

if [ ! -f "$API_DIR/tsconfig.json" ]; then
  fail "tsconfig.json" \
    "The API project TypeScript config is missing." \
    "Expected file not found: $API_DIR/tsconfig.json"
fi

if [ ! -d "$API_DIR/src" ]; then
  fail "src folder" \
    "The API source folder is missing, so there is nothing to package." \
    "Expected directory not found: $API_DIR/src"
fi

mkdir -p "$PUBLISH_DIR"

cat > "$PUBLISH_DIR/import.env" <<EOF
PORT=${PORT:-3000}
DEFAULT_WEATHER_CITY=${DEFAULT_WEATHER_CITY:-Dubai}
WEATHER_WEATHERAPI_FORECASTV1_BASE_URL=${WEATHER_WEATHERAPI_FORECASTV1_BASE_URL:-https://api.weatherapi.com/v1}
WEATHER_WEATHERAPI_FORECASTV1_API_KEY=${WEATHER_WEATHERAPI_FORECASTV1_API_KEY:-your_weatherapi_key_here}
EOF

echo "Creating $ARCHIVE_PATH"
tar --exclude='src/.DS_Store' -cf "$ARCHIVE_PATH" \
  -C "$API_DIR" \
  package.json \
  package-lock.json \
  tsconfig.json \
  src \
  publish/import.env

echo "Created: $ARCHIVE_PATH"
