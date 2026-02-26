@echo off
TITLE CHING Ticketbot - Stop
color 0C
echo ---------------------------------------------------
echo 🛑 Agent 007 beendet alle Bot-Prozesse...
echo ---------------------------------------------------

:: Alle Node.js Prozesse beenden
taskkill /F /IM node.exe /T >nul 2>&1

if %errorlevel% equ 0 (
    echo ✅ Alle Bot-Prozesse wurden erfolgreich beendet.
) else (
    echo ℹ️ Keine laufenden Bot-Prozesse gefunden.
)

echo ---------------------------------------------------
echo 🏁 Mission beendet.
timeout /t 3
exit
