# Troubleshooting-Checkliste: Leere Anzeige in Electron-App

## 🔍 Identifizierte Probleme (Wahrscheinlichkeit)

### 🔴 KRITISCH - Sehr wahrscheinlich

1. **DevTools deaktiviert - Keine Fehler sichtbar**
   - **Problem**: In Produktion sind DevTools deaktiviert, daher sehen wir keine JavaScript-Fehler
   - **Lösung**: DevTools temporär aktivieren oder Console-Logging hinzufügen
   - **Status**: ❌ Nicht implementiert

2. **Asset-Pfade in ASAR-Archiv**
   - **Problem**: Die App ist in `app.asar` gepackt. Relative Pfade zu Assets könnten falsch sein
   - **Lösung**: Pfade explizit prüfen und ggf. anpassen
   - **Status**: ⚠️ Möglicherweise problematisch

3. **Sandbox + webSecurity blockiert Asset-Loading**
   - **Problem**: Mit aktivierter Sandbox und webSecurity könnten lokale Assets blockiert werden
   - **Lösung**: Sandbox temporär deaktivieren oder Asset-Loading explizit erlauben
   - **Status**: ⚠️ Möglicherweise problematisch

### 🟡 WICHTIG - Wahrscheinlich

4. **Fehlende Error-Handler**
   - **Problem**: Keine Error-Handler für `did-fail-load` oder `did-finish-load` Events
   - **Lösung**: Error-Handler hinzufügen, um Fehler zu loggen
   - **Status**: ❌ Nicht implementiert

5. **CSP (Content Security Policy) Probleme**
   - **Problem**: Keine explizite CSP, könnte Asset-Loading blockieren
   - **Lösung**: CSP für Electron anpassen
   - **Status**: ⚠️ Nicht explizit konfiguriert

6. **Base Path in Vite Build**
   - **Problem**: `base: "./"` sollte funktionieren, aber in ASAR könnte es Probleme geben
   - **Lösung**: Prüfen ob Assets korrekt geladen werden
   - **Status**: ✅ Konfiguriert, aber nicht getestet

### 🟢 NORMAL - Möglicherweise

7. **React Router Base Path**
   - **Problem**: React Router könnte falschen Base-Path haben
   - **Lösung**: Router-Base-Path für Electron anpassen
   - **Status**: ⚠️ Nicht geprüft

8. **Fehlende Error-Boundary**
   - **Problem**: React-Fehler werden nicht angezeigt
   - **Lösung**: Error-Boundary hinzufügen
   - **Status**: ❌ Nicht implementiert

9. **Console-Logging fehlt**
   - **Problem**: Keine Logs, um zu sehen was passiert
   - **Lösung**: Console-Logging in Main-Prozess hinzufügen
   - **Status**: ❌ Nicht implementiert

## 📋 Implementierungs-Checkliste

### Phase 1: Diagnose (SOFORT)
- [ ] DevTools in Produktion temporär aktivieren
- [ ] Error-Handler für `did-fail-load` hinzufügen
- [ ] Console-Logging für alle wichtigen Events
- [ ] Prüfen ob HTML-Datei geladen wird
- [ ] Prüfen ob JS/CSS Assets geladen werden

### Phase 2: Pfad-Fixes
- [ ] ASAR-Pfade explizit testen
- [ ] Asset-Pfade in HTML prüfen
- [ ] Vite base-Path für Electron optimieren
- [ ] React Router Base-Path anpassen

### Phase 3: Sicherheits-Anpassungen
- [ ] Sandbox-Verhalten testen (ggf. temporär deaktivieren)
- [ ] webSecurity für lokale Assets anpassen
- [ ] CSP explizit konfigurieren

### Phase 4: React-spezifisch
- [ ] Error-Boundary hinzufügen
- [ ] React DevTools aktivieren (falls möglich)
- [ ] Prüfen ob React überhaupt rendert

## 🛠️ Empfohlene Reihenfolge

1. **SOFORT**: DevTools aktivieren + Error-Handler → Fehler identifizieren
2. **DANN**: Console-Logging → Verstehen was passiert
3. **DANN**: Pfad-Probleme beheben
4. **ZUERST**: Sicherheits-Features anpassen (falls nötig)

## 📝 Notizen

- Die App öffnet sich, also funktioniert Electron grundsätzlich
- Das Fenster ist leer, also wird HTML geladen, aber React rendert nicht oder Assets fehlen
- Wahrscheinlichstes Problem: Asset-Pfade oder Sandbox blockiert Asset-Loading

