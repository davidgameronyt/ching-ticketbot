import React from 'react';

function App() {
  const handleLogin = () => {
    // Deine Bot Client ID
    const clientId = '1476009858452033536';
    // Die Redirect-URL muss EXAKT so im Discord Portal stehen
    const redirectUri = encodeURIComponent('https://chingverify.netlify.app/callback');
    const oauthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify`;

    window.location.href = oauthUrl;
  };

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      // Weiterleitung an deinen lokalen Bot
      const apiUrl = 'http://localhost:3000/api/verify';
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
        <span>🛡️</span> Mit Discord verifizieren
      </button>

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#555' }}>
        Sicher & Schnell via Discord OAuth
      </div>
    </div>
  );
}

export default App;
