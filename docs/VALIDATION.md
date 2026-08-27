# ESPHome validation

The repository validates the ESPHome configuration and compiles the firmware in GitHub Actions. The workflow runs for relevant pull-request changes, relevant pushes to `main`, and manual dispatches.

## Validation levels

| Task | Purpose | Used in CI |
|---|---|---:|
| `esphome config` | Parses substitutions, secrets, component schemas, pins and configuration values | yes |
| `esphome compile --only-generate` | Generates the C++ source without running the complete toolchain | no |
| `esphome compile` | Validates, generates and compiles the complete firmware, including lambdas and dependencies | yes |

The full compile is the decisive check. It detects generated-C++, component, ESP-IDF and toolchain errors that configuration validation alone cannot find. `--only-generate` is useful during development but would duplicate part of the full CI compile.

## Run locally

Use ESPHome 2026.8.0, matching `esphome.min_version` and the pinned CI version:

```bash
python -m pip install "esphome==2026.8.0"
cp secrets.yaml.example secrets.yaml
./scripts/validate-esphome.sh
```

For a faster configuration-only check:

```bash
./scripts/validate-esphome.sh --config-only
```

The script never creates or overwrites `secrets.yaml`. Real credentials remain local and ignored by Git. GitHub Actions explicitly copies `secrets.yaml.example`, whose placeholder values are sufficient for a build without exposing credentials.

## GitHub Actions

`.github/workflows/validate-esphome.yml` uses Python 3.12 and pins ESPHome to 2026.8.0 for reproducible results. It caches the ESPHome build directory, ESPHome tool cache and PlatformIO toolchain between compatible runs. The job requires only read access to repository contents.

Changes to `wassertank-sensor.yaml`, `secrets.yaml.example`, the validation script or the workflow trigger the check. Documentation-only changes do not rebuild the firmware.

## Sources

- [ESPHome command-line interface](https://esphome.io/guides/cli/)
- [ESPHome installation](https://esphome.io/install/getting-started/)
