#!/bin/bash
# ============================================================================
# FILE        : macos_apimapp_run.sh
# PROJECT     : LXC-DBs-APIs
# AUTHOR      : Claude Sonnet 5
# DATE-TIME   : 02-August-2026
#
# PURPOSE     : Interactive menu for running lxc-apim locally. Separate from
#               macos_healthapi_package.sh (which packages lxc-api's web app
#               deploy bundle) — lxc-api and lxc-apim share one MySQL
#               database, but their deploy/run tooling is intentionally kept
#               in separate scripts, not merged.
#
#               Menu:
#                 1) Default Run/Test Local (Dev APIM — Remote DB) — uses
#                    whatever is already in lxc-apim/.env (already gitignored,
#                    never committed) with zero prompts. If .env doesn't
#                    exist yet, this option fails with a message pointing at
#                    option 2 instead of silently asking questions.
#                 2) Custom Run/Test Local (Dev APIM — Remote DB) — the
#                    interactive path: prompts for MySQL user/password
#                    (hidden input), writes/overwrites lxc-apim/.env, then
#                    runs the same startup sequence as option 1.
#                 3) Make Build to Publish (PROD APIM — local DB) — not built
#                    yet; selecting it just re-shows this menu.
#
#               The real MySQL password is never hardcoded in this script —
#               it only ever lives in lxc-apim/.env.
# ============================================================================

set -euo pipefail

FRAMEWORKS_ROOT="/Users/SageVish/Documents/Development Work/frameworks"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
APIM_DIR="$REPO_ROOT/lxc-databases-apis/lxc-apim"
ENV_FILE="$APIM_DIR/.env"
PORT="3100"
LOG_FILE="/tmp/lxc-apim-dev.log"

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

preflight() {
  if [ ! -d "$APIM_DIR" ]; then
    fail "lxc-apim folder" \
      "The lxc-apim project folder isn't present where this script expects it." \
      "Expected directory not found: $APIM_DIR"
  fi

  if [ ! -f "$APIM_DIR/package.json" ]; then
    fail "lxc-apim package.json" \
      "The lxc-apim project files are incomplete." \
      "Expected file not found: $APIM_DIR/package.json"
  fi

  if [ ! -f "$FRAMEWORKS_ROOT/android/env.sh" ]; then
    fail "Node toolchain script" \
      "The shared build tools this project needs (Node.js) aren't set up on this Mac yet." \
      "Expected file not found: $FRAMEWORKS_ROOT/android/env.sh"
  fi
}

ensure_deps() {
  if [ ! -d "$APIM_DIR/node_modules" ]; then
    echo "==> Installing lxc-apim dependencies (first run)"
    (cd "$APIM_DIR" && npm install)
  fi
}

# Runs migrate + seed against whatever's in $ENV_FILE right now. Both are
# idempotent (migrate tracks applied files in apim_schema_migrations, seed
# is ON DUPLICATE KEY UPDATE), so calling this on every run is cheap and
# doubles as the "is everything actually in place" check — it fixes gaps
# instead of just detecting them.
ensure_db_ready() {
  echo "==> Checking schema/data (safe to re-run — no-ops if already applied)"
  (cd "$APIM_DIR" && set -a && source "$ENV_FILE" && set +a && npm run db:migrate)
  (cd "$APIM_DIR" && set -a && source "$ENV_FILE" && set +a && npm run db:seed)
}

start_server_and_open_browser() {
  (
    for _ in $(seq 1 30); do
      if curl -s "http://localhost:${PORT}/v1/health" >/dev/null 2>&1; then
        echo "==> Opening http://localhost:${PORT} in your browser"
        open "http://localhost:${PORT}"
        break
      fi
      sleep 1
    done
  ) &

  echo "==> Running — Ctrl+C stops the server and returns to this menu"
  ( cd "$APIM_DIR" && set -a && source "$ENV_FILE" && set +a && exec npm run dev ) 2>&1 | tee "$LOG_FILE" || true
}

run_default() {
  echo "==> [1/4] Preflight checks"
  preflight

  if [ ! -f "$ENV_FILE" ]; then
    fail "lxc-apim/.env" \
      "Default mode never asks questions, so it needs credentials to already be saved." \
      "Run option 2 (Custom Run/Test Local) once to set the MySQL password — it writes $ENV_FILE, and Default will use it silently from then on."
  fi

  echo "==> [2/4] Loading toolchain"
  # shellcheck disable=SC1091
  source "$FRAMEWORKS_ROOT/android/env.sh"

  ensure_deps

  echo "==> [3/4] Database"
  ensure_db_ready

  echo "==> [4/4] Starting lxc-apim (dev mode, remote DB) — logs: $LOG_FILE"
  start_server_and_open_browser
}

run_custom() {
  echo "==> [1/5] Preflight checks"
  preflight

  echo "==> [2/5] Loading toolchain"
  # shellcheck disable=SC1091
  source "$FRAMEWORKS_ROOT/android/env.sh"

  ensure_deps

  echo ""
  echo "==> [3/5] Custom credentials for lxc-apim"
  echo "This writes/overwrites $ENV_FILE (already gitignored, never committed)."
  echo ""

  local default_user="u450600831_lxc_hapi_admin"
  if [ -f "$ENV_FILE" ]; then
    local existing_user
    existing_user="$(grep -E '^MYSQL_USER=' "$ENV_FILE" 2>/dev/null | cut -d '=' -f2-)"
    if [ -n "$existing_user" ]; then
      default_user="$existing_user"
    fi
  fi

  read -r -p "MySQL user [${default_user}]: " mysql_user
  mysql_user="${mysql_user:-$default_user}"

  read -r -s -p "MySQL password for ${mysql_user}@srv1878.hstgr.io: " mysql_password
  echo ""

  if [ -z "$mysql_password" ]; then
    fail "MySQL password" \
      "A password is required to connect to the remote database." \
      "Re-run and enter the real Hostinger MySQL password."
  fi

  local jwt_secret
  if command -v openssl >/dev/null 2>&1; then
    jwt_secret="$(openssl rand -hex 32)"
  else
    jwt_secret="dev-only-$(date +%s)-please-replace"
  fi

  cat > "$ENV_FILE" <<EOF
PORT=${PORT}
MYSQL_HOST=srv1878.hstgr.io
MYSQL_PORT=3306
MYSQL_DATABASE=u450600831_lxc_hlthapi_db
MYSQL_USER=${mysql_user}
MYSQL_PASSWORD=${mysql_password}
JWT_SECRET=${jwt_secret}
JWT_EXPIRES_IN=1h
EOF

  echo "==> Wrote $ENV_FILE"

  echo "==> [4/5] Database"
  ensure_db_ready

  echo "==> [5/5] Starting lxc-apim (dev mode, remote DB) — logs: $LOG_FILE"
  start_server_and_open_browser
}

show_menu() {
  echo ""
  echo "========================================"
  echo " LXC-APIM"
  echo "========================================"
  echo " 1) Default Run/Test Local  (Dev APIM  — Remote DB)"
  echo " 2) Custom Run/Test Local   (Dev APIM  — Remote DB)"
  echo " 3) Make Build to Publish (PROD APIM — local DB)"
  echo " q) Quit"
  echo "========================================"
}

main() {
  while true; do
    show_menu
    read -r -p "Choose an option: " choice
    case "$choice" in
      1)
        run_default
        ;;
      2)
        run_custom
        ;;
      3)
        echo ""
        echo "Not built yet — this option is a placeholder for the PROD"
        echo "APIM / local DB build-to-publish flow, coming later."
        ;;
      q|Q)
        exit 0
        ;;
      *)
        echo ""
        echo "Not a valid option: $choice"
        ;;
    esac
  done
}

main
