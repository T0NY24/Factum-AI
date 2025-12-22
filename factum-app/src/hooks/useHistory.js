import { useState, useEffect, useCallback } from 'react';
import { getHistory, filterHistory as filterHistoryService, clearHistory as clearHistoryService } from '../services/historyService';
import { STATUS_SAFE, STATUS_UNSAFE } from '../utils/constants';

/**
 * Custom hook para gestionar el historial
 */
export const useHistory = () => {
    const [history, setHistory] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    // Cargar historial inicial
    useEffect(() => {
        loadHistory();
    }, [filter]);

    const loadHistory = useCallback(() => {
        setLoading(true);
        try {
            const data = filter === 'all' ? getHistory() : filterHistoryService(filter);
            setHistory(data);
        } catch (error) {
            console.error('Error loading history:', error);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    const applyFilter = useCallback((newFilter) => {
        setFilter(newFilter);
    }, []);

    const clearHistory = useCallback(() => {
        try {
            clearHistoryService();
            setHistory([]);
        } catch (error) {
            console.error('Error clearing history:', error);
        }
    }, []);

    const refreshHistory = useCallback(() => {
        loadHistory();
    }, [loadHistory]);

    const getStats = useCallback(() => {
        const allHistory = getHistory();
        return {
            total: allHistory.length,
            safe: allHistory.filter(item => item.status === STATUS_SAFE).length,
            unsafe: allHistory.filter(item => item.status === STATUS_UNSAFE).length
        };
    }, []);

    return {
        history,
        filter,
        loading,
        applyFilter,
        clearHistory,
        refreshHistory,
        getStats
    };
};
