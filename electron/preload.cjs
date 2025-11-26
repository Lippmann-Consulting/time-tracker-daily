const { contextBridge, ipcRenderer } = require('electron');

// Sichere API für den Renderer-Prozess
// Diese API wird über contextBridge bereitgestellt und ist die einzige
// Möglichkeit für den Renderer, mit dem Main-Prozess zu kommunizieren
const electronAPI = {
  // App-Informationen
  getVersion: () => ipcRenderer.invoke('app-version'),
  getName: () => ipcRenderer.invoke('app-name'),
  
  // Weitere sichere APIs können hier hinzugefügt werden
  // Beispiel: Datei-Operationen, System-Informationen, etc.
};

// Exponiere die API sicher über contextBridge
// Wichtig: Nur notwendige APIs exponieren, keine sensiblen Funktionen
contextBridge.exposeInMainWorld('electronAPI', electronAPI);
