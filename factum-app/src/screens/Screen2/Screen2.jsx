import React, { useEffect } from 'react';
import ProgressSteps from '../../components/ProgressSteps/ProgressSteps';
import { useModeration } from '../../hooks/useModeration';
import './Screen2.css';

const Screen2 = ({ imageData, onAnalysisComplete, onNavigate }) => {
    const { analyzing, result, steps, analyzeImage } = useModeration();

    useEffect(() => {
        if (imageData && imageData.key) {
            // Iniciar análisis automáticamente
            const performAnalysis = async () => {
                const moderationResult = await analyzeImage(imageData.key);

                if (moderationResult) {
                    // Notificar al padre
                    onAnalysisComplete(moderationResult);

                    // Navegar automáticamente según el resultado
                    setTimeout(() => {
                        if (moderationResult.isInappropriate) {
                            onNavigate(4); // Screen 4 - Contenido Inapropiado
                        } else {
                            onNavigate(3); // Screen 3 - Contenido Seguro
                        }
                    }, 1000);
                }
            };

            performAnalysis();
        }
    }, [imageData, analyzeImage, onAnalysisComplete, onNavigate]);

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
                    <p className="screen2-text">Procesando de forma segura con IA</p>
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
