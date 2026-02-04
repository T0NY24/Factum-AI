import React from 'react';
import { X, Shield, AlertTriangle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { translateLabel } from '../../utils/translations';
import ConfidenceBadge from '../UI/ConfidenceBadge';
import './ImageModal.css';

const ImageModal = ({ isOpen, onClose, imageData }) => {
    if (!isOpen || !imageData) return null;

    const { imageUrl, imageName, status, confidence, labels = [], date } = imageData;

    const getStatusIcon = () => {
        if (status === 'safe') return <Shield size={20} />;
        if (status === 'suggestive') return <AlertTriangle size={20} />;
        return <XCircle size={20} />;
    };

    const getStatusText = () => {
        if (status === 'safe') return 'Contenido Seguro';
        if (status === 'suggestive') return 'Contenido Sugestivo';
        return 'Contenido Inseguro';
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="image-modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleOverlayClick}
                >
                    <motion.div
                        className="image-modal-content"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: 'spring', damping: 20 }}
                    >
                        <button className="image-modal-close" onClick={onClose}>
                            <X size={20} />
                        </button>

                        <div className="image-modal-image-container">
                            <img
                                src={imageUrl}
                                alt={imageName || 'Imagen analizada'}
                                className="image-modal-image"
                            />
                        </div>

                        <div className="image-modal-details">
                            <div className="image-modal-header">
                                <span className={`image-modal-status ${status}`}>
                                    {getStatusIcon()}
                                    {getStatusText()}
                                </span>
                            </div>

                            <h2 className="image-modal-title">{imageName || 'Sin nombre'}</h2>
                            {date && (
                                <p className="image-modal-subtitle">
                                    Analizado el {new Date(date).toLocaleDateString('es-ES', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            )}

                            {labels && labels.length > 0 && (
                                <div className="image-modal-labels">
                                    <h3 className="image-modal-labels-title">
                                        Etiquetas Detectadas
                                    </h3>
                                    <div className="image-modal-labels-list">
                                        {labels.map((label, index) => (
                                            <div key={index} className="image-modal-label-item">
                                                <span className="image-modal-label-name">
                                                    {translateLabel(label.Name || label.name)}
                                                </span>
                                                <ConfidenceBadge value={label.Confidence || label.confidence} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ImageModal;
