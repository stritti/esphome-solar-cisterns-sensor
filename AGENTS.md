# AGENTS.md — esphome-solar-cisterns-sensor

## Project Overview
ESPHome project for solar-powered water tank level sensing using DFRobot FireBeetle 2 ESP32-C6 + A02YYUW ultrasonic sensor. Measures tank level (liters/meters) and battery voltage with deep-sleep for ultra-low power.

## Key Files
- `wassertank-sensor.yaml` — main ESPHome configuration
- `README.md` — project overview and setup
- `docs/WIRING.md` and `docs/wiring.svg` — authoritative hardware wiring reference
- `.haft/` — Haft project metadata (do not edit)

## Critical Constraints
- **GPIO16 and GPIO17 are reserved** for UART (ultrasonic sensor) — never reuse
- **SENSOR_POWER_PIN default GPIO21** — BC327-40 Base connects to GPIO21 through 4.7kΩ and uses a 10kΩ pull-up to 3V3; ESPHome pin is inverted (physical LOW = sensor ON)
- **BATTERY_ADC_PIN default GPIO0** — FireBeetle on-board divider requires `attenuation: 12db` and `multiply: 2.0`
- **TANK_TYPE must match dimensions**: ROUND needs TANK_RADIUS, RECTANGLE needs TANK_LENGTH + TANK_WIDTH

## Making Changes
Edit `substitutions:` in `wassertank-sensor.yaml`:
- `DEBUG_MODE`: `"DEBUG"` (awake, USB logging) or `"NONE"` (deep-sleep)
- `TANK_TYPE`: `"ROUND"` or `"RECTANGLE"`
- `TANK_TOTAL_DEPTH`: sensor-to-bottom distance (meters)
- `TANK_MAX_LITERS`: safety ceiling
- `TANK_RADIUS`: for ROUND tanks (meters)
- `TANK_LENGTH`, `TANK_WIDTH`: for RECTANGLE tanks (meters)
- `SENSOR_POWER_PIN`, `BATTERY_ADC_PIN`: GPIO defaults above
- `WIFI_STATIC_IP`, `WIFI_GATEWAY`, `WIFI_SUBNET`: network config

Level→liters conversion is in the `a02yyuw` sensor's `on_value > lambda:` block (lines 117-149).

## Home Assistant Integration
- Sleep duration is controlled by `input_number.wassertank_schlafdauer` entity — **must exist in HA** when using `DEBUG_MODE: "NONE"`
- Creates 3 sensors: Wassertank Inhalt (liters), distance (meters), battery voltage (V)

## Verification
```bash
pip install esphome
esphome check wassertank-sensor.yaml
```
Manual review: ensure all `${VAR}` in lambda have corresponding substitution definitions.

## Commands
- `esphome check wassertank-sensor.yaml` — validate config
- `cat wassertank-sensor.yaml` — view current configuration
