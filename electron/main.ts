import { app, BrowserWindow, ipcMain, shell } from 'electron';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// __dirname für ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Sicherheitsrelevante Konfiguration
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'; // Nur für Entwicklung

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  // Erstelle das Browser-Fenster mit sicherheitsrelevanten Einstellungen
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#ffffff',
    titleBarStyle: 'hiddenInset', // macOS native Look
    webPreferences: {
      // Sicherheitsfeatures
      nodeIntegration: false, // Wichtig: Node.js nicht im Renderer-Prozess
      contextIsolation: true, // Wichtig: Isoliert Renderer vom Main-Prozess
      sandbox: false, // TEMPORÄR: Sandbox deaktiviert für Diagnose (kann Asset-Loading blockieren)
      preload: join(__dirname, 'preload.cjs'), // Preload-Skript für sichere IPC
      webSecurity: true, // Web-Sicherheit aktivieren
      allowRunningInsecureContent: false, // Keine unsicheren Inhalte
    },
    show: false, // Fenster erst versteckt, dann anzeigen (bessere UX)
  });

  // Lade die App
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
  
  if (isDev) {
    // Entwicklung: Lade von Vite Dev Server
    mainWindow.loadURL('http://localhost:8080');
    mainWindow.webContents.openDevTools();
  } else {
    // Produktion: Lade aus gebauten Dateien
    const indexPath = join(__dirname, '../dist/index.html');
    console.log('📁 Lade HTML von:', indexPath);
    console.log('📁 __dirname:', __dirname);
    console.log('📁 app.isPackaged:', app.isPackaged);
    mainWindow.loadFile(indexPath).catch((error) => {
      console.error('❌ Fehler beim Laden der HTML-Datei:', error);
    });
  }

  // Error-Handler für Diagnose
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('❌ Fehler beim Laden:', {
      errorCode,
      errorDescription,
      validatedURL,
    });
  });

  mainWindow.webContents.on('did-finish-load', () => {
    console.log('✅ Seite erfolgreich geladen');
  });

  mainWindow.webContents.on('dom-ready', () => {
    console.log('✅ DOM bereit');
  });

  // Console-Logging vom Renderer
  mainWindow.webContents.on('console-message', (event, level, message) => {
    console.log(`[Renderer ${level}]:`, message);
  });

  // Zeige Fenster wenn bereit (verhindert weißes Flackern)
  mainWindow.once('ready-to-show', () => {
    console.log('✅ Fenster bereit zum Anzeigen');
    mainWindow?.show();
    
    // TEMPORÄR: DevTools auch in Produktion aktivieren für Diagnose
    // TODO: Nach Fehlerbehebung wieder entfernen
    mainWindow?.webContents.openDevTools();
  });

  // Verhindere Navigation zu externen URLs
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // Erlaube nur lokale URLs und file:// Protokolle
    if (url.startsWith('http://localhost') || url.startsWith('file://')) {
      return { action: 'allow' };
    }
    // Öffne externe URLs im Standard-Browser
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Verhindere unerwünschte Navigation
  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    
    // Erlaube nur lokale Navigation
    if (parsedUrl.origin !== 'http://localhost:8080' && !navigationUrl.startsWith('file://')) {
      event.preventDefault();
    }
  });

  // Fenster schließen Handler
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Context-Menü für bessere UX (optional, kann entfernt werden)
  if (isDev) {
    // In Entwicklung: Standard Context-Menü
    mainWindow.webContents.on('context-menu', (e, props) => {
      // Standard-Verhalten in Entwicklung
    });
  } else {
    // In Produktion: Minimales Context-Menü
    mainWindow.webContents.on('context-menu', (e, props) => {
      // Kein Context-Menü in Produktion für bessere Sicherheit
    });
  }
}

// macOS-spezifische Konfiguration
function setupMacOS(): void {
  // Dock-Menü konfigurieren
  app.dock?.setIcon(join(__dirname, '../public/favicon.ico'));
  
  // macOS: Alle Fenster schließen, aber App läuft weiter
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  // macOS: App reaktivieren wenn Dock-Icon geklickt wird
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else {
      mainWindow?.show();
    }
  });
}

// App-Initialisierung
app.whenReady().then(() => {
  createWindow();
  setupMacOS();
});

// Sicherheit: Verhindere neue Fenster
app.on('web-contents-created', (_, contents) => {
  // Moderne Electron-API: setWindowOpenHandler wird bereits oben verwendet
  // Zusätzliche Sicherheit: Verhindere will-attach-webview
  contents.on('will-attach-webview', (event) => {
    event.preventDefault();
  });
});

// App beenden
app.on('before-quit', () => {
  // Cleanup falls nötig
});

// IPC Handler für sichere Kommunikation (falls benötigt)
ipcMain.handle('app-version', () => {
  return app.getVersion();
});

ipcMain.handle('app-name', () => {
  return app.getName();
});

// Sicherheit: Validiere alle IPC-Nachrichten
ipcMain.on('message', (event, ...args) => {
  // Validiere und verarbeite nur vertrauenswürdige Nachrichten
  // Hier können spezifische Validierungen hinzugefügt werden
});

