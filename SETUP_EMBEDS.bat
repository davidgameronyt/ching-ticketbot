@echo off
TITLE CHING Ticketbot - Setup Embeds
color 0B
echo ---------------------------------------------------
echo 🛠️ Agent 007 sendet die Embeds...
echo ---------------------------------------------------

cd /d "%~dp0"

echo 🚀 Sende Nachrichten in die Kanäle...
node setup_embeds.js

if %errorlevel% equ 0 (
    echo ✅ Embeds wurden erfolgreich gesendet!
) else (
    echo ❌ Fehler beim Senden der Embeds. Prüfe die Konsole.
)

echo ---------------------------------------------------
echo 🏁 Fertig. Dieses Fenster schließt sich in 5 Sekunden.
timeout /t 5
exit
