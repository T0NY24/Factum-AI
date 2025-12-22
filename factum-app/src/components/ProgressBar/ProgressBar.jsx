import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ label, value, color = '#16a34a' }) => {
    const displayValue = Math.round(value * 100) / 100; // Redondear a 2 decimales

    return (
        <div className="progress-bar-container">
            <div className="progress-bar-header">
                <span className="progress-bar-label">{label}</span>
                <span className="progress-bar-value" style={{ color }}>
                    {displayValue}%
                </span>
            </div>
            <div className="progress-bar-track">
                <div
                    className="progress-bar-fill"
                    style={{
                        width: `${Math.min(value, 100)}%`,
                        backgroundColor: color
                    }}
                ></div>
            </div>
        </div>
    );
};

export default ProgressBar;
