#!/bin/sh
set -eu

TEMPLATE="/usr/share/nginx/html/assets/env-config.js"

if [ -f "$TEMPLATE" ]; then
  TMP_FILE="${TEMPLATE}.tmp"
  envsubst < "$TEMPLATE" > "$TMP_FILE"
  mv "$TMP_FILE" "$TEMPLATE"
else
  echo "[warn] Runtime config template not found at $TEMPLATE" >&2
fi

exec nginx -g 'daemon off;'
