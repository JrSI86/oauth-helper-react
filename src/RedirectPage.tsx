// src/RedirectPage.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function RedirectPage() {
  const [capturedCode, setCapturedCode] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copyButtonText, setCopyButtonText] = useState('Copiar');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');

    if (code) {
      setCapturedCode(code);
    } else if (error) {
      setErrorMessage(`${error}: ${errorDescription || 'Sem descrição.'}`);
    }

    // Limpa a URL para segurança
    window.history.replaceState({}, document.title, window.location.pathname);
  }, []); // O array vazio [] faz este efeito rodar apenas uma vez, quando o componente monta

  const copyToClipboard = () => {
    if (capturedCode) {
      navigator.clipboard.writeText(capturedCode).then(() => {
        setCopyButtonText('Copiado!');
        setTimeout(() => setCopyButtonText('Copiar'), 2000);
      });
    }
  };

  return (
    <div className="container">
      {capturedCode && (
        <div id="result-container">
          <h2>Resultado</h2>
          <p>Login bem-sucedido! O código de autorização foi capturado:</p>
          <button onClick={copyToClipboard} className="copy-btn">{copyButtonText}</button>
          <code>{capturedCode}</code>
          <p style={{ marginTop: '15px' }}>Agora você pode usar este código no Postman ou Swagger.</p>
        </div>
      )}

      {errorMessage && (
        <div id="error-container">
          <h2>Erro</h2>
          <p>O provedor retornou um erro:</p>
          <code>{errorMessage}</code>
        </div>
      )}
      <Link to="/" style={{marginTop: '20px', display: 'block'}}>Voltar para a Configuração</Link>
    </div>
  );
}

export default RedirectPage;