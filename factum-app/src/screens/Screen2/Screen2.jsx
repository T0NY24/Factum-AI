import React, { useEffect, useState } from 'react';
import ProgressSteps from '../../components/ProgressSteps/ProgressSteps';
import { useModeration } from '../../hooks/useModeration';
import './Screen2.css';

const Screen2 = ({ imageData, onAnalysisComplete, onNavigate }) => {
    const { analyzing, result, steps, analyzeImage } = useModeration();

    const [loadingMessage, setLoadingMessage] = useState('Consultando Rekognition...');

    useEffect(() => {
        const messages = [
            "Escaneando geometría facial...",
            "Detectando patrones de piel...",
            "Analizando vectores de violencia...",
            "Calculando probabilidad de riesgo..."
        ];
        let currentIndex = 0;

        const intervalId = setInterval(() => {
            setLoadingMessage(messages[currentIndex]);
            currentIndex = (currentIndex + 1) % messages.length;
        }, 800);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (imageData && imageData.key) {
            // Iniciar análisis automáticamente
            const performAnalysis = async () => {
                const moderationResult = await analyzeImage(imageData.key);

                if (moderationResult) {
                    // Notificar al padre - App.jsx maneja la navegación con lógica de 3 niveles
                    // NO navegamos aquí para evitar conflictos con la clasificación sugestiva
                    onAnalysisComplete(moderationResult);
                }
            };

            performAnalysis();
        }
    }, [imageData, analyzeImage, onAnalysisComplete]);

    return (
        <div className="screen2-wrapper">
            <div className="screen2-overlay"></div>
            <div className="screen2-container">
                <div className="screen2-header">
                    <h2 className="screen2-title">Analizando Imagen</h2>
                </div>

                {/* Skeleton Loader */}
                <div className="screen2-skeleton"></div>

                {/* Progress Steps */}
                <div className="screen2-steps">
                    <ProgressSteps steps={steps} />
                </div>

                <div className="screen2-footer">
                    <p className="screen2-text">{loadingMessage}</p>
                    <div className="screen2-dots">
                        <div className="dot" style={{ animationDelay: '0s' }}></div>
                        <div className="dot" style={{ animationDelay: '0.1s' }}></div>
                        <div className="dot" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Screen2;
