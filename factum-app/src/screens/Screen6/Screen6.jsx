import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Sliders, Info } from 'lucide-react';
import { toast } from 'sonner';
import { getConfig, saveConfig } from '../../services/configService';
import PrimaryButton from '../../components/UI/PrimaryButton';
import './Screen6.css';

const Screen6 = () => {
    const [explicitNudity, setExplicitNudity] = useState(true);
    const [suggestive, setSuggestive] = useState(false);

    // Cargar configuración al montar
    useEffect(() => {
        const config = getConfig();
        setExplicitNudity(config.explicitNudity);
        setSuggestive(config.suggestive);
    }, []);

    const handleSave = () => {
        try {
            saveConfig({
                explicitNudity,
                suggestive
            });

            toast.success('✅ Configuración guardada correctamente');
        } catch (error) {
            console.error('Error saving config:', error);
            toast.error('Error al guardar la configuración');
        }
    };

    return (
        <div className="screen6-container">
            <div className="screen6-header">
                <Sliders className="screen6-header-icon" />
                <div>
                    <h2 className="screen6-title">Configuración de Moderación</h2>
                    <p className="screen6-subtitle">Ajusta los parámetros de detección de AWS Rekognition</p>
                </div>
            </div>

            <div className="screen6-content">
                {/* Card: Detecciones */}
                <div className="config-card">
                    <div className="config-card-header">
                        <AlertTriangle className="config-card-icon" />
                        <div>
                            <h3 className="config-card-title">Categorías a Detectar</h3>
                            <p className="config-card-description">
                                Selecciona qué tipos de contenido moderarás
                            </p>
                        </div>
                    </div>

                    <div className="toggles-list">
                        <div className="toggle-item">
                            <div className="toggle-info">
                                <p className="toggle-title">Desnudez Explícita</p>
                                <p className="toggle-description">
                                    Detecta contenido con desnudez visible, actividad sexual, y material adulto
                                </p>
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
                                <p className="toggle-title">Contenido Sugestivo</p>
                                <p className="toggle-description">
                                    Detecta ropa reveladora, poses provocativas, y contenido insinuante
                                </p>
                            </div>
                            <button
                                onClick={() => setSuggestive(!suggestive)}
                                className={`toggle ${suggestive ? 'active' : ''}`}
                            >
                                <span className={`toggle-thumb ${suggestive ? 'active' : ''}`}></span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Info Card */}
                <div className="config-info-card">
                    <Info size={20} />
                    <p>
                        Los cambios se aplicarán inmediatamente a nuevos análisis.
                        El historial no se verá afectado.
                    </p>
                </div>

                {/* Save Button */}
                <PrimaryButton onClick={handleSave} style={{ width: '100%', padding: '1rem' }}>
                    <Shield size={18} />
                    Guardar Configuración
                </PrimaryButton>
            </div>
        </div>
    );
};

export default Screen6;
