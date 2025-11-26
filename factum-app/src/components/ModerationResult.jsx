import { useState } from 'react';
import './ModerationResult.css';

const ModerationResult = ({ result, imageName, onReset }) => {
    const [showDetails, setShowDetails] = useState(false);

    if (!result) return null;

    const { isInappropriate, labels, confidence, message } = result;

    return (
        <div className="result-container">
            <div className={`result-card ${isInappropriate ? 'dangerous' : 'safe'}`}>
                <div className="result-icon">
                    {isInappropriate ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                </div>

                <h2 className="result-title">
                    {isInappropriate ? '⚠️ Contenido Inapropiado Detectado' : '✅ Contenido Seguro'}
                </h2>

                <p className="result-message">{message}</p>

                {imageName && (
                    <p className="image-name">
                        <strong>Imagen:</strong> {imageName}
                    </p>
                )}

                {confidence !== undefined && (
                    <div className="confidence-section">
                        <p className="confidence-label">Nivel de confianza</p>
                        <div className="confidence-bar">
                            <div
                                className="confidence-fill"
                                style={{ width: `${confidence}%` }}
                            ></div>
                        </div>
                        <p className="confidence-value">{confidence.toFixed(1)}%</p>
                    </div>
                )}

                {labels && labels.length > 0 && (
                    <div className="labels-section">
                        <button
                            className="toggle-details"
                            onClick={() => setShowDetails(!showDetails)}
                        >
                            {showDetails ? 'Ocultar detalles' : 'Ver detalles de moderación'}
                            <span className={`arrow ${showDetails ? 'up' : 'down'}`}>▼</span>
                        </button>

                        {showDetails && (
                            <div className="labels-list">
                                {labels.map((label, index) => (
                                    <div key={index} className="label-item">
                                        <span className="label-name">{label.Name}</span>
                                        <span className="label-confidence">{label.Confidence.toFixed(1)}%</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <button className="reset-button" onClick={onReset}>
                    Analizar otra imagen
                </button>
            </div>
        </div>
    );
};

export default ModerationResult;
