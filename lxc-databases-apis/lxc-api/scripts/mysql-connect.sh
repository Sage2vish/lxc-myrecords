#!/usr/bin/env bash
set -euo pipefail

if ! command -v mysql >/dev/null 2>&1; then
  echo "mysql client not found on PATH."
  echo "Install a MySQL client, then rerun this script."
  exit 1
fi

: "${MYSQL_HOST:?Set MYSQL_HOST first}"
: "${MYSQL_PORT:=3306}"
: "${MYSQL_DATABASE:?Set MYSQL_DATABASE first}"
: "${MYSQL_USER:?Set MYSQL_USER first}"

mysql -h "$MYSQL_HOST" -P "$MYSQL_PORT" -u "$MYSQL_USER" -p "$MYSQL_DATABASE"
