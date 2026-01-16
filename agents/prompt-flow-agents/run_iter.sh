#!/usr/bin/env bash
set -euo pipefail

# Minimal launcher: per-agent iteration prompt (from MD) + system prompt (agent.yaml)
# Usage: ./run_iter.sh

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KIMI_BIN="${KIMI_BIN:-$(command -v kimi || true)}"
AGENT_FILE="${BASE_DIR}/agent.yaml"
LOG_DIR="${BASE_DIR}/logs"

if [[ -z "${KIMI_BIN}" ]]; then
  echo "Error: 'kimi' binary not found in PATH. Set KIMI_BIN or install kimi CLI." >&2
  exit 1
fi
if [[ ! -f "${AGENT_FILE}" ]]; then
  echo "Agent file not found: ${AGENT_FILE}" >&2
  exit 1
fi

mkdir -p "${LOG_DIR}"

PIDS=""
cleanup() {
  if [[ -z "${PIDS}" ]]; then return; fi
  echo "Stopping instances..."
  for pid in ${PIDS}; do
    if kill -0 "${pid}" 2>/dev/null; then kill "${pid}" 2>/dev/null || true; fi
  done
  sleep 1
  for pid in ${PIDS}; do
    if kill -0 "${pid}" 2>/dev/null; then kill -9 "${pid}" 2>/dev/null || true; fi
  done
  wait ${PIDS} 2>/dev/null || true
}
trap cleanup EXIT INT TERM

launch() {
  local name="$1"
  local prompt_file="${BASE_DIR}/iter_${name}.md"
  local work_dir="${BASE_DIR}/work_${name}"
  local log_file="${LOG_DIR}/${name}.log"
  mkdir -p "${work_dir}"
  if [[ ! -f "${prompt_file}" ]]; then
    echo "Missing prompt file: ${prompt_file}" >&2
    return 1
  fi
  echo "Launching ${name} (Ralph infinite loop)" | tee -a "${log_file}"
  "${KIMI_BIN}" \
    --agent-file "${AGENT_FILE}" \
    --work-dir "${work_dir}" \
    --yolo \
    --max-ralph-iterations -1 \
    --thinking \
    --verbose \
    --prompt "$(cat "${prompt_file}")" \
    >> "${log_file}" 2>&1 &
  pid=$!
  if [[ -z "${PIDS}" ]]; then PIDS="${pid}"; else PIDS="${PIDS} ${pid}"; fi
  echo "  PID ${pid} (log: ${log_file})"
}

for name in kimi claude gpt gemini; do
  launch "${name}"
done

wait
