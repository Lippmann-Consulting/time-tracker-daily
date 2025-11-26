# Zeit Tracker - Arbeitszeiterfassung

## Über dieses Projekt

Dieses Projekt wurde im Rahmen eines **Workshops mit Teilnehmern** gemeinsam entwickelt. Es handelt sich um eine einfache Anwendung zur Arbeitszeiterfassung mit Check-in und Check-out Funktionen.

Die Anwendung kann sowohl als **Web-Anwendung** als auch als **eigenständige macOS-Anwendung** (Electron) verwendet werden.

## Technologien

Dieses Projekt wurde mit folgenden Technologien erstellt:

- **Vite** - Build-Tool und Dev-Server
- **TypeScript** - Typsichere Programmierung
- **React** - UI-Framework
- **React Router** - Routing (HashRouter für Electron)
- **shadcn-ui** - UI-Komponenten
- **Tailwind CSS** - Styling
- **Electron** - Desktop-Anwendung für macOS
- **TanStack React Query** - Datenverwaltung
- **Zod** - Schema-Validierung

## Projekt herunterladen und einrichten

### Voraussetzungen

- **Node.js** (Version 18 oder höher) - [Installation mit nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** oder **yarn** als Package-Manager
- **Git** für Versionskontrolle

### Installation

1. **Repository klonen:**
   ```bash
   git clone git@github.com:Lippmann-Consulting/time-tracker-daily.git
   cd time-tracker-daily
   ```

2. **Dependencies installieren:**
   ```bash
   npm install
   ```

3. **Entwicklungsserver starten:**
   ```bash
   npm run dev
   ```

   Die Anwendung ist dann unter `http://localhost:8080` erreichbar.

## Mit Cursor weiterarbeiten

[Cursor](https://cursor.sh/) ist ein AI-gestützter Code-Editor, der sich hervorragend für die Weiterentwicklung dieses Projekts eignet.

### Setup in Cursor

1. **Projekt öffnen:**
   - Cursor öffnen
   - `File > Open Folder` wählen
   - Den geklonten Projektordner auswählen

2. **Terminal in Cursor nutzen:**
   - Terminal öffnen: `Terminal > New Terminal` (oder `Ctrl/Cmd + J`)
   - Dependencies installieren: `npm install`
   - Dev-Server starten: `npm run dev`

3. **AI-Features nutzen:**
   - Cursor bietet integrierte AI-Unterstützung für Code-Vervollständigung
   - Nutze `Cmd/Ctrl + K` für AI-basierte Code-Änderungen
   - Nutze `Cmd/Ctrl + L` für Chat mit der AI

### Empfohlene Cursor-Einstellungen

- TypeScript-Support ist bereits konfiguriert
- ESLint für Code-Qualität ist eingerichtet
- Prettier-Formatierung (falls gewünscht) kann hinzugefügt werden

## Mit anderen IDEs weiterarbeiten

### Visual Studio Code

1. Projektordner in VS Code öffnen
2. Empfohlene Extensions:
   - ESLint
   - Prettier
   - TypeScript and JavaScript Language Features
   - Tailwind CSS IntelliSense

### WebStorm / IntelliJ IDEA

1. Projektordner öffnen
2. Node.js konfigurieren: `File > Settings > Languages & Frameworks > Node.js`
3. TypeScript aktivieren: `File > Settings > Languages & Frameworks > TypeScript`

### Andere Editoren

Jeder Editor mit TypeScript- und JavaScript-Support funktioniert. Wichtig ist, dass:
- Node.js installiert ist
- Terminal-Zugriff vorhanden ist
- TypeScript-Support aktiviert ist

## Verfügbare Scripts

### Entwicklung

```bash
npm run dev              # Startet Vite Dev-Server
npm run build            # Erstellt Produktions-Build
npm run lint             # Führt ESLint aus
npm run preview          # Vorschau des Produktions-Builds
```

### Electron (Desktop-Anwendung)

```bash
npm run electron:dev     # Startet Electron im Entwicklungsmodus
npm run electron:build   # Kompiliert Electron-Dateien
npm run electron:pack    # Erstellt macOS-App (ohne DMG/ZIP)
npm run electron:dist:mac # Erstellt vollständige macOS-Distribution
```

## Electron-Desktop-Anwendung erstellen

Die Anwendung kann als eigenständige macOS-Anwendung gebaut werden:

1. **Produktions-Build erstellen:**
   ```bash
   npm run build
   ```

2. **Electron-App bauen:**
   ```bash
   npm run electron:dist:mac
   ```

3. **App finden:**
   Die fertige App befindet sich in `release/mac-arm64/Zeit Tracker.app`

4. **App starten:**
   Doppelklick auf `Zeit Tracker.app` oder per Terminal:
   ```bash
   open "release/mac-arm64/Zeit Tracker.app"
   ```

Weitere Details zur Electron-Integration findest du in [ELECTRON_SETUP.md](./ELECTRON_SETUP.md).

## Projektstruktur

```
├── src/
│   ├── components/      # React-Komponenten
│   ├── pages/           # Seiten-Komponenten
│   ├── hooks/           # Custom React Hooks
│   ├── lib/             # Utilities und Validierungen
│   └── App.tsx          # Haupt-App-Komponente
├── electron/            # Electron Main-Prozess und Preload
├── build/               # Build-Ressourcen (Entitlements, etc.)
├── public/              # Statische Dateien
└── dist/                # Produktions-Build (wird generiert)
```

## Wichtige Hinweise

- **Build-Artefakte** (`dist/`, `electron-dist/`, `release/`) sind in `.gitignore` und werden nicht versioniert
- **Node Modules** werden nicht versioniert - immer `npm install` nach dem Klonen ausführen
- **Environment Variables** können in `.env` Dateien gespeichert werden (nicht versioniert)

## Beitragen

Da dieses Projekt in einem Workshop entstanden ist, sind Verbesserungen und Erweiterungen willkommen:

1. Fork das Repository
2. Erstelle einen Feature-Branch (`git checkout -b feature/AmazingFeature`)
3. Committe deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

## Support und Dokumentation

- **Electron-Setup**: Siehe [ELECTRON_SETUP.md](./ELECTRON_SETUP.md)
- **Troubleshooting**: Siehe [TROUBLESHOOTING_CHECKLIST.md](./TROUBLESHOOTING_CHECKLIST.md)
- **React Router**: Verwendet HashRouter für Electron-Kompatibilität
- **Styling**: Tailwind CSS mit shadcn-ui Komponenten

## Lizenz

Dieses Projekt wurde im Rahmen eines Workshops erstellt. Bitte respektiere die Urheberrechte und verwende den Code entsprechend.

---

**Viel Erfolg beim Weiterentwickeln! 🚀**
