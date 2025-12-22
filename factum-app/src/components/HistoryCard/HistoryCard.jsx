import React from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import './HistoryCard.css';

const HistoryCard = ({ item, onClick }) => {
    const isSafe = item.status === 'safe';

    return (
        <div
            className={`history-card ${isSafe ? 'safe' : 'unsafe'}`}
            onClick={onClick}
        >
            <div className="history-card-image">
                {isSafe ? (
                    <Shield className="history-icon safe" />
                ) : (
                    <AlertTriangle className="history-icon unsafe" />
                )}
            </div>
            <div className="history-card-info">
                <p className="history-date">{formatDate(item.date)}</p>
                <p className={`history-status ${isSafe ? 'safe' : 'unsafe'}`}>
                    {isSafe ? 'Seguro' : 'Bloqueado'}
                </p>
            </div>
        </div>
    );
};

export default HistoryCard;
