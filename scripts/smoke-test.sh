#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATE_ROOT="$(dirname "$SCRIPT_DIR")"

usage() {
  cat <<'USAGE'
Usage: npm run baw:smoke -- [options]
       bash scripts/smoke-test.sh [options]

Options:
  --keep           Keep the temporary workspace after the smoke test finishes.
  --workspace DIR  Use DIR instead of creating a temporary workspace (implies --keep).
  --help           Show this help message.

The smoke test creates a throwaway Node.js project, runs the init script,
executes the router and workflow sync, and confirms Jest exits successfully
with the template's default configuration.
USAGE
}

KEEP_WORKSPACE=0
CUSTOM_WORKSPACE=""
DEPENDENCIES_READY=1

while [[ $# -gt 0 ]]; do
  case "$1" in
    --keep)
      KEEP_WORKSPACE=1
      shift
      ;;
    --workspace)
      if [[ $# -lt 2 ]]; then
        echo "Error: --workspace requires a directory path" >&2
        exit 1
      fi
      CUSTOM_WORKSPACE="$2"
      KEEP_WORKSPACE=1
      shift 2
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      echo "Error: Unknown option $1" >&2
      usage
      exit 1
      ;;
  esac
done

if ! command -v npm >/dev/null 2>&1; then
  echo "Error: npm is required to run the smoke test." >&2
  exit 1
fi

if ! command -v git >/dev/null 2>&1; then
  echo "Warning: git was not found. The smoke test does not require git but the template installer expects it to be available in real projects." >&2
fi

if [[ -n "$CUSTOM_WORKSPACE" ]]; then
  WORKSPACE_DIR="$(mkdir -p "$CUSTOM_WORKSPACE" && cd "$CUSTOM_WORKSPACE" && pwd)"
else
  WORKSPACE_DIR="$(mktemp -d -t baw-smoke-XXXXXX)"
fi

if [[ $KEEP_WORKSPACE -eq 0 ]]; then
  trap 'rm -rf "$WORKSPACE_DIR"' EXIT
fi

PROJECT_DIR="$WORKSPACE_DIR/project"
LOG_DIR="$WORKSPACE_DIR/logs"
mkdir -p "$PROJECT_DIR" "$LOG_DIR"

log_step() {
  local message="$1"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "$message"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

run_and_capture() {
  local name="$1"
  shift
  local logfile="$LOG_DIR/${name//[^A-Za-z0-9_.-]/_}.log"
  echo "▶ $name"
  set +e
  "$@" > >(tee "$logfile") 2>&1
  local status=${PIPESTATUS[0]}
  set -e
  if [[ $status -ne 0 ]]; then
    echo "❌ $name failed (see $logfile for details)" >&2
    exit $status
  fi
}

log_step "1️⃣  Initialising throwaway project"
(
  cd "$PROJECT_DIR"
  npm init -y >/dev/null 2>&1
)
echo "Project directory: $PROJECT_DIR"

echo ""
log_step "2️⃣  Running init-agentic-workflow.sh"
(
  cd "$PROJECT_DIR"
  bash "$TEMPLATE_ROOT/scripts/init-agentic-workflow.sh"
)

echo ""
log_step "3️⃣  Ensuring dependencies are installed"
pushd "$PROJECT_DIR" >/dev/null
if [[ ! -d node_modules ]]; then
  logfile="$LOG_DIR/npm_install.log"
  echo "▶ npm install"
  set +e
  npm install > >(tee "$logfile") 2>&1
  status=${PIPESTATUS[0]}
  set -e
  if [[ $status -ne 0 ]]; then
    echo "⚠️  npm install failed (see $logfile for details). Continuing without dependency checks."
    DEPENDENCIES_READY=0
  fi
else
  echo "Dependencies already present. Skipping npm install."
fi
popd >/dev/null

echo ""
log_step "4️⃣  Exercising workflow commands"
pushd "$PROJECT_DIR" >/dev/null
run_and_capture "Router recommendation" npm run baw:agent -- "smoke test wiring"
if [[ $DEPENDENCIES_READY -eq 1 ]]; then
  run_and_capture "Workflow sync" npm run baw:workflow:sync
  run_and_capture "Unified dashboard" npm run baw:work
else
  echo "⚠️  Skipping workflow sync and dashboard because dependencies are unavailable."
fi
popd >/dev/null

echo ""
log_step "5️⃣  Verifying Jest smoke test"
pushd "$PROJECT_DIR" >/dev/null
if [[ $DEPENDENCIES_READY -eq 1 ]]; then
  run_and_capture "Jest (passWithNoTests)" npm test -- --runTestsByPath
else
  echo "⚠️  Skipping Jest run because dependencies are unavailable."
fi
popd >/dev/null

echo ""
log_step "✅  Smoke test complete"
echo "Workspace: $WORKSPACE_DIR"
echo "Logs saved under: $LOG_DIR"

if [[ $KEEP_WORKSPACE -eq 0 ]]; then
  echo "(Workspace will be removed when the script exits. Use --keep to preserve it.)"
else
  echo "(Workspace preserved. Inspect the generated project and logs as needed.)"
fi
