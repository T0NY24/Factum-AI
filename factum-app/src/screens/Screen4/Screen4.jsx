import React, { useState } from 'react';
import { X, RotateCcw } from 'lucide-react';
import ImagePreview from '../../components/ImagePreview/ImagePreview';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import './Screen4.css';

const Screen4 = ({ moderationResult, imageUrl, onReset }) => {
    const [imageRevealed, setImageRevealed] = useState(false);

    // Datos de demostración cuando no hay resultado real
    const demoResult = {
        isInappropriate: true,
        confidence: 98,
        labels: [
            { Name: 'Desnudez Explícita', Confidence: 98 },
            { Name: 'Sugestivo', Confidence: 95 },
            { Name: 'Contenido para Adultos', Confidence: 93 },
            { Name: 'Violencia', Confidence: 12 },
            { Name: 'Sangre', Confidence: 5 }
        ]
    };

    // Imagen placeholder para demo (blurred by default)
    const demoImageUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect fill='%23374151' width='600' height='400'/%3E%3C/svg%3E";

    // Usar resultado real o demo
    const result = moderationResult || demoResult;
    const displayImageUrl = imageUrl || demoImageUrl;
    const isDemo = !moderationResult;

    // Crear datos para las barras de progreso
    const displayCategories = result.labels.map(label => ({
        label: label.Name,
        value: label.Confidence,
        color: label.Confidence > 70 ? '#dc2626' : label.Confidence > 50 ? '#ea580c' : '#f59e0b'
    }));

    return (
        <div className="screen4-container">
            {isDemo && (
                <div className="demo-banner">
                    ℹ️ Mostrando datos de demostración. Sube una imagen en Screen 1 para ver resultados reales.
                </div>
            )}

            <div className="screen4-grid">
                {/* Left: Blurred Image */}
                <div className="screen4-image">
                    <ImagePreview
                        imageUrl={displayImageUrl}
                        blurred={!imageRevealed}
                        showRevealBtn={true}
                        onReveal={() => setImageRevealed(true)}
                    />
                </div>

                {/* Right: Warning Results */}
                <div className="screen4-results">
                    <div className="screen4-header">
                        <div className="screen4-icon-wrapper">
                            <X className="screen4-icon" />
                        </div>
                        <h2 className="screen4-title">CONTENIDO INAPROPIADO</h2>
                        <p className="screen4-subtitle">Esta imagen ha sido bloqueada automáticamente</p>
                    </div>

                    <div className="screen4-bars">
                        {displayCategories.slice(0, 5).map((category, index) => (
                            <ProgressBar
                                key={index}
                                label={category.label}
                                value={category.value}
                                color={category.color}
                            />
                        ))}
                    </div>

                    <div className="screen4-actions">
                        <button className="screen4-button primary" onClick={onReset}>
                            <RotateCcw size={18} style={{ marginRight: '8px' }} />
                            Analizar otra imagen
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Screen4;
