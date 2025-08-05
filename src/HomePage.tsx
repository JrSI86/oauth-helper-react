import { useState, useEffect } from 'react';
import './App.css';

function HomePage() {
  const [authUrl, setAuthUrl] = useState('');
  const [clientId, setClientId] = useState('');
  const [redirectUri, setRedirectUri] = useState('https://localhost:3000/redirect/');
  const [scopes, setScopes] = useState('openid');

  const [savedEnvs, setSavedEnvs] = useState<Record<string, any>>({});
  const [newEnvName, setNewEnvName] = useState('');

  useEffect(() => {
    const environments = localStorage.getItem('oauthHelperEnvironments');
    if (environments) {
      setSavedEnvs(JSON.parse(environments));
    }
  }, []);

  const handleLoadEnv = (envName: string) => {
    if (!envName || !savedEnvs[envName]) return;

    const config = savedEnvs[envName];
    setAuthUrl(config.authUrl);
    setClientId(config.clientId);
    setRedirectUri(config.redirectUri);
    setScopes(config.scopes);
  };

  const handleSaveEnv = () => {
    if (!newEnvName) {
      alert('Por favor, digite um nome para o ambiente.');
      return;
    }

    const newConfig = { authUrl, clientId, redirectUri, scopes };
    const updatedEnvs = { ...savedEnvs, [newEnvName.toUpperCase()]: newConfig };

    localStorage.setItem('oauthHelperEnvironments', JSON.stringify(updatedEnvs));
    setSavedEnvs(updatedEnvs);
    setNewEnvName('');
    alert(`Ambiente '${newEnvName.toUpperCase()}' salvo com sucesso!`);
  };

const startLogin = () => {
    if (!authUrl || !clientId || !redirectUri) {
        alert('Por favor, preencha os campos de URL de Autorização, Client ID e Redirect URI.');
        return;
    }
    
    const config = { 
        authUrl: authUrl, 
        clientId: clientId, 
        redirectUri: redirectUri, 
        scopes: scopes 
    };
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
      <h1>Gerador de Código de Autorização OAuth 2.0</h1>

      <div className="env-section">
        <h2>Carregar Configuração</h2>
        <div className="form-group-inline">
            <select onChange={(e) => handleLoadEnv(e.target.value)}>
                <option value="">Selecione um ambiente...</option>
                {Object.keys(savedEnvs).map(envName => (
                    <option key={envName} value={envName}>{envName}</option>
                ))}
            </select>
        </div>
      </div>
      
      <h2>Configuração Manual</h2>
      <div id="config-form">
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
            <label htmlFor="scopes">Scopes</label>
            <input type="text" id="scopes" value={scopes} onChange={(e) => setScopes(e.target.value)} />
        </div>
      </div>

      <div className="save-section">
          <h2>Salvar Configuração Atual</h2>
          <div className="form-group-inline">
              <input 
                type="text" 
                placeholder="Nome do Ambiente (ex: QAS)" 
                value={newEnvName} 
                onChange={(e) => setNewEnvName(e.target.value)}
              />
              <button onClick={handleSaveEnv} className="save-btn">Salvar</button>
          </div>
      </div>

      <button onClick={startLogin} className="login-btn">Iniciar Login e Obter Código</button>
    </div>
  );
}

export default HomePage;