import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './App.css';


interface UserSessionResponse {
  accessToken: string;
  refreshToken: string;
  name: string;
  email: string;
  webgroups_opvisibility: string[];
}

function RedirectPage() {
  const [capturedCode, setCapturedCode] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userSession, setUserSession] = useState<UserSessionResponse | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');

    if (code) {
      setCapturedCode(code);
    } else if (error) {
      setErrorMessage(`Erro retornado pelo provedor: ${error} - ${errorDescription || 'Sem descrição.'}`);
    }

    window.history.replaceState({}, document.title, window.location.pathname);
  }, []);

  const exchangeCodeForToken = async () => {
    if (!capturedCode) return;

    const savedConfig = sessionStorage.getItem('oauthConfig');
    if (!savedConfig) {
      setErrorMessage("Configuração da sessão perdida. Por favor, inicie o fluxo novamente.");
      return;
    }
    const config = JSON.parse(savedConfig);

    setIsLoading(true);
    setErrorMessage(null);
    setUserSession(null);

    try {
      const response = await fetch(`${config.backendUrl}/v1/auth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: capturedCode,
          redirect: config.redirectUri
        })
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.data?.technicalDetail || responseData.message || 'Erro desconhecido retornado pela API.');
      }
      
      setUserSession(responseData.data);

    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, buttonId: string) => {
    navigator.clipboard.writeText(text).then(() => {
      const button = document.getElementById(buttonId) as HTMLButtonElement;
      if (button) {
        const originalText = button.textContent;
        button.textContent = 'Copiado!';
        setTimeout(() => {
          button.textContent = originalText;
        }, 2000);
      }
    });
  };

  return (
    <div className="container">
      {capturedCode && !userSession && (
        <div id="result-container">
          <h2>1. Código de Autorização Capturado</h2>
          <code>{capturedCode}</code>
          <hr style={{margin: '20px 0'}} />
          <h2>2. Obter Token</h2>
          <p>Clique no botão abaixo para trocar o código por um Access Token, chamando sua API back-end.</p>
          <button onClick={exchangeCodeForToken} disabled={isLoading} className="login-btn">
            {isLoading ? 'Gerando Token...' : 'Trocar Código por Token'}
          </button>
        </div>
      )}

      {userSession && (
        <div id="result-container">
          <h2>Sessão do Usuário Obtida com Sucesso!</h2>
          <dl className="session-details">
            <dt>Nome:</dt>
            <dd>{userSession.name}</dd>

            <dt>Email:</dt>
            <dd>{userSession.email}</dd>

            <dt>Access Token:</dt>
            <dd className="token-field">
              <input type="text" readOnly value={userSession.accessToken} />
              <button onClick={() => copyToClipboard(userSession.accessToken, 'accessTokenBtn')} id="accessTokenBtn" className="copy-btn-inline">Copiar</button>
            </dd>

            <dt>Refresh Token:</dt>
            <dd className="token-field">
              <input type="text" readOnly value={userSession.refreshToken || ''} />
              <button onClick={() => copyToClipboard(userSession.refreshToken || '', 'refreshTokenBtn')} id="refreshTokenBtn" className="copy-btn-inline">Copiar</button>
            </dd>

            <dt>Webgroups:</dt>
            <dd>
              {userSession.webgroups_opvisibility && userSession.webgroups_opvisibility.length > 0 ? (
                <ul>
                  {userSession.webgroups_opvisibility.map((group, index) => (
                    <li key={index}>{group}</li>
                  ))}
                </ul>
              ) : (
                "Nenhum webgroup encontrado."
              )}
            </dd>
          </dl>
        </div>
      )}
      
      {errorMessage && (
        <div id="error-container">
          <h2>Erro</h2>
          <code>{errorMessage}</code>
        </div>
      )}
      
      <Link to="/" style={{marginTop: '20px', display: 'block'}}>Voltar para a Configuração</Link>
    </div>
  );
}

export default RedirectPage;