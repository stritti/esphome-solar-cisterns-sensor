# ESPHome-Validierung

Das Repository validiert die ESPHome-Konfiguration und kompiliert die Firmware mit GitHub Actions. Der Workflow läuft bei relevanten Änderungen in Pull Requests, bei relevanten Pushes auf `main` und bei manueller Ausführung.

## Prüfstufen

| Aufgabe | Zweck | In CI verwendet |
|---|---|---:|
| `esphome config` | Prüft Substitutionen, Secrets, Komponentenschemas, Pins und Konfigurationswerte | ja |
| `esphome compile --only-generate` | Erzeugt den C++-Quellcode ohne vollständigen Toolchain-Lauf | nein |
| `esphome compile` | Validiert, generiert und kompiliert die vollständige Firmware einschließlich Lambdas und Abhängigkeiten | ja |

Die vollständige Kompilierung ist die entscheidende Prüfung. Sie erkennt Fehler im generierten C++, in Komponenten, ESP-IDF und Toolchain, die eine reine Konfigurationsvalidierung nicht findet. `--only-generate` ist während der Entwicklung nutzbar, würde aber einen Teil des vollständigen CI-Builds doppeln.

## Lokal ausführen

ESPHome 2026.8.0 verwenden. Die Version entspricht `esphome.min_version` und der in CI festgesetzten Version:

```bash
python -m pip install "esphome==2026.8.0"
cp secrets.yaml.example secrets.yaml
./scripts/validate-esphome.sh
```

Für eine schnellere reine Konfigurationsprüfung:

```bash
./scripts/validate-esphome.sh --config-only
```

Das Skript erstellt und überschreibt `secrets.yaml` nicht. Echte Zugangsdaten bleiben lokal und werden von Git ignoriert. GitHub Actions kopiert ausdrücklich `secrets.yaml.example`. Dessen Platzhalterwerte reichen für einen Build ohne Offenlegung von Zugangsdaten.

## GitHub Actions

`.github/workflows/validate-esphome.yml` verwendet Python 3.12 und setzt ESPHome für reproduzierbare Ergebnisse auf Version 2026.8.0 fest. Das ESPHome-Buildverzeichnis, der ESPHome-Werkzeugcache und die PlatformIO-Toolchain werden zwischen kompatiblen Läufen zwischengespeichert. Der Job benötigt ausschließlich Lesezugriff auf den Repository-Inhalt.

Änderungen an `wassertank-sensor.yaml`, `secrets.yaml.example`, dem Validierungsskript oder dem Workflow lösen die Prüfung aus. Reine Dokumentationsänderungen kompilieren die Firmware nicht erneut.

## Quellen

- [ESPHome-Kommandozeile](https://esphome.io/guides/cli/)
- [ESPHome-Installation](https://esphome.io/install/getting-started/)
