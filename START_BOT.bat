@echo off
TITLE CHING Ticketbot - Start
color 0A
echo ---------------------------------------------------
echo 🛠️ Agent 007 startet den Ticketbot...
echo ---------------------------------------------------

:: Prüfen ob Node.js installiert ist
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Fehler: Node.js ist nicht installiert!
    pause
    exit
)

:: Im aktuellen Verzeichnis starten
cd /d "%~dp0"

echo 📦 Installiere/Prüfe Abhängigkeiten...
call npm install --silent

echo 🚀 Starte den Bot (index.js)...
echo (Dieses Fenster bitte offen lassen)

node index.js

pause
