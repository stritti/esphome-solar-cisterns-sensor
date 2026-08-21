# Smart Wassertank-Sensor (Solar / Low-Power)

Dieses ESPHome-Projekt ermöglicht die präzise, stromsparende Messung des Füllstands von Wassertanks (z. B. IBC-Container oder Regentonnen). Es ist speziell für das Entwicklungsboard **DFRobot FireBeetle 2 ESP32-C6 (DFR1075)** und den Ultraschallsensor **A02YYUW** optimiert. 

Dank extremem Low-Power-Design (Deep Sleep) eignet sich das Projekt perfekt für den autarken Solar- oder Batteriebetrieb im Garten.

## 🚀 Features

*   **Universelle Tankberechnung:** Unterstützt runde Tanks (Zylinder) und eckige Tanks (Rechteck) direkt über Konfigurationsvariablen.
*   **Hardware-Batterieüberwachung:** Nutzt den bordeigenen Spannungsteiler der FireBeetle 2 C6 auf Pin `A0` (GPIO0) zur Überwachung der Akkuspannung.
*   **Drei Sensoren für Home Assistant:** Überträgt die berechneten *Liter*, den *Abstand (in Metern)* sowie die *Akkuspannung (in Volt)*.
*   **Dynamische Schlafdauer:** Die Deep-Sleep-Zeit wird direkt aus Home Assistant heraus gesteuert und bei jedem Aufwachen aktualisiert.
*   **Ultra-Low-Power:** 
    *   Statische IP-Adresse für WLAN-Verbindungszeiten unter 500 ms.
    *   Sofortiger Deep Sleep nach erfolgreicher Messung.
    *   Deaktivierbares Logging (`DEBUG_MODE`) für minimalen Stromverbrauch im Produktivbetrieb (~16–20 µA im Schlafmodus).

## 🛠 Hardware-Setup

### Komponenten
1.  **Board:** DFRobot FireBeetle 2 ESP32-C6 (DFR1075) <https://wiki.dfrobot.com/dfr1075>
2.  **Sensor:** A02YYUW (wasserdichter Ultraschallsensor mit UART-Schnittstelle)
3.  **Stromversorgung:** 3.7V Li-Ion / LiPo Akku am PH2.0-Anschluss (oder passendes Solar-Shield)

### Verkabelung
| Sensor (A02YYUW) | FireBeetle 2 ESP32-C6 | Beschreibung |
| :--- | :--- | :--- |
| **VCC (Rot)** | `GPIO21` (oder VCC)* | Stromversorgung Sensor |
| **GND (Schwarz)** | `GND` | Masse |
| **RX (Gelb)** | `GPIO16` (TX1) | Sende-Pin des ESP |
| **TX (Grün)** | `GPIO17` (RX1) | Empfangs-Pin des ESP |

*\*Hinweis: Wenn du den Sensor-Strom im Deep Sleep komplett kappen willst, um Energie zu sparen, schließe VCC des Sensors an einen GPIO (z.B. GPIO21) an. Der Sensor zieht unter 50mA, was moderne GPIOs kurzzeitig treiben können. Alternativ nutzt du einen kleinen MOSFET.*

---

## ⚙️ Konfiguration (`substitutions`)

Passe vor dem Flashen die Werte im `substitutions`-Block deines YAML-Skripts an:

```yaml
substitutions:
  DEBUG_MODE: "NONE"              # "DEBUG" zum Testen am PC, "NONE" für den Solar-Betrieb
  TANK_TYPE: "RECTANGLE"          # "ROUND" (Tonne) oder "RECTANGLE" (IBC / Kiste)
  
  TANK_TOTAL_DEPTH: "1.20"        # Abstand vom Sensor bis zum leeren Tankboden (in Metern)
  TANK_MAX_LITERS: "1000"         # Maximale Literzahl zur Sicherheit
  
  # Wenn TANK_TYPE: "RECTANGLE"
  TANK_LENGTH: "1.20"             # Innenlänge (Meter)
  TANK_WIDTH: "1.00"              # Innenbreite (Meter)
  
  # Wenn TANK_TYPE: "ROUND"
  TANK_RADIUS: "0.50"             # Radius (Durchmesser / 2 in Metern)
