# Wiring reference

This file is the single authoritative wiring reference for the project. The firmware pin definitions in `wassertank-sensor.yaml` must match this document.

![Complete wiring diagram](wiring.svg)

## Connections

| No. | From | To | Purpose |
|---:|---|---|---|
| 1 | FireBeetle 3V3 | BC327-40 Emitter | Supply for the switched sensor rail |
| 2 | FireBeetle GPIO21 | 4.7kΩ resistor → BC327-40 Base | Limits the Base current; active-low sensor control |
| 3 | 10kΩ resistor | BC327-40 Base ↔ 3V3 | Pull-up; keeps the sensor off while the GPIO is high-impedance |
| 4 | BC327-40 Collector | A02YYUW VCC | Switched 3.3V sensor supply |
| 5 | FireBeetle GND | A02YYUW GND | Common ground |
| 6 | FireBeetle GPIO16 / TX | A02YYUW RX | UART transmit and sensor output-mode selection |
| 7 | A02YYUW TX | FireBeetle GPIO17 / RX | UART distance data at 9600 baud |
| 8 | Protected 1-cell Li-ion | FireBeetle PH2.0 | Main battery; verify polarity against the board labels |
| 9 | Nominal 5V solar panel + | FireBeetle VIN | Input to the board’s integrated solar charger |
| 10 | Solar panel GND | FireBeetle GND | Charging and measurement reference |
| 11 | Solar panel + | 33kΩ → divider midpoint | Upper resistor of the solar monitor |
| 12 | Divider midpoint | FireBeetle GPIO1 and 10kΩ → GND | Solar ADC input and lower resistor |

## Transistor logic

The BC327-40 is a PNP transistor used as a high-side switch. Its TO-92 package is suitable for breadboards and through-hole prototyping. Verify the Emitter, Base, and Collector pin order against the datasheet for the exact manufacturer before wiring.

| ESPHome switch state | Physical GPIO21 | BC327-40 Base | Sensor |
|---|---:|---|---|
| ON | LOW | Base current through 4.7kΩ | Powered |
| OFF | HIGH | Approximately equal to Emitter voltage | Off |
| Boot or deep sleep, GPIO high-impedance | Held at 3V3 by 10kΩ pull-up | Approximately equal to Emitter voltage | Off |

Do not omit the 4.7kΩ Base resistor: directly connecting the Base to GPIO21 would allow excessive GPIO and Base current. A pull-down on the Base would turn the PNP transistor on during boot and deep sleep and must not be used.

## Solar divider

| Position | Resistor | Connection |
|---|---:|---|
| Upper | 33kΩ | Solar+ to divider midpoint |
| Lower | 10kΩ | Divider midpoint to GND |
| Midpoint | n/a | GPIO1 |

The scale factor is `(33k + 10k) / 10k = 4.3`. A 5.0V panel produces about 1.16V at GPIO1. The ESPHome ADC therefore uses `attenuation: 12db` and `multiply: 4.3`.

GPIO1 measures the panel voltage only. Charging uses the separate VIN connection. Never connect Solar+ directly to GPIO1.

## Battery measurement

The FireBeetle 2 ESP32-C6 contains its own battery divider on GPIO0. DFRobot’s example multiplies the GPIO0 voltage by 2. A full 4.2V cell therefore produces about 2.1V at the ADC pin. The ESPHome ADC uses `attenuation: 12db` and `multiply: 2.0`.

Do not add another divider to GPIO0.

## Checks before power-up

1. Disconnect USB, battery, and solar panel.
2. Verify that the BC327-40 Emitter connects to 3V3 and Collector connects to sensor VCC.
3. Verify 4.7kΩ between GPIO21 and Base, and 10kΩ between Base and 3V3. There must be no Base-to-GND pull-down.
4. Verify the BC327-40 pin order against the datasheet for the purchased manufacturer.
5. Verify continuity of all GND connections.
6. Verify that the solar divider is 33kΩ above GPIO1 and 10kΩ below GPIO1.
7. Verify the PH2.0 polarity against the `+` and `-` labels on the FireBeetle board.
8. Power from USB first. In debug mode, GPIO21 must be LOW while measuring and HIGH after the sensor is switched off.
9. Confirm with a multimeter that GPIO0 and GPIO1 remain within the ESP32-C6 ADC input range.

## Primary sources

- [DFRobot FireBeetle 2 ESP32-C6 documentation](https://wiki.dfrobot.com/dfr1075/)
- [DFRobot FireBeetle battery-voltage example](https://wiki.dfrobot.com/dfr1075/docs/17359)
- [DFRobot A02YYUW documentation](https://wiki.dfrobot.com/sen0311/)
- [ESPHome ADC sensor documentation](https://esphome.io/components/sensor/adc/)
- [onsemi BC327 / BC327-40 datasheet](https://www.onsemi.com/pdf/datasheet/bc327-d.pdf)
