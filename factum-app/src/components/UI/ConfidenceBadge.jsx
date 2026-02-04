import React from 'react';
import './ConfidenceBadge.css';

const ConfidenceBadge = ({ value }) => {
    // Definir colores según el valor
    const getBadgeClass = () => {
        if (value >= 90) return "badge-green";
        if (value >= 70) return "badge-yellow";
        return "badge-red";
    };

    return (
        <span className={`confidence-badge ${getBadgeClass()} font-mono`}>
            {/* Círculo indicador */}
            <span className="confidence-dot" />
            {value.toFixed(1)}% CONFIDENCE
        </span>
    );
};

export default ConfidenceBadge;
