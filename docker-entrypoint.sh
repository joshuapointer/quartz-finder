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
    # Use the bundled node_modules built for this image
    export NODE_PATH=/app/worker_modules
    exec /app/worker_modules/.bin/tsx /app/worker.ts
    ;;
  *)
    echo "[entrypoint] unknown ROLE=$ROLE (expected web|worker)" >&2
    exit 1
    ;;
esac
