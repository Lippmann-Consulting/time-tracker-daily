# Electron Setup - Zeit Tracker

Diese Anwendung wurde als eigenständige macOS-Anwendung mit Electron konfiguriert.

## Entwicklung

### Entwicklungsumgebung starten

1. **Vite Dev Server starten:**
   ```bash
   npm run dev
   ```

2. **In einem zweiten Terminal Electron starten:**
   ```bash
   npm run electron:dev
   ```

Die App öffnet sich mit DevTools und lädt die Anwendung vom Vite Dev Server.

## Build für Produktion

### macOS-Anwendung erstellen

Um eine eigenständige macOS-Anwendung zu erstellen:

```bash
npm run electron:dist:mac
```

Dies erstellt:
- Eine `.app` Datei im `release/mac` Ordner
- Eine `.dmg` Datei für einfache Installation
- Eine `.zip` Datei als Alternative

### Nur App erstellen (ohne DMG/ZIP)

```bash
npm run electron:pack
```

Die App wird im `release/mac` Ordner erstellt.

## Sicherheitsfeatures

Die Anwendung implementiert folgende Sicherheitsfeatures:

1. **Context Isolation**: Renderer-Prozess ist isoliert vom Main-Prozess
2. **Node Integration deaktiviert**: Kein direkter Zugriff auf Node.js im Renderer
3. **Sandbox aktiviert**: Zusätzliche Isolierung des Renderer-Prozesses
4. **Web Security aktiviert**: Standard Web-Sicherheitsrichtlinien
5. **Sichere IPC-Kommunikation**: Nur über contextBridge exponierte APIs
6. **Navigation-Schutz**: Verhindert Navigation zu externen URLs
7. **Hardened Runtime**: macOS-spezifische Sicherheitsfeatures

## Dateistruktur

```
electron/
  ├── main.ts          # Electron Main-Prozess
  └── preload.ts       # Preload-Skript für sichere IPC

electron-dist/         # Kompilierte Electron-Dateien (wird generiert)
release/               # Gebaute Anwendungen (wird generiert)
build/                 # Build-Ressourcen (Entitlements, etc.)
```

## Verwendung der gebauten App

1. Navigiere zum `release/mac` Ordner
2. Doppelklicke auf `Zeit Tracker.app` um die Anwendung zu starten
3. Oder verwende die `.dmg` Datei für eine Installation im Applications-Ordner

## Troubleshooting

### App startet nicht

- Stelle sicher, dass alle Dependencies installiert sind: `npm install`
- Prüfe, ob der Build erfolgreich war: `npm run build && npm run electron:build`

### Sicherheitswarnungen

- Die App verwendet Hardened Runtime für macOS
- Bei ersten Start kann macOS nach Berechtigung fragen
- Öffne Systemeinstellungen > Sicherheit, falls die App blockiert wird

### DevTools in Produktion

- DevTools sind standardmäßig nur in der Entwicklung aktiviert
- In der Produktionsversion sind sie deaktiviert

