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
#                 1) Run/Test Local (Dev APIM — Remote DB) — starts lxc-apim
#                    in dev mode on this Mac, connected to the real Hostinger
#                    MySQL database, and opens it in the browser.
#                 2) Make Build to Publish (PROD APIM — local DB) — not built
#                    yet; selecting it just re-shows this menu.
#
#               The real MySQL password is never hardcoded here — on first
#               run it's prompted for interactively (hidden input) and saved
#               to lxc-apim/.env, which is already gitignored and never
#               committed.
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

ensure_env_file() {
  if [ -f "$ENV_FILE" ]; then
    return
  fi

  echo ""
  echo "No local .env found for lxc-apim yet."
  echo "This run connects to the REMOTE Hostinger MySQL database, so it needs"
  echo "the real password once. It's saved only to lxc-apim/.env, which is"
  echo "already gitignored and never committed."
  echo ""

  read -r -p "MySQL user [u450600831_lxc_hapi_admin]: " mysql_user
  mysql_user="${mysql_user:-u450600831_lxc_hapi_admin}"

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

  echo "==> Wrote $ENV_FILE (gitignored, not committed)"

  read -r -p "Run database migrations + seed data now? [y/N] " run_db_setup
  if [ "$run_db_setup" = "y" ] || [ "$run_db_setup" = "Y" ]; then
    echo "==> Running migrations"
    (cd "$APIM_DIR" && set -a && source "$ENV_FILE" && set +a && npm run db:migrate)
    echo "==> Seeding baseline data (roles, products)"
    (cd "$APIM_DIR" && set -a && source "$ENV_FILE" && set +a && npm run db:seed)
  else
    echo "Skipping — you can run 'npm run db:migrate' / 'npm run db:seed' from lxc-apim later."
  fi
}

run_local_dev_remote_db() {
  echo "==> [1/4] Preflight checks"
  preflight

  echo "==> [2/4] Loading toolchain"
  # shellcheck disable=SC1091
  source "$FRAMEWORKS_ROOT/android/env.sh"

  ensure_deps
  ensure_env_file

  echo "==> [3/4] Starting lxc-apim (dev mode, remote DB) — logs: $LOG_FILE"
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

  echo "==> [4/4] Running — Ctrl+C stops the server and returns to this menu"
  ( cd "$APIM_DIR" && set -a && source "$ENV_FILE" && set +a && exec npm run dev ) 2>&1 | tee "$LOG_FILE" || true
}

show_menu() {
  echo ""
  echo "========================================"
  echo " LXC-APIM"
  echo "========================================"
  echo " 1) Run/Test Local  (Dev APIM  — Remote DB)"
  echo " 2) Make Build to Publish (PROD APIM — local DB)"
  echo " q) Quit"
  echo "========================================"
}

main() {
  while true; do
    show_menu
    read -r -p "Choose an option: " choice
    case "$choice" in
      1)
        run_local_dev_remote_db
        ;;
      2)
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
