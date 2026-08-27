---
name: esphome-validation
description: Validate and compile this repository's ESPHome configuration after YAML, component, dependency, secrets-example, or CI changes.
---

# ESPHome Validation

Use the repository's validation script instead of assembling ESPHome commands ad hoc.

1. Preserve an existing `secrets.yaml`. If it is absent, copy `secrets.yaml.example` to `secrets.yaml`; never put real credentials in tracked files.
2. During configuration work, run `./scripts/validate-esphome.sh --config-only` for fast schema validation.
3. Before declaring an ESPHome-related change complete, run `./scripts/validate-esphome.sh` for a full firmware compile.
4. Report the exact failed command and first actionable error if validation cannot complete. Do not treat `--only-generate` as equivalent to a successful full compile.

The project pins ESPHome 2026.8.0 in CI to match `esphome.min_version`. Use that version when reproducing CI locally. `esphome check` is not a valid replacement for `esphome config`.

When changing `.github/workflows/validate-esphome.yml`, keep permissions read-only, retain pull-request and `main` validation, and keep configuration, example secrets, script, and workflow changes in the path filters.
