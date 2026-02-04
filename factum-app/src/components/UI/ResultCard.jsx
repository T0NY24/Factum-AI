import React from 'react';
import { translateLabel } from '../../utils/translations';
import ConfidenceBadge from './ConfidenceBadge';
import './SecurityCard.css';

const ResultCard = ({ labels }) => {
    return (
        <div className="security-card">
            {labels.map((label, index) => (
                <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    backgroundColor: 'var(--color-gray-50)',
                    marginBottom: '0.75rem'
                }}>

                    {/* Nombre Traducido */}
                    <span style={{ fontWeight: 500, color: 'var(--color-gray-700)', textTransform: 'capitalize' }}>
                        {translateLabel(label.Name)}
                    </span>

                    {/* Badge de Confianza */}
                    <ConfidenceBadge value={label.Confidence} />

                </div>
            ))}
        </div>
    );
};

export default ResultCard;
