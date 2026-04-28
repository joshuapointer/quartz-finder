#!/bin/sh
set -eu

ROLE="${ROLE:-web}"

case "$ROLE" in
  web)
    echo "[entrypoint] starting web (next standalone)"
    exec node server.js
    ;;
  worker)
    echo "[entrypoint] starting scraper worker"
    cd /app/worker
    exec node_modules/.bin/tsx worker.mts
    ;;
  *)
    echo "[entrypoint] unknown ROLE=$ROLE (expected web|worker)" >&2
    exit 1
    ;;
esac
