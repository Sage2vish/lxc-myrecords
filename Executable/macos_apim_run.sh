#!/bin/bash
# ============================================================================
# FILE        : macos_apim_run.sh
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
#                 1) First Time  - Default Run/Test Local (Dev APIM — Remote DB)
#                 2) Regular     - Default Run/Test Local (Dev APIM — Remote DB)
#                 3) Custom Run/Test Local (Dev APIM — Remote DB)
#                 4) Make Build to Publish (PROD APIM — local DB)
#                 q) Quit
#
#               Options 1 and 2 run the exact same underlying sequence (both
#               always confirm dependencies, apply migrations/seed data, and
#               run an explicit health check before opening the browser —
#               all idempotent, so repeating it is cheap) and both require
#               lxc-apim/.env to already exist, asking zero questions. They
#               only differ in labeling/messaging — "First Time" for
#               newcomers, "Regular" for everyday use. Option 3 is the only
#               one that prompts, for setting up or changing credentials.
#
#               The real MySQL password is never hardcoded in this script —
#               it only ever lives in lxc-apim/.env (gitignored).
# ============================================================================

set -euo pipefail

FRAMEWORKS_ROOT="/Users/SageVish/Documents/Development Work/frameworks"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
APIM_DIR="$REPO_ROOT/lxc-databases-apis/lxc-apim"
ENV_FILE="$APIM_DIR/.env"
PORT="3100"
LOG_FILE="/tmp/lxc-apim-dev.log"

# lxc-api — started alongside lxc-apim so the catalog's localhost link for
# lxc-api actually responds. Best-effort: if its .env isn't set up (needs a
# real WeatherAPI.com key, a separate secret this script doesn't manage),
# this is skipped with a clear message rather than blocking the apim flow.
API_DIR="$REPO_ROOT/lxc-databases-apis/lxc-api"
API_ENV_FILE="$API_DIR/.env"
API_PORT="3000"
API_LOG_FILE="/tmp/lxc-api-dev.log"
API_SERVER_PID=""

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
    echo "    Installing lxc-apim dependencies (first run)"
    (cd "$APIM_DIR" && npm install)
  else
    echo "    Dependencies already installed"
  fi
}

# Runs migrate + seed (+ the dev backdoor admin account) against whatever's
# in $ENV_FILE right now. All three are idempotent (migrate tracks applied
# files in apim_schema_migrations, seed/seed-admin are ON DUPLICATE KEY
# UPDATE), so calling this on every run is cheap and doubles as the "is
# everything actually in place" check — it fixes gaps instead of just
# detecting them.
#
# TEMPORARY: db:seed:admin with no SEED_ADMIN_* env vars set creates/keeps a
# known admin/admin@1234 backdoor login. Intentional for now (early
# development, no auth API or public deployment yet) — must be removed or
# replaced before lxc-apim goes anywhere real.
ensure_db_ready() {
  echo "    Checking schema (migrations)..."
  (cd "$APIM_DIR" && set -a && source "$ENV_FILE" && set +a && npm run db:migrate)
  echo "    ✓ Schema up to date"

  echo "    Checking baseline data (roles, products)..."
  (cd "$APIM_DIR" && set -a && source "$ENV_FILE" && set +a && npm run db:seed)
  echo "    ✓ Baseline data present"

  echo "    Checking admin account..."
  (cd "$APIM_DIR" && set -a && source "$ENV_FILE" && set +a && npm run db:seed:admin)
  echo "    ✓ Admin account present"
}

# Starts lxc-api in the background too, so the catalog's localhost:3000 link
# for lxc-api is actually live, not just a label. This no longer depends on
# lxc-api/.env existing; when that file is missing we still boot the app with
# safe defaults so /docs and /v1/health stay reachable. If weather provider
# env vars are missing, only /v1/weather/today is affected.
start_lxc_api_if_possible() {
  if [ ! -d "$API_DIR/node_modules" ]; then
    echo "    Installing lxc-api dependencies (first run)"
    (cd "$API_DIR" && npm install)
  fi

  if [ -f "$API_ENV_FILE" ]; then
    ( cd "$API_DIR" && set -a && source "$API_ENV_FILE" && set +a && npm run dev ) > "$API_LOG_FILE" 2>&1 &
  else
    echo "    lxc-api/.env not found — starting with defaults so docs/health still work."
    (
      cd "$API_DIR" &&
      PORT="$API_PORT" \
      DEFAULT_WEATHER_CITY="Dubai" \
      npm run dev
    ) > "$API_LOG_FILE" 2>&1 &
  fi
  API_SERVER_PID=$!

  local tries=0
  while [ "$tries" -lt 15 ]; do
    if curl -s "http://localhost:${API_PORT}/v1/health" >/dev/null 2>&1; then
      echo "    ✓ lxc-api running at http://localhost:${API_PORT}"
      return
    fi
    if ! kill -0 "$API_SERVER_PID" 2>/dev/null; then
      echo "    ✗ lxc-api failed to start — see $API_LOG_FILE (continuing without it)"
      API_SERVER_PID=""
      return
    fi
    tries=$((tries + 1))
    sleep 1
  done

  echo "    ✗ lxc-api didn't respond in time — see $API_LOG_FILE (continuing without it)"
}

# Starts the dev server in the background, explicitly health-checks it,
# opens the browser only once that health check passes, then attaches to
# the logs in the foreground so Ctrl+C cleanly stops the server and returns
# to the menu.
start_server_and_health_check() {
  ( cd "$APIM_DIR" && set -a && source "$ENV_FILE" && set +a && npm run dev ) > "$LOG_FILE" 2>&1 &
  local server_pid=$!

  trap 'echo ""; echo "Stopping lxc-apim..."; kill "$server_pid" 2>/dev/null; wait "$server_pid" 2>/dev/null; [ -n "$API_SERVER_PID" ] && kill "$API_SERVER_PID" 2>/dev/null; trap - INT TERM' INT TERM

  echo "    Checking server health..."
  echo "    Waiting for http://localhost:${PORT}/v1/health"
  local tries=0
  local healthy="0"
  while [ "$tries" -lt 30 ]; do
    if curl -s "http://localhost:${PORT}/v1/health" >/dev/null 2>&1; then
      healthy="1"
      break
    fi
    if ! kill -0 "$server_pid" 2>/dev/null; then
      break
    fi
    tries=$((tries + 1))
    sleep 1
  done

  if [ "$healthy" != "1" ]; then
    echo "    ✗ Health check failed — see $LOG_FILE"
    kill "$server_pid" 2>/dev/null
    [ -n "$API_SERVER_PID" ] && kill "$API_SERVER_PID" 2>/dev/null
    trap - INT TERM
    return 1
  fi

  echo "    ✓ Health check passed"
  echo ""
  echo "✓ All set — opening http://localhost:${PORT} ;-)"
  open "http://localhost:${PORT}"

  echo "==> Running — Ctrl+C stops the server(s) and returns to this menu"
  tail -f "$LOG_FILE" &
  local tail_pid=$!
  wait "$server_pid" 2>/dev/null
  kill "$tail_pid" 2>/dev/null
  [ -n "$API_SERVER_PID" ] && kill "$API_SERVER_PID" 2>/dev/null
  trap - INT TERM
}

# Shared by "First Time" and "Regular" — identical logic, only the caller's
# messaging differs. Always confirms dependencies, always applies
# migrations/seed data, always health-checks before opening the browser.
run_default_sequence() {
  echo "==> [1/6] Preflight checks"
  preflight

  if [ ! -f "$ENV_FILE" ]; then
    fail "lxc-apim/.env" \
      "This option never asks questions, so it needs credentials to already be saved." \
      "Run option 3 (Custom Run/Test Local) once to set the MySQL password — it writes $ENV_FILE, and options 1/2 will use it silently from then on."
  fi

  echo "==> [2/6] Loading toolchain"
  # shellcheck disable=SC1091
  source "$FRAMEWORKS_ROOT/android/env.sh"

  echo "==> [3/6] Dependencies"
  ensure_deps

  echo "==> [4/6] Database — migrate + seed + admin account (idempotent, safe to re-run)"
  ensure_db_ready

  echo "==> [5/6] lxc-api (best-effort, so the catalog's local link is live)"
  start_lxc_api_if_possible

  echo "==> [6/6] Server + health check"
  start_server_and_health_check
}

run_first_time() {
  echo ""
  echo "First-time run: confirming dependencies, applying database"
  echo "migrations + seed data, health-checking the server, then opening"
  echo "it in your browser."
  run_default_sequence
}

run_regular() {
  echo ""
  echo "Starting lxc-apim..."
  run_default_sequence
}

run_custom() {
  echo "==> [1/6] Preflight checks"
  preflight

  echo "==> [2/6] Loading toolchain"
  # shellcheck disable=SC1091
  source "$FRAMEWORKS_ROOT/android/env.sh"

  echo "==> [3/6] Dependencies"
  ensure_deps

  echo ""
  echo "==> Custom credentials for lxc-apim"
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
APIM_ENV=local
MYSQL_HOST=srv1878.hstgr.io
MYSQL_PORT=3306
MYSQL_DATABASE=u450600831_lxc_hlthapi_db
MYSQL_USER=${mysql_user}
MYSQL_PASSWORD=${mysql_password}
JWT_SECRET=${jwt_secret}
JWT_EXPIRES_IN=1h
EOF

  echo "==> Wrote $ENV_FILE"

  echo "==> [4/6] Database — migrate + seed + admin account (idempotent, safe to re-run)"
  ensure_db_ready

  echo "==> [5/6] lxc-api (best-effort, so the catalog's local link is live)"
  start_lxc_api_if_possible

  echo "==> [6/6] Server + health check"
  start_server_and_health_check
}

show_menu() {
  echo ""
  echo "========================================"
  echo " LXC-APIM"
  echo "========================================"
  echo " 1) First Time - Default Run/Test Local  (Dev APIM  — Remote DB)"
  echo " 2) Regular    - Default Run/Test Local  (Dev APIM  — Remote DB)"
  echo " 3) Custom Run/Test Local  (Dev APIM  — Remote DB)"
  echo " 4) Make Build to Publish (PROD APIM — local DB)"
  echo " q) Quit"
  echo "========================================"
}

main() {
  while true; do
    show_menu
    read -r -p "Choose an option: " choice
    case "$choice" in
      1)
        run_first_time
        ;;
      2)
        run_regular
        ;;
      3)
        run_custom
        ;;
      4)
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
