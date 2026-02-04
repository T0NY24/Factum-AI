import React, { useState } from 'react';
import { Shield, AlertTriangle, Eye, EyeOff, Calendar, XCircle } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import ConfidenceBadge from '../UI/ConfidenceBadge';
import ImageModal from '../ImageModal/ImageModal';
import './HistoryCard.css';

const HistoryCard = ({ item }) => {
    const status = item.status; // 'safe', 'suggestive', 'unsafe'
    const isUnsafe = status === 'unsafe';
    const isSuggestive = status === 'suggestive';
    const shouldBlur = isUnsafe; // Solo blur para unsafe, no para suggestive

    // Estado local para permitir revelar imagen sensible
    const [isRevealed, setIsRevealed] = useState(false);
    // Estado para el modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Formatear fecha
    const dateStr = item.date ? formatDate(item.date) : formatDate(item.timestamp);

    // Determinar clase CSS según status
    const getCardClass = () => {
        if (isUnsafe) return 'unsafe';
        if (isSuggestive) return 'suggestive';
        return 'safe';
    };

    // Renderizar badge según status
    const renderBadge = () => {
        if (isUnsafe) {
            return (
                <span className="badge badge-unsafe">
                    <XCircle size={12} /> Inseguro
                </span>
            );
        }
        if (isSuggestive) {
            return (
                <span className="badge badge-warning">
                    <AlertTriangle size={12} /> Sugestivo
                </span>
            );
        }
        return (
            <span className="badge badge-safe">
                <Shield size={12} /> Seguro
            </span>
        );
    };

    // Renderizar icono fallback según status
    const renderFallbackIcon = () => {
        if (isUnsafe) {
            return <XCircle className="history-icon unsafe" />;
        }
        if (isSuggestive) {
            return <AlertTriangle className="history-icon suggestive" />;
        }
        return <Shield className="history-icon safe" />;
    };

    const handleCardClick = () => {
        setIsModalOpen(true);
    };

    return (
        <>
            <div
                className={`history-card ${getCardClass()}`}
                onClick={handleCardClick}
                style={{ cursor: 'pointer' }}
            >
                {/* Zona de imagen */}
                <div className="history-image-container">
                    {item.imageUrl ? (
                        <>
                            <img
                                src={item.imageUrl}
                                alt={item.imageName || 'Imagen analizada'}
                                className={`history-img ${shouldBlur && !isRevealed ? 'blurred' : ''}`}
                            />

                            {/* Overlay para contenido unsafe */}
                            {shouldBlur && !isRevealed && (
                                <div className="unsafe-overlay" onClick={(e) => e.stopPropagation()}>
                                    <AlertTriangle size={24} color="#e f4444" />
                                    <span>Contenido Sensible</span>
                                    <button
                                        className="reveal-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsRevealed(true);
                                        }}
                                    >
                                        <Eye size={16} /> Ver
                                    </button>
                                </div>
                            )}

                            {/* Botón para volver a ocultar */}
                            {shouldBlur && isRevealed && (
                                <button
                                    className="hide-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsRevealed(false);
                                    }}
                                >
                                    <EyeOff size={16} /> Ocultar
                                </button>
                            )}
                        </>
                    ) : (
                        // Fallback si no hay imagen
                        <div className="history-icon-fallback">
                            {renderFallbackIcon()}
                        </div>
                    )}
                </div>

                {/* Zona de datos */}
                <div className="history-details">
                    <div className="history-header">
                        <span className="history-name" title={item.imageName}>
                            {item.imageName || 'Sin nombre'}
                        </span>
                        {renderBadge()}
                    </div>

                    <div className="history-meta">
                        <div className="meta-row">
                            <Calendar size={12} />
                            <span>{dateStr}</span>
                        </div>
                        <div className="meta-row">
                            <ConfidenceBadge value={item.confidence || 0} />
                        </div>
                    </div>
                </div>
            </div>

            <ImageModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                imageData={{
                    imageUrl: item.imageUrl,
                    imageName: item.imageName,
                    status: item.status,
                    confidence: item.confidence,
                    labels: item.labels || [],
                    date: item.date || item.timestamp
                }}
            />
        </>
    );
};

export default HistoryCard;
