# 🛠️ Ching Ticketbot - Setup Guide

Diese Anleitung erklärt dir, wie du den Bot im Discord Developer Portal konfigurierst und das Dashboard auf Netlify hostest.

## 1. Discord Developer Portal Einstellungen

Gehe auf [Discord Developer Portal](https://discord.com/developers/applications) und erstelle eine neue Application ("New Application").

### A. Bot-Einstellungen
- Navigiere links zu **Bot**.
- **Token**: Klicke auf "Reset Token", um deinen Bot-Token zu erhalten. Kopiere diesen in deine `.env` Datei (`DISCORD_TOKEN`).
- **Privileged Gateway Intents**: Aktiviere folgende Schalter (Pflicht!):
    - [x] Presence Intent
    - [x] Server Members Intent
    - [x] Message Content Intent

### B. OAuth2 & Redirects
- Navigiere links zu **OAuth2** -> **General**.
- **Client ID & Secret**: Kopiere beide in deine `.env` Datei (`CLIENT_ID` & `CLIENT_SECRET`).
- **Redirects**: Füge hier deine Netlify-URL hinzu:
    - `https://chingverify.netlify.app/callback`
    - (Optional) `http://localhost:3000/callback` (für Tests)

### C. Bot Einladen (Der Einladungs-Link)
Wenn du den Bot nicht einladen kannst, liegt es meist an den Scopes. Nutze diesen Weg:
1.  Gehe im Portal zu **OAuth2** -> **URL Generator**.
2.  Wähle bei **Scopes**: `bot` und `applications.commands`.
3.  Wähle bei **Bot Permissions**: `Administrator` (für vollen Zugriff während des Setups).
4.  Kopiere die generierte URL unten und öffne sie im Browser, um den Bot einzuladen.

### D. Dashboard Logo (Wichtig!)
Damit das Logo angezeigt wird:
1.  Ich habe den Ordner `dashboard/public/` für dich erstellt.
2.  Kopiere dein Bild `logo.png` **unbedingt** in diesen `public` Ordner.
3.  Führe danach `npm run build` im `dashboard` Ordner aus.
4.  Lade den neuen `dist` Ordner auf Netlify hoch.

## 2. Netlify Hosting (Dashboard)
Die Adresse `https://chingverify.netlify.app` ist perfekt! Stelle sicher, dass diese auch bei Discord als Redirect hinterlegt ist.

Ja, du kannst das Dashboard perfekt auf **Netlify** hosten!

### Schritte:
1.  Gehe in den Ordner `dashboard`.
2.  Baue das Projekt lokal mit `npm run build` (erstellt einen `dist` Ordner) oder verbinde dein GitHub-Repo direkt mit Netlify.
3.  **Build Settings auf Netlify**:
    - Build Command: `npm run build`
    - Publish Directory: `dist`
4.  **Environment Variables**: Du musst folgende Variablen bei Netlify unter "Site configuration" -> "Environment variables" eintragen:
    - `VITE_DISCORD_CLIENT_ID`: Deine Client ID von Discord.
    - `VITE_DISCORD_REDIRECT_URI`: `https://chingverify.netlify.app/callback`
    - `VITE_BOT_API_URL`: Die URL deines gehosteten Bots (z.B. `https://dein-bot.render.com/api/verify`)
5.  **Build auslösen**: Nach dem Speichern der Variablen musst du den Build auf Netlify erneut starten.

## 3. Bot Hosting (Das Gehirn)

Wenn du den Bot kostenlos auf deinem eigenen PC laufen lassen willst, ist das kein Problem!

### A. Bot dauerhaft laufen lassen (PM2)
Damit der Bot nicht ausgeht, wenn du das Terminal schließt, nutze **PM2**:
1.  Installiere PM2: `npm install pm2 -g`
2.  Starte den Bot: `pm2 start index.js --name "ching-bot"`
3.  Der Bot läuft jetzt im Hintergrund. Mit `pm2 logs` siehst du, was passiert.

### B. Lokal-Bot mit Netlify verbinden (ngrok)
Da dein Dashboard auf Netlify (Internet) liegt, aber dein Bot auf deinem PC (Lokal) ist, können sie standardmäßig nicht sprechen.
1.  Nutze **[ngrok](https://ngrok.com/)**, um deinen lokalen Port 3000 freizugeben.
2.  Befehl: `ngrok http 3000`
3.  Du erhältst eine Adresse wie `https://xyz.ngrok-free.app`.
4.  Kopiere diese Adresse in deine Netlify-Umgebungsvariable `VITE_BOT_API_URL` (mit `/api/verify` am Ende).

---

**Status:** Alles bereit für den Einsatz auf deinem PC! 🚀
