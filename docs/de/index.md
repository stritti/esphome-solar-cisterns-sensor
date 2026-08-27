---
layout: home

hero:
  name: Solar-Zisternensensor
  text: Stromsparende Füllstandsmessung
  tagline: ESPHome, FireBeetle 2 ESP32-C6, A02YYUW und optionales Power-Gating mit BC327-40
  image:
    src: /logo.svg
    alt: Solar-Zisternensensor
  actions:
    - theme: brand
      text: Verkabelung
      link: /de/WIRING
    - theme: alt
      text: English documentation
      link: /

features:
  - title: Solarbetrieb
    details: Integrierte Batterieladung und optionale Messung der Panelspannung.
  - title: Niedriger Verbrauch
    details: Der optionale BC327-40 trennt den A02YYUW nach dem sieben Sekunden langen Messfenster.
  - title: Home Assistant
    details: ESPHome überträgt Volumen, Entfernung, Batterieladung und Solarspannung.
---

## Einstieg

1. Direkte Sensorversorgung oder optionales BC327-40-Power-Gating auswählen.
2. Die [verbindliche Verdrahtungsreferenz](/de/WIRING) umsetzen.
3. `secrets.yaml.example` nach `secrets.yaml` kopieren.
4. ESPHome-Konfiguration prüfen und übertragen.

```bash
pip install esphome
esphome config wassertank-sensor.yaml
esphome run wassertank-sensor.yaml
```

::: warning 6-V-Solarpanel
DFRobot spezifiziert einen 5-V-Gleichspannungs- beziehungsweise 5-V-Solareingang. Vor dem Anschluss eines nominalen 6-V-Panels dessen Leerlaufspannung bei kräftiger Sonne messen und mit der konkreten Boardrevision abgleichen.
:::

## Verbrauchsabschätzung

Sieben Sekunden bezeichnen das geschaltete Sensorfenster, nicht zwingend die gesamte Wachzeit des Controllers. Die Dokumentation enthält eine Untergrenze sowie Netzwerk-Timeout- und OTA-Szenarien. Für eine belastbare Anlagenbewertung muss die reale Wachzeit gemessen werden.

[Verkabelung und Verbrauchsrechnung lesen](/de/WIRING)
