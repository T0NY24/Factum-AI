import { STORAGE_KEYS } from '../utils/constants';
import { generateId } from '../utils/helpers';

/**
 * Guarda un análisis en el historial
 * @param {Object} imageData - Datos de la imagen
 * @param {Object} result - Resultado del análisis
 */
export const saveToHistory = (imageData, result) => {
    try {
        const history = getHistory();
        const newEntry = {
            id: generateId(),
            imageName: imageData.name,
            imageUrl: imageData.url,
            imageKey: imageData.key,
            status: result.isInappropriate ? 'unsafe' : 'safe',
            confidence: result.confidence,
            labels: result.labels,
            date: new Date().toISOString(),
            timestamp: Date.now()
        };

        history.unshift(newEntry);

        // Limitar a 100 entradas
        const limitedHistory = history.slice(0, 100);

        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(limitedHistory));
    } catch (error) {
        console.error('Error saving to history:', error);
    }
};

/**
 * Obtiene todo el historial
 * @returns {Array} Historial de análisis
 */
export const getHistory = () => {
    try {
        const history = localStorage.getItem(STORAGE_KEYS.HISTORY);
        return history ? JSON.parse(history) : [];
    } catch (error) {
        console.error('Error getting history:', error);
        return [];
    }
};

/**
 * Filtra el historial por estado
 * @param {string} status - 'safe', 'unsafe' o 'all'
 * @returns {Array} Historial filtrado
 */
export const filterHistory = (status) => {
    const history = getHistory();

    if (status === 'all') {
        return history;
    }

    return history.filter(item => item.status === status);
};

/**
 * Limpia todo el historial
 */
export const clearHistory = () => {
    try {
        localStorage.removeItem(STORAGE_KEYS.HISTORY);
    } catch (error) {
        console.error('Error clearing history:', error);
    }
};

/**
 * Obtiene un elemento específico del historial por ID
 * @param {string} id - ID del elemento
 * @returns {Object|null} Elemento del historial o null
 */
export const getHistoryItem = (id) => {
    const history = getHistory();
    return history.find(item => item.id === id) || null;
};
