# Fritzing / Breadboard

**Beginner-friendly build:** `breadboard.svg` shows the physical breadboard layout 1:1.

- **SVG:** `breadboard.svg` — vector, zoomable, printable (embedded in README). Colors = function (Yellow=RX, Green=TX, Red=VCC, Black=GND, Purple=Gate).
- **FZZ:** `breadboard.fzz` — Fritzing project (ZIP). Open with Fritzing 0.9+ → Breadboard / Schematic / PCB tabs. If Fritzing is not installed: the SVG is identical and sufficient.

Notes:
- Mind the breadboard trench (center is disconnected!).
- Keep wires < 30 cm, twist pairs, mount sensor vertically above water.
- MOSFET breakout: G → GPIO21 + 10k → GND, S → 3V3, D → Sensor VCC.
- Divider 10k (top) + 33k (GND) → GPIO1, factor 4.3 in `wassertank-sensor.yaml`.
