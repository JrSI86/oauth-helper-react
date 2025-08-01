import { useState } from 'react';
import './App.css';

function HomePage() {
  const [authUrl, setAuthUrl] = useState('');
  const [clientId, setClientId] = useState('');
  const [redirectUri, setRedirectUri] = useState('https://localhost:3000/redirect/');
  const [scopes, setScopes] = useState('openid');

  const startLogin = () => {
    if (!authUrl || !clientId || !redirectUri) {
      alert('Por favor, preencha os campos de URL, Client ID e Redirect URI.');
      return;
    }
    
    const config = { authUrl, clientId, redirectUri, scopes };
    sessionStorage.setItem('oauthConfig', JSON.stringify(config));

    const authorizationUrl = `${authUrl}?` +
      `response_type=code&` +
      `client_id=${encodeURIComponent(clientId)}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(scopes)}`;

    window.location.href = authorizationUrl;
  };

  return (
    <div className="container">
      <h1>Gerador de Código de Autorização OAuth 2.0 (React)</h1>
      <p>Preencha os dados para iniciar o fluxo de autorização e obter o código.</p>

      <h2>1. Configuração</h2>
      <div className="form-group">
        <label htmlFor="authUrl">URL de Autorização do Provedor</label>
        <input type="text" id="authUrl" value={authUrl} onChange={(e) => setAuthUrl(e.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="clientId">Client ID</label>
        <input type="text" id="clientId" value={clientId} onChange={(e) => setClientId(e.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="redirectUri">Redirect URI</label>
        <input type="text" id="redirectUri" value={redirectUri} onChange={(e) => setRedirectUri(e.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="scopes">Scopes (separados por espaço)</label>
        <input type="text" id="scopes" value={scopes} onChange={(e) => setScopes(e.target.value)} />
      </div>
      <button onClick={startLogin}>Iniciar Login e Obter Código</button>
    </div>
  );
}

export default HomePage;