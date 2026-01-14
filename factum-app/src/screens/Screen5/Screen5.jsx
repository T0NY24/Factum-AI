import React from 'react';
import { Trash2 } from 'lucide-react';
import { useHistory } from '../../hooks/useHistory';
import { clearHistory } from '../../services/historyService';
import HistoryCard from '../../components/HistoryCard/HistoryCard';
import './Screen5.css';

const Screen5 = () => {
    const { history, filter, applyFilter, getStats, refreshHistory } = useHistory();
    const stats = getStats();

    const handleClearHistory = () => {
        if (window.confirm('¿Estás seguro de que deseas borrar todo el historial?')) {
            clearHistory();
            refreshHistory(); // Refrescar la lista después de borrar
        }
    };

    return (
        <div className="screen5-container">
            <div className="screen5-header">
                <div className="screen5-title-row">
                    <h2 className="screen5-title">Historial de Análisis</h2>
                    {history.length > 0 && (
                        <button
                            className="clear-history-btn"
                            onClick={handleClearHistory}
                            title="Borrar todo el historial"
                        >
                            <Trash2 size={16} />
                            Borrar Todo
                        </button>
                    )}
                </div>
                <div className="screen5-filters">
                    <button
                        className={`filter-button ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => applyFilter('all')}
                    >
                        Todos
                    </button>
                    <button
                        className={`filter-button safe ${filter === 'safe' ? 'active' : ''}`}
                        onClick={() => applyFilter('safe')}
                    >
                        <span className="filter-dot safe"></span>
                        Seguros
                    </button>
                    <button
                        className={`filter-button suggestive ${filter === 'suggestive' ? 'active' : ''}`}
                        onClick={() => applyFilter('suggestive')}
                    >
                        <span className="filter-dot suggestive"></span>
                        Sugestivos
                    </button>
                    <button
                        className={`filter-button unsafe ${filter === 'unsafe' ? 'active' : ''}`}
                        onClick={() => applyFilter('unsafe')}
                    >
                        <span className="filter-dot unsafe"></span>
                        Inapropiados
                    </button>
                </div>
            </div>

            {history.length === 0 ? (
                <div className="screen5-empty">
                    <p>No hay análisis en el historial todavía.</p>
                    <p className="empty-hint">Los análisis aparecerán aquí automáticamente después de procesar imágenes.</p>
                </div>
            ) : (
                <div className="screen5-grid">
                    {history.map(item => (
                        <HistoryCard key={item.id} item={item} />
                    ))}
                </div>
            )}

            {history.length > 0 && (
                <div className="screen5-stats">
                    <div className="stat-item">
                        <span className="stat-label">Total:</span>
                        <span className="stat-value">{stats.total}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Seguros:</span>
                        <span className="stat-value safe">{stats.safe}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Sugestivos:</span>
                        <span className="stat-value suggestive">{stats.suggestive}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Bloqueados:</span>
                        <span className="stat-value unsafe">{stats.unsafe}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Screen5;
