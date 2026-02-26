import React from 'react';

function App() {
  const handleLogin = () => {
    const clientId = '1476009858452033536';
    const redirectUri = encodeURIComponent('https://chingverify.netlify.app/callback');
    const oauthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify`;
    window.location.href = oauthUrl;
  };

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      window.location.href = `http://localhost:3000/api/verify?code=${code}`;
    }
  }, []);

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1 style={{ color: '#D4AF37' }}>CHING VERIFY</h1>
      <p style={{ color: '#fff' }}>Bitte klicke auf den Button unten.</p>
      <button
        onClick={handleLogin}
        style={{
          padding: '15px 30px',
          backgroundColor: '#D4AF37',
          border: 'none',
          borderRadius: '5px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        MIT DISCORD VERIFIZIEREN
      </button>
    </div>
  );
}

export default App;
