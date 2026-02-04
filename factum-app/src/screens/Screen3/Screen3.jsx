import React from 'react';
import { Shield, RotateCcw } from 'lucide-react';
import ImagePreview from '../../components/ImagePreview/ImagePreview';
import ResultCard from '../../components/UI/ResultCard';
import PrimaryButton from '../../components/UI/PrimaryButton';
import './Screen3.css';

const Screen3 = ({ moderationResult, imageUrl, onReset }) => {
    // Datos de demostración cuando no hay resultado real
    const demoResult = {
        isInappropriate: false,
        confidence: 99,
        labels: [
            { Name: 'Paisaje', Confidence: 99 },
            { Name: 'Naturaleza', Confidence: 97 },
            { Name: 'Montaña', Confidence: 95 },
            { Name: 'Cielo', Confidence: 92 },
            { Name: 'Desnudez', Confidence: 0.01 }
        ]
    };

    // Imagen de demostración (SVG landscape)
    const demoImageUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' style='stop-color:%2387CEEB'/%3E%3Cstop offset='100%25' style='stop-color:%234682B4'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='600' height='400'/%3E%3Cpath d='M0,300 Q150,250 300,280 T600,300 L600,400 L0,400 Z' fill='%232F4F4F'/%3E%3Cpath d='M50,320 L100,280 L150,320 Z' fill='%23228B22'/%3E%3Cpath d='M450,310 L520,260 L590,310 Z' fill='%23228B22'/%3E%3Ccircle cx='150' cy='100' r='40' fill='%23FFD700'/%3E%3C/svg%3E";

    // Usar resultado real o demo
    const result = moderationResult || demoResult;
    const displayImageUrl = imageUrl || demoImageUrl;
    const isDemo = !moderationResult;

    // Crear datos de ejemplo para las barras de progreso
    const displayCategories = result.labels.map(label => ({
        label: label.Name,
        value: label.Confidence,
        color: label.Confidence > 50 ? '#16a34a' : '#9ca3af'
    }));

    return (
        <div className="screen3-container">
            {isDemo && (
                <div className="demo-banner">
                    ℹ️ Mostrando datos de demostración. Sube una imagen en Screen 1 para ver resultados reales.
                </div>
            )}

            <div className="screen3-grid">
                {/* Left: Image */}
                <div className="screen3-image">
                    <ImagePreview imageUrl={displayImageUrl} blurred={false} />
                </div>

                {/* Right: Results */}
                <div className="screen3-results">
                    <div className="screen3-header">
                        <Shield className="screen3-icon" />
                        <h2 className="screen3-title">CONTENIDO SEGURO</h2>
                        <p className="screen3-subtitle">Esta imagen es apropiada para mostrar</p>
                    </div>

                    <div className="screen3-bars">
                        <ResultCard labels={result.labels.slice(0, 5)} />
                    </div>

                    <PrimaryButton onClick={onReset} style={{ width: '100%', marginTop: '1.5rem' }}>
                        <RotateCcw size={18} />
                        Analizar otra imagen
                    </PrimaryButton>
                </div>
            </div>
        </div>
    );
};

export default Screen3;
