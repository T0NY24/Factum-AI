import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import ImagePreview from '../../components/ImagePreview/ImagePreview';
import ResultCard from '../../components/UI/ResultCard';
import PrimaryButton from '../../components/UI/PrimaryButton';
import './ScreenSuggestive.css';

const ScreenSuggestive = ({ moderationResult, imageUrl, onReset }) => {
    // Datos de demostración cuando no hay resultado real
    const demoResult = {
        status: 'suggestive',
        confidence: 85,
        labels: [
            { Name: 'Suggestive', Confidence: 85 },
            { Name: 'Revealing Clothes', Confidence: 78 },
            { Name: 'Swimwear', Confidence: 72 },
            { Name: 'Female', Confidence: 95 },
            { Name: 'Person', Confidence: 99 }
        ]
    };

    // Imagen de demostración
    const demoImageUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect fill='%23fef3c7' width='600' height='400'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23d97706' font-size='24' font-family='sans-serif'%3ESugestivo%3C/text%3E%3C/svg%3E";

    // Usar resultado real o demo
    const result = moderationResult || demoResult;
    const displayImageUrl = imageUrl || demoImageUrl;
    const isDemo = !moderationResult;

    // Crear datos para las barras de progreso (color amarillo/naranja)
    const displayCategories = result.labels.map(label => ({
        label: label.Name,
        value: label.Confidence,
        color: label.Confidence > 70 ? '#f59e0b' : label.Confidence > 50 ? '#fbbf24' : '#fcd34d'
    }));

    return (
        <div className="screen-suggestive-container">
            {isDemo && (
                <div className="demo-banner warning">
                    ℹ️ Mostrando datos de demostración. Sube una imagen para ver resultados reales.
                </div>
            )}

            <div className="screen-suggestive-grid">
                {/* Left: Image (no blur for suggestive) */}
                <div className="screen-suggestive-image">
                    <ImagePreview imageUrl={displayImageUrl} blurred={false} />
                </div>

                {/* Right: Warning Results */}
                <div className="screen-suggestive-results">
                    <div className="screen-suggestive-header">
                        <AlertTriangle className="screen-suggestive-icon" />
                        <h2 className="screen-suggestive-title">CONTENIDO SUGESTIVO</h2>
                        <p className="screen-suggestive-subtitle">
                            La imagen contiene material que podría ser sensible para algunas audiencias.
                        </p>
                    </div>

                    <div className="screen-suggestive-bars">
                        <ResultCard labels={result.labels.slice(0, 5)} />
                    </div>

                    <div className="screen-suggestive-info">
                        <p>Este contenido no viola las políticas pero requiere advertencia de edad.</p>
                    </div>

                    <PrimaryButton onClick={onReset} style={{ width: '100%', marginTop: '1rem' }}>
                        <RotateCcw size={18} />
                        Analizar otra imagen
                    </PrimaryButton>
                </div>
            </div>
        </div>
    );
};

export default ScreenSuggestive;
