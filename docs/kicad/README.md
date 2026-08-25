# KiCad Source — Water Tank Sensor

**Source for the schematic:** `wassertank.kicad_sch` + `wassertank.kicad_pro`

- Open with **KiCad 7 / 8** (free): `File → Open Project → wassertank.kicad_pro`
- Contains: FireBeetle 2 ESP32-C6 (U1), A02YYUW (U2), IRLML6401 P-Channel High-Side (Q1, SOT-23), 10k pulldown (R1), voltage divider 10k (R2) + 33k (R3), 18650 Battery (BAT1), GND/+3V3 power flags
- **Important:** IRLML6401 is **P-Channel** (corrected, was incorrectly labeled N-Channel in old README). Source → 3V3, Drain → Sensor VCC, Gate → GPIO21 + 10k → GND
- Export: `File → Plot → SVG/PDF` generates `docs/schematic.svg` and `docs/schematic.pdf` (already in repo as vector export)
- ERC Check: `Inspect → Electrical Rules Checker` should be green (no open pins)

For changes: Edit in KiCad, then re-export and commit `docs/schematic.svg`/`pdf`.
