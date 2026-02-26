import React from 'react';
import { UserCheck } from 'lucide-react';

function App() {
  const handleLogin = () => {
    // Fallback auf die IDs aus deiner .env, falls Netlify-Variablen nicht gesetzt sind
    const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID || '1476009858452033536';
    const redirectUri = encodeURIComponent(import.meta.env.VITE_DISCORD_REDIRECT_URI || 'http://localhost:3000/api/verify');
    const oauthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify`;

    window.location.href = oauthUrl;
  };

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      const apiUrl = import.meta.env.VITE_BOT_API_URL || 'http://localhost:3000/api/verify';
      window.location.href = `${apiUrl}?code=${code}`;
    }
  }, []);

  return (
    <div className="card">
      <img
        src="/logo.png"
        alt="Ching Logo"
        className="logo"
      />
      <h1>CHING VERIFY</h1>
      <p>Willkommen beim offiziellen Ching Discord. Bitte verifiziere dich, um vollen Zugriff auf alle Channel zu erhalten.</p>

      <button className="btn" onClick={handleLogin}>
        <UserCheck size={20} />
        Mit Discord verifizieren
      </button>

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#555' }}>
        Sicher & Schnell via Discord OAuth
      </div>
    </div>
  );
}

export default App;
