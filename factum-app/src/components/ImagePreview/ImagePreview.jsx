import React, { useState } from 'react';
import { AlertTriangle, EyeOff } from 'lucide-react';
import './ImagePreview.css';

const ImagePreview = ({ imageUrl, blurred = false, showRevealBtn = false, onReveal }) => {
    const [revealed, setRevealed] = useState(false);

    const handleReveal = () => {
        setRevealed(true);
        if (onReveal) onReveal();
    };

    if (blurred && !revealed) {
        return (
            <div className="image-preview-container blurred">
                <div className="blur-overlay"></div>
                <div className="blur-content">
                    <AlertTriangle className="blur-icon alert" />
                    <EyeOff className="blur-icon eye" />
                    <p className="blur-title">Contenido Sensible Detectado</p>
                    {showRevealBtn && (
                        <button className="reveal-btn" onClick={handleReveal}>
                            Revelar (Solo Admin)
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="image-preview-container">
            {imageUrl ? (
                <img src={imageUrl} alt="Preview" className="preview-image" />
            ) : (
                <div className="preview-placeholder">Sin imagen</div>
            )}
        </div>
    );
};

export default ImagePreview;
