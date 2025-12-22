import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { getConfig, saveConfig } from '../../services/configService';
import './Screen6.css';

const Screen6 = () => {
    const [threshold, setThreshold] = useState(85);
    const [explicitNudity, setExplicitNudity] = useState(true);
    const [suggestive, setSuggestive] = useState(false);
    const [saved, setSaved] = useState(false);

    // Cargar configuración al montar
    useEffect(() => {
        const config = getConfig();
        setThreshold(config.threshold);
        setExplicitNudity(config.explicitNudity);
        setSuggestive(config.suggestive);
    }, []);

    const handleSave = () => {
        try {
            saveConfig({
                threshold,
                explicitNudity,
                suggestive
            });

            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error('Error saving config:', error);
        }
    };

    return (
        <div className="screen6-container">
            <h2 className="screen6-title">Configuración de Amazon Rekognition</h2>
            <p className="screen6-subtitle">Ajusta los parámetros de detección de contenido sensible</p>

            <div className="screen6-content">
                {/* Threshold Slider */}
                <div className="config-section">
                    <label className="config-label">
                        Umbral de Confianza para Desnudez (Threshold)
                    </label>
                    <div className="slider-container">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={threshold}
                            onChange={(e) => setThreshold(parseInt(e.target.value))}
                            className="slider"
                            style={{
                                background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${threshold}%, #E5E7EB ${threshold}%, #E5E7EB 100%)`
                            }}
                        />
                        <div className="slider-markers">
                            <span>0%</span>
                            <span>25%</span>
                            <span>50%</span>
                            <span>75%</span>
                            <span>100%</span>
                        </div>
                    </div>
                    <div className="threshold-display">
                        <span className="threshold-value">{threshold}%</span>
                        <p className="threshold-hint">
                            Imágenes con confianza mayor a {threshold}% serán bloqueadas
                        </p>
                    </div>
                </div>

                {/* Toggle Switches */}
                <div className="config-section toggles">
                    <div className="toggle-item">
                        <div className="toggle-info">
                            <p className="toggle-title">Detectar Desnudez Explícita</p>
                            <p className="toggle-description">Bloquea contenido con desnudez visible</p>
                        </div>
                        <button
                            onClick={() => setExplicitNudity(!explicitNudity)}
                            className={`toggle ${explicitNudity ? 'active' : ''}`}
                        >
                            <span className={`toggle-thumb ${explicitNudity ? 'active' : ''}`}></span>
                        </button>
                    </div>

                    <div className="toggle-item">
                        <div className="toggle-info">
                            <p className="toggle-title">Detectar Contenido Sugestivo</p>
                            <p className="toggle-description">Bloquea contenido provocativo o insinuante</p>
                        </div>
                        <button
                            onClick={() => setSuggestive(!suggestive)}
                            className={`toggle ${suggestive ? 'active' : ''}`}
                        >
                            <span className={`toggle-thumb ${suggestive ? 'active' : ''}`}></span>
                        </button>
                    </div>
                </div>

                {/* Save Button */}
                <div className="config-section">
                    <button className="save-button" onClick={handleSave}>
                        Guardar Configuración
                        <ChevronRight className="save-icon" />
                    </button>
                    <p className="save-hint">
                        Los cambios se aplicarán inmediatamente a nuevos análisis
                    </p>
                    {saved && (
                        <div className="save-success">
                            ✓ Configuración guardada correctamente
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Screen6;
