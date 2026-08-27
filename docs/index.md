---
layout: home

hero:
  name: Solar Cistern Sensor
  text: Low-power water-level monitoring
  tagline: ESPHome, FireBeetle 2 ESP32-C6, A02YYUW and optional BC327-40 power gating
  image:
    src: /logo.svg
    alt: Solar cistern sensor
  actions:
    - theme: brand
      text: Wiring reference
      link: /WIRING
    - theme: alt
      text: Deutsche Dokumentation
      link: /de/

features:
  - title: Solar powered
    details: Integrated battery charging and optional panel-voltage measurement.
  - title: Low power
    details: The optional BC327-40 disconnects the A02YYUW after the seven-second measurement window.
  - title: Home Assistant
    details: Publishes volume, distance, battery charge and solar voltage through ESPHome.
---

## Start here

1. Choose direct sensor power or optional BC327-40 power gating.
2. Follow the [authoritative wiring reference](/WIRING).
3. Copy `secrets.yaml.example` to `secrets.yaml`.
4. Validate and flash the ESPHome configuration.

```bash
pip install esphome
esphome config wassertank-sensor.yaml
esphome run wassertank-sensor.yaml
```

::: warning 6V solar panel
The FireBeetle documentation specifies a 5V DC or 5V solar input. Measure a nominal 6V panel's open-circuit voltage in bright sun and verify it against the exact board revision before connecting VIN.
:::

## Power estimate

Seven seconds is the switched sensor window, not necessarily the complete controller wake time. The documentation includes lower-bound, network-timeout, and OTA scenarios. Measure actual wake time for a reliable installation estimate.

[Read the wiring and power calculations](/WIRING)
