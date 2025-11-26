import { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import ModerationResult from './components/ModerationResult';
import { moderateImage } from './services/apiService';
import './App.css';

function App() {
  const [currentImageKey, setCurrentImageKey] = useState(null);
  const [currentImageName, setCurrentImageName] = useState(null);
  const [moderationResult, setModerationResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const handleUploadComplete = async (imageKey, imageName) => {
    setCurrentImageKey(imageKey);
    setCurrentImageName(imageName);
    setError(null);
    setIsAnalyzing(true);

    try {
      // Call moderation API
      const result = await moderateImage(imageKey);
      setModerationResult(result);
    } catch (err) {
      setError(err.message || 'Error al analizar la imagen.');
      console.error('Moderation error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUploadError = (errorMessage) => {
    setError(errorMessage);
    setCurrentImageKey(null);
    setCurrentImageName(null);
    setModerationResult(null);
  };

  const handleReset = () => {
    setCurrentImageKey(null);
    setCurrentImageName(null);
    setModerationResult(null);
    setError(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="app">
      <div className="background-gradient"></div>

      <header className="header">
        <div className="logo-container">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <h1 className="logo-title">Factum AI</h1>
        </div>
        <p className="header-subtitle">Clasificación Inteligente de Contenido Multimedia</p>
      </header>

      <main className="main-content">
        {error && (
          <div className="error-banner">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
            <button onClick={() => setError(null)} className="error-close">✕</button>
          </div>
        )}

        {isAnalyzing && (
          <div className="analyzing-overlay">
            <div className="analyzing-content">
              <div className="analyzing-spinner"></div>
              <h2>Analizando imagen...</h2>
              <p>Amazon Rekognition está procesando tu imagen</p>
            </div>
          </div>
        )}

        {!moderationResult && !isAnalyzing && (
          <div className="upload-section">
            <div className="info-card">
              <h2>🛡️ Detecta Contenido Inapropiado</h2>
              <p>Utiliza inteligencia artificial de Amazon Rekognition para identificar contenido explícito en imágenes.</p>
              <div className="features">
                <div className="feature-item">
                  <span className="feature-icon">⚡</span>
                  <span>Análisis en tiempo real</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🎯</span>
                  <span>Alta precisión</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🔒</span>
                  <span>Seguro y privado</span>
                </div>
              </div>
            </div>

            <ImageUploader
              onUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
            />
          </div>
        )}

        {moderationResult && !isAnalyzing && (
          <ModerationResult
            result={moderationResult}
            imageName={currentImageName}
            onReset={handleReset}
          />
        )}
      </main>

      <footer className="footer">
        <p>Powered by AWS Rekognition • Lambda • S3 • API Gateway</p>
      </footer>
    </div>
  );
}

export default App;

