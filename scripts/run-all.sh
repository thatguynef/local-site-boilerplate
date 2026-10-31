#!/usr/bin/env bash
# Build first (npm run verify does that), then serve the worker and run every check.
set -u
cd "$(dirname "$0")/.."

PORT="${VERIFY_PORT:-4329}"
export VERIFY_ORIGIN="${VERIFY_ORIGIN:-http://127.0.0.1:${PORT}}"
LOG="${TMPDIR:-/tmp}/local-site-preview.log"
: > "$LOG"

npx astro preview --host 127.0.0.1 --port "$PORT" >"$LOG" 2>&1 &
PREVIEW_PID=$!

cleanup() {
  if [ -n "${PREVIEW_PID:-}" ]; then
    pkill -TERM -P "$PREVIEW_PID" 2>/dev/null || true
    kill "$PREVIEW_PID" 2>/dev/null || true
    wait "$PREVIEW_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT

ready=0
for _ in $(seq 1 90); do
  if curl -sf -o /dev/null "$VERIFY_ORIGIN/"; then
    ready=1
    break
  fi
  if ! kill -0 "$PREVIEW_PID" 2>/dev/null; then
    echo "Preview exited before it was ready."
    cat "$LOG"
    exit 1
  fi
  if grep -q "failed to start" "$LOG"; then
    echo "Preview runtime failed to start."
    cat "$LOG"
    exit 1
  fi
  sleep 0.5
done

if [ "$ready" != 1 ]; then
  echo "Preview did not answer at $VERIFY_ORIGIN."
  cat "$LOG"
  exit 1
fi

status=0
for script in scripts/checks/*.mjs; do
  node "$script" || status=1
done
node evaluations/run.mjs || status=1
exit "$status"
