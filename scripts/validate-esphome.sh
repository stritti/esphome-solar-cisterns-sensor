#!/usr/bin/env bash
set -euo pipefail

repository_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${repository_root}"

config_file="wassertank-sensor.yaml"
config_only=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --config-only)
      config_only=true
      shift
      ;;
    --config)
      if [[ $# -lt 2 ]]; then
        echo "Missing value for --config" >&2
        exit 2
      fi
      config_file="$2"
      shift 2
      ;;
    -h|--help)
      echo "Usage: $0 [--config-only] [--config PATH]"
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 2
      ;;
  esac
done

if ! command -v esphome >/dev/null 2>&1; then
  echo "ESPHome is not installed. Install ESPHome 2026.8.0 before running this script." >&2
  exit 127
fi

if [[ ! -f "${config_file}" ]]; then
  echo "ESPHome configuration not found: ${config_file}" >&2
  exit 2
fi

if [[ ! -f secrets.yaml ]]; then
  echo "secrets.yaml is missing. Copy secrets.yaml.example to secrets.yaml first." >&2
  exit 2
fi

esphome version
esphome config "${config_file}"

if [[ "${config_only}" == false ]]; then
  esphome compile "${config_file}"
fi
