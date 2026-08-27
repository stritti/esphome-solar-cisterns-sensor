# Verbindliche Verdrahtungsreferenz

[English](WIRING.md) | **Deutsch**

Diese Datei ist die verbindliche deutschsprachige Verdrahtungsreferenz. Die Pinbelegung in `../wassertank-sensor.yaml` muss mit dieser Beschreibung übereinstimmen.

![Vollständiger Verdrahtungsplan](wiring.svg)

## Versorgungsvariante wählen

### Variante A: einfacher Aufbau ohne BC327-40

A02YYUW VCC direkt mit 3V3 des FireBeetle verbinden. GPIO21 bleibt unbeschaltet. Der Sensor funktioniert normal, bleibt aber im Deep Sleep versorgt und benötigt laut DFRobot bis zu 8 mA durchschnittlich.

### Variante B: stromsparender Aufbau mit BC327-40

Die Anschlüsse 1 bis 4 aus der folgenden Tabelle verwenden. Diese Variante ist für Batterie- und Solarbetrieb empfohlen. Das Schaltbild zeigt Variante B.

## Anschlüsse

Die Anschlüsse 1 bis 4 gelten nur für Variante B. Alle weiteren Anschlüsse gelten für beide Varianten.

| Nr. | Von | Nach | Zweck |
|---:|---|---|---|
| 1 | FireBeetle 3V3 | BC327-40 Emitter | Versorgung des geschalteten Sensorzweigs |
| 2 | FireBeetle GPIO21 | 4,7 kΩ → BC327-40 Basis | begrenzt den Basisstrom, Steuerung aktiv LOW |
| 3 | 10 kΩ | BC327-40 Basis ↔ 3V3 | Pull-up hält den Sensor bei hochohmigem GPIO ausgeschaltet |
| 4 | BC327-40 Collector | A02YYUW VCC | geschaltete 3,3-V-Sensorversorgung |
| 5 | FireBeetle GND | A02YYUW GND | gemeinsame Masse |
| 6 | geschaltete Sensorversorgung | A02YYUW RX | HIGH bei eingeschaltetem Sensor wählt geglättete Ausgabe; fällt beim Abschalten zusammen mit VCC ab |
| 7 | A02YYUW TX | FireBeetle GPIO17 / RX | UART-Abstandsdaten mit 9600 Baud; Controller empfängt nur |
| 8 | geschützte einzelne Li-Ion-Zelle | FireBeetle PH2.0 | Hauptbatterie, Polarität anhand der Platinenbeschriftung prüfen |
| 9 | Solarpanel Plus | FireBeetle VIN | Eingang der integrierten Solar-Ladeelektronik |
| 10 | Solarpanel GND | FireBeetle GND | Lade- und Messreferenz |
| 11 | Solarpanel Plus | 33 kΩ → Teilermittelpunkt | oberer Widerstand der Solarmessung |
| 12 | Teilermittelpunkt | GPIO1 und 10 kΩ → GND | Solar-ADC und unterer Widerstand |

## Schaltlogik des BC327-40

Der BC327-40 ist ein PNP-Transistor im anfängerfreundlichen TO-92-Gehäuse. Die Emitter-, Basis- und Collector-Reihenfolge muss vor dem Aufbau anhand des Datenblatts des konkreten Herstellers geprüft werden.

| ESPHome-Schaltzustand | GPIO21 physisch | Basiszustand | Sensor |
|---|---:|---|---|
| EIN | LOW | Basisstrom über 4,7 kΩ | versorgt |
| AUS | HIGH | Basis ungefähr auf Emitterspannung | aus |
| Start oder Deep Sleep, GPIO hochohmig | durch 10 kΩ auf 3V3 | Basis ungefähr auf Emitterspannung | aus |

Der 4,7-kΩ-Basiswiderstand darf nicht entfallen. Ein Basis-Pull-down wäre falsch, weil er den PNP-Transistor während Start und Deep Sleep einschalten würde.

## Energieeinsparung

Bei 30 Minuten Messintervall entstehen täglich 48 Messzyklen. Die Firmware versorgt den Sensor für fünf Sekunden Aufwärmzeit und zwei Sekunden Verarbeitung. Anschließend wird er vor WLAN, Manifestprüfung und OTA-Fenster abgeschaltet.

| Aufbau | Rechnung | Verbrauch an 3,3 V | Energie pro Tag |
|---|---|---:|---:|
| ohne Abschaltung | 8 mA × 24 h | bis 192 mAh | bis 0,634 Wh |
| mit BC327-40 | ungefähr 8,55 mA × 336 s | etwa 0,80 mAh | etwa 0,0026 Wh |
| **Einsparung** | | **etwa 191 mAh** | **etwa 0,631 Wh, 99,6 %** |

Die Rechnung erfasst Sensor und Basisstrom. FireBeetle, WLAN, Ladeelektronik, Wandlungsverluste und Batterie-Selbstentladung kommen hinzu.

## 6-V-/1-W-Solarpanel

Ein 1-W-Panel ist energetisch für den dokumentierten Messzyklus ausreichend. Mit BC327-40 liegt der abgeschätzte Gesamtbedarf bei ungefähr 22 bis 24 mWh täglich. Ohne Abschaltung benötigt allein der A02YYUW bis zu 0,634 Wh täglich.

DFRobot spezifiziert VIN für 5 V Gleichspannung oder ein 5-V-Solarpanel. Ein nominales 6-V-Panel kann im Leerlauf mehr als 6 V erzeugen. Die Leerlaufspannung muss bei kräftiger Sonne gemessen und mit der zulässigen Eingangsspannung der konkreten FireBeetle-Revision verglichen werden.

## Solarteiler

| Position | Widerstand | Verbindung |
|---|---:|---|
| oben | 33 kΩ | Solar+ zum Teilermittelpunkt |
| unten | 10 kΩ | Teilermittelpunkt zu GND |
| Mittelpunkt | entfällt | GPIO1 |

Faktor: `(33 kΩ + 10 kΩ) / 10 kΩ = 4,3`.

- 5,0 V ergeben ungefähr 1,16 V an GPIO1
- 6,0 V ergeben ungefähr 1,40 V an GPIO1
- GPIO1 misst ausschließlich
- Solar+ niemals direkt mit GPIO1 verbinden
- VIN dient getrennt zum Laden

## Batteriemessung

Der FireBeetle besitzt an GPIO0 einen internen 1:1-Spannungsteiler. ESPHome verwendet deshalb:

```yaml
attenuation: 12db
filters:
  - multiply: 2.0
```

Keinen zusätzlichen Spannungsteiler an GPIO0 anschließen.

## Prüfung vor dem Einschalten

1. USB, Batterie und Solarpanel trennen.
2. Variante A oder B auswählen und nicht miteinander kombinieren.
3. Bei Variante B Emitter an 3V3 und Collector an Sensor VCC prüfen.
4. Bei Variante B 4,7 kΩ zwischen GPIO21 und Basis sowie 10 kΩ zwischen Basis und 3V3 prüfen.
5. Bei Variante B die Pinreihenfolge des BC327-40 anhand des Herstellerdatenblatts prüfen.
6. Durchgängige gemeinsame Masse kontrollieren.
7. A02YYUW TX → GPIO17/RX prüfen. A02YYUW RX muss an der geschalteten Sensorversorgung liegen und darf nicht von GPIO16 angesteuert werden.
8. Dadurch fällt RX beim Abschalten gemeinsam mit VCC ab und kann den Sensor nicht rückspeisen.
9. Solarteiler prüfen: 33 kΩ oberhalb und 10 kΩ unterhalb von GPIO1.
10. PH2.0-Polarität anhand der Platinenbeschriftung prüfen.
11. Zuerst über USB testen.
12. Bei Variante B muss GPIO21 während der Messung LOW und danach HIGH sein.
13. Vor Anschluss eines 6-V-Panels dessen Leerlaufspannung bei kräftiger Sonne messen.

## Quellen

- [DFRobot FireBeetle 2 ESP32-C6](https://wiki.dfrobot.com/dfr1075/)
- [DFRobot Batteriemessung](https://wiki.dfrobot.com/dfr1075/docs/17359)
- [DFRobot A02YYUW](https://wiki.dfrobot.com/sen0311/)
- [ESPHome ADC-Sensor](https://esphome.io/components/sensor/adc/)
- [onsemi BC327 / BC327-40 Datenblatt](https://www.onsemi.com/pdf/datasheet/bc327-d.pdf)
