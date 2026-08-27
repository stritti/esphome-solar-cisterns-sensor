# Solarbetriebener Zisternen-Füllstandssensor

[English](README.md) | **Deutsch**

ESPHome-Projekt zur solarbetriebenen Füllstandsmessung mit einem DFRobot FireBeetle 2 ESP32-C6 und dem wasserdichten Ultraschallsensor A02YYUW. Das Gerät misst Füllstand, Wasservolumen, Batterie- und Solarspannung und nutzt Deep Sleep für einen niedrigen Energieverbrauch.

## Funktionen

- Füllstand und Entfernung über A02YYUW mit UART
- Volumenberechnung für runde und rechteckige Behälter
- Batterieüberwachung über den internen Spannungsteiler des FireBeetle
- optionale Solarpanel-Spannungsmessung über GPIO1
- dynamische Schlafdauer über Home Assistant
- OTA-Aktualisierung und HTTP-Firmware-Updates
- optionales Abschalten des A02YYUW mit einem BC327-40
- Schutz bei kritischer Batteriespannung

## Benötigte Bauteile

| Nr. | Bauteil | Anzahl | Verwendung |
|---:|---|---:|---|
| 1 | DFRobot FireBeetle 2 ESP32-C6, DFR1075 | 1 | Controller, Ladeelektronik und Batterieüberwachung |
| 2 | A02YYUW Ultraschallsensor | 1 | Abstandsmessung, UART, IP67 |
| 3 | geschützte Li-Ion-Zelle 3,7 V | 1 | Energieversorgung |
| 4 | Batteriehalter mit PH2.0-Stecker | 1 | Anschluss an den FireBeetle |
| 5 | BC327-40, optional | 1 | Abschalten des Sensors im Deep Sleep |
| 6 | Widerstand 4,7 kΩ, optional | 1 | GPIO21 zur Basis des BC327-40 |
| 7 | Widerstand 10 kΩ | 2 | einer für den Solarteiler, der zweite optional als Basis-Pull-up |
| 8 | Widerstand 33 kΩ | 1 | oberer Widerstand des Solarteilers |
| 9 | Lochrasterplatine oder Breadboard | 1 | Aufbau |
| 10 | wetterfestes Gehäuse | 1 | Außeneinsatz |
| 11 | Solarpanel | optional | Laden über VIN |

## Verkabelung

Die verbindliche deutschsprachige Verdrahtungsanleitung steht in [docs/VERKABELUNG.md](docs/VERKABELUNG.md). Die englische Referenz befindet sich in [docs/WIRING.md](docs/WIRING.md).

![Verbindlicher Verdrahtungsplan](docs/wiring.svg)

### Variante A: einfacher Aufbau

- A02YYUW VCC direkt mit 3V3 verbinden
- GPIO21 nicht anschließen
- BC327-40 sowie 4,7-kΩ- und zusätzlicher 10-kΩ-Widerstand entfallen
- der Sensor bleibt im Deep Sleep eingeschaltet und benötigt bis zu 8 mA durchschnittlich

### Variante B: stromsparender Aufbau

- BC327-40 Emitter an 3V3
- BC327-40 Collector an A02YYUW VCC
- GPIO21 über 4,7 kΩ an die Basis
- 10 kΩ zwischen Basis und 3V3
- GPIO21 LOW schaltet den Sensor ein
- GPIO21 HIGH oder hochohmig schaltet den Sensor aus

Die Pinreihenfolge des BC327-40 muss anhand des Datenblatts des tatsächlich gekauften Herstellers geprüft werden.

## Einsparung durch den optionalen BC327-40

DFRobot spezifiziert für den A02YYUW bis zu 8 mA durchschnittliche Stromaufnahme. Die Standardkonfiguration misst alle 30 Minuten. Der Sensor ist dabei fünf Sekunden zum Aufwärmen und zwei Sekunden zur Verarbeitung eingeschaltet. Die Firmware schaltet ihn anschließend vor WLAN-Verbindung, Update-Prüfung und OTA-Fenster aus.

| Aufbau | Sensorzeit pro Tag | Verbrauch an 3,3 V | Energie pro Tag |
|---|---:|---:|---:|
| direkte Versorgung ohne Abschaltung | 24 Stunden | bis 192 mAh | bis 0,634 Wh |
| mit BC327-40 | 336 Sekunden | etwa 0,80 mAh einschließlich Basisstrom | etwa 0,0026 Wh |
| **Einsparung** | | **etwa 191 mAh pro Tag** | **etwa 0,631 Wh pro Tag, 99,6 %** |

Annahmen: 48 Messungen täglich, sieben Sekunden Einschaltzeit, 8 mA Sensorstrom und ungefähr 0,55 mA Basisstrom. Der Basisstrom ergibt sich aus `(3,3 V - 0,7 V) / 4,7 kΩ`. Die Rechnung betrachtet nur Sensor und Schalttransistor.

## Gesamtverbrauch und 1-W-Solarpanel

Die folgende Abschätzung verwendet ungefähr 60 mA während der sieben Sekunden langen aktiven Phase. DFRobot nennt für den FireBeetle 16 µA Deep-Sleep-Strom bei Revision 1.0 und 36 µA bei Revision 1.2.

| Anteil | täglicher Verbrauch |
|---|---:|
| 48 aktive Phasen × 7 s × ungefähr 60 mA | ungefähr 5,60 mAh |
| restliche 23,91 Stunden mit 16 bis 36 µA | ungefähr 0,38 bis 0,86 mAh |
| **Gesamt mit BC327-40** | **ungefähr 6,0 bis 6,5 mAh pro Tag** |

Bei 3,7 V Batteriespannung entsprechen 6,0 bis 6,5 mAh ungefähr 22 bis 24 mWh täglich. Schlechte WLAN-Verbindung, wiederholte Verbindungsversuche, OTA-Fenster, Kälte, Ladeverluste und Reglerverluste erhöhen den realen Verbrauch.

Ein Panel mit 1 W liefert theoretisch 1 Wh je Stunde bei seinem Nennarbeitspunkt. Für 22 bis 24 mWh wären ideal etwa 1,5 Minuten volle Nennleistung nötig. Unter realen Bedingungen sind mehrere Minuten kräftige Sonne anzusetzen. Energetisch ist ein 1-W-Panel für diesen Messzyklus ausreichend.

Ohne BC327-40 benötigt allein der dauerhaft versorgte Sensor bis zu 0,634 Wh täglich. Das entspricht bei einem 1-W-Panel 38 Minuten idealer Nennleistung oder ungefähr 45 bis 55 Minuten unter Berücksichtigung typischer Wandlungsverluste.

### Sicherheitshinweis zum 6-V-Panel

DFRobot spezifiziert VIN für 5 V Gleichspannung oder ein 5-V-Solarpanel. Ein als 6 V bezeichnetes Panel kann im Leerlauf deutlich mehr als 6 V erzeugen. Vor dem Anschluss:

1. Panel von der Schaltung trennen.
2. Leerlaufspannung bei kräftiger Sonne messen.
3. Maximalwert mit der zulässigen Eingangsspannung der konkreten FireBeetle-Revision vergleichen.
4. Nicht direkt an VIN anschließen, solange die Verträglichkeit nicht bestätigt ist.

Der 33-kΩ-/10-kΩ-Spannungsteiler kann 6 V an GPIO1 messen. Das bedeutet nicht, dass VIN dieselbe Spannung sicher verträgt.

## Zentrale Anschlüsse

| Funktion | FireBeetle | Gegenstelle |
|---|---|---|
| Sensorausgabemodus | geschaltete Sensorversorgung | A02YYUW RX; HIGH bei eingeschaltetem Sensor wählt geglättete Ausgabe |
| UART empfangen | GPIO17 / RX | A02YYUW TX; der Controller empfängt nur |
| Masse | GND | A02YYUW GND und Solar GND |
| Batterie | PH2.0 | geschützte Li-Ion-Zelle, Polarität prüfen |
| Solar laden | VIN | laut Hersteller 5-V-Solarpanel |
| Solar messen | GPIO1 | Mittelpunkt aus 33 kΩ zu Solar+ und 10 kΩ zu GND |
| Sensor schalten | GPIO21 | über 4,7 kΩ zur BC327-40-Basis |

## Software einrichten

### Voraussetzungen

```bash
pip install esphome
git clone https://github.com/stritti/esphome-solar-cisterns-sensor.git
cd esphome-solar-cisterns-sensor
cp secrets.yaml.example secrets.yaml
```

Erforderliche Einträge in `secrets.yaml`:

```yaml
wifi_ssid: "WLAN-NAME"
wifi_password: "WLAN-PASSWORT"
api_encryption_key: "BASE64-SCHLUESSEL"
```

Konfiguration prüfen und übertragen:

```bash
esphome config wassertank-sensor.yaml
esphome run wassertank-sensor.yaml
```

## Wichtige Konfigurationswerte

| Variable | Bedeutung | Standard |
|---|---|---|
| `DEBUG_MODE` | `DEBUG` bleibt wach, `NONE` nutzt Deep Sleep | `NONE` |
| `SENSOR_POWER_PIN` | Steuerung der optionalen BC327-40-Schaltung | `GPIO21` |
| `BATTERY_ADC_PIN` | interne Batteriemessung | `GPIO0` |
| `SOLAR_ADC_PIN` | Messung des Solarteilers | `GPIO1` |
| `SOLAR_VOLTAGE_DIVIDER` | Faktor des 33-kΩ-/10-kΩ-Teilers | `4.3` |
| `TANK_TYPE` | `ROUND` oder `RECTANGLE` | `RECTANGLE` |
| `DEFAULT_SLEEP_MINUTES` | Standardintervall | `30` |
| `ULTRASONIC_WARMUP_TIME` | Sensor-Aufwärmzeit | `5` |
| `MEASUREMENT_PROCESSING_TIME` | Verarbeitungszeit | `2` |

Bei Variante A bleibt GPIO21 unbeschaltet. Die Schaltbefehle der Firmware sind dann wirkungslos, beeinträchtigen die Messung aber nicht.

## Home Assistant

Für die dynamische Schlafdauer wird folgender Helfer erwartet:

```yaml
input_number:
  wassertank_schlafdauer:
    name: "Wassertank Schlafdauer"
    initial: 30
    min: 1
    max: 1440
    step: 1
    unit_of_measurement: "min"
```

Erzeugte Entitäten:

- Wassertank Inhalt
- Wassertank Distanz
- Wassertank Batterie Spannung
- Wassertank Batterie Ladegrad
- Wassertank Solarzelle Spannung
- Wassertank OTA Wake Lock
- Wassertank Firmware

## Batterie- und Solarmessung

Der FireBeetle besitzt einen internen 1:1-Batteriespannungsteiler an GPIO0:

```yaml
attenuation: 12db
filters:
  - multiply: 2.0
```

Der externe Solarteiler besteht aus 33 kΩ oben und 10 kΩ gegen GND. Sein Faktor beträgt `(33 + 10) / 10 = 4,3`:

- 5,0 V am Panel ergeben ungefähr 1,16 V an GPIO1
- 6,0 V am Panel ergeben ungefähr 1,40 V an GPIO1
- GPIO1 dient nur zur Messung
- geladen wird getrennt über VIN

## OTA-Aktualisierung

Das Gerät kann bei ausreichender Solarleistung ein konfigurierbares OTA-Fenster öffnen und eine HTTP-Firmware-Manifestdatei prüfen. Der A02YYUW ist während dieser Zeit bereits ausgeschaltet.

Die erste Installation muss per USB oder regulärem ESPHome-Upload erfolgen. Automatische HTTP-Aktualisierungen funktionieren erst mit einer passenden Firmwarepartitionierung und erreichbarer Manifestdatei.

## Prüfung vor dem Einschalten

1. USB, Batterie und Solarpanel trennen.
2. Variante A oder B eindeutig wählen.
3. Batteriepolarität am PH2.0-Anschluss prüfen.
4. A02YYUW TX mit GPIO17/RX verbinden. A02YYUW RX an die geschaltete Sensorversorgung anschließen, nicht an GPIO16.
5. Diese RX-Verbindung verhindert eine Rückspeisung des ausgeschalteten Sensors durch einen HIGH-Pegel des Controllers.
6. Bei Variante B Emitter, Basis und Collector anhand des Herstellerdatenblatts prüfen.
7. Bei Variante B 4,7 kΩ zwischen GPIO21 und Basis sowie 10 kΩ zwischen Basis und 3V3 prüfen.
8. Solarteiler prüfen: 33 kΩ von Solar+ zu GPIO1, 10 kΩ von GPIO1 zu GND.
9. 6-V-Panel erst nach Messung und Bewertung seiner Leerlaufspannung an VIN anschließen.
10. Zuerst über USB testen.

## Quellen

- [DFRobot FireBeetle 2 ESP32-C6](https://wiki.dfrobot.com/dfr1075/)
- [DFRobot Batteriemessung](https://wiki.dfrobot.com/dfr1075/docs/17359)
- [DFRobot A02YYUW](https://wiki.dfrobot.com/sen0311/)
- [ESPHome ADC-Sensor](https://esphome.io/components/sensor/adc/)
- [onsemi BC327 / BC327-40 Datenblatt](https://www.onsemi.com/pdf/datasheet/bc327-d.pdf)
