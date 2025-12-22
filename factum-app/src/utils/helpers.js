// Funciones helper de utilidad

/**
 * Formatea una fecha a formato legible en español
 * @param {number|string} timestamp - Timestamp o fecha
 * @returns {string} Fecha formateada
 */
export const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
};

/**
 * Valida un archivo de imagen
 * @param {File} file - Archivo a validar
 * @returns {{valid: boolean, error: string|null}}
 */
export const validateFile = (file) => {
    if (!file) {
        return { valid: false, error: 'No se seleccionó ningún archivo.' };
    }

    if (!file.type.startsWith('image/')) {
        return { valid: false, error: 'Por favor selecciona un archivo de imagen válido.' };
    }

    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
        return { valid: false, error: 'La imagen es demasiado grande. Máximo 10MB.' };
    }

    return { valid: true, error: null };
};

/**
 * Obtiene el color según el nivel de confianza
 * @param {number} confidence - Nivel de confianza (0-100)
 * @param {boolean} isInappropriate - Si el contenido es inapropiado
 * @returns {string} Color CSS
 */
export const getModerationColor = (confidence, isInappropriate) => {
    if (isInappropriate) {
        if (confidence >= 90) return '#dc2626'; // red-600
        if (confidence >= 70) return '#ea580c'; // orange-600
        return '#f59e0b'; // amber-500
    }
    return '#16a34a'; // green-600
};

/**
 * Trunca un texto a una longitud máxima
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @returns {string} Texto truncado
 */
export const truncateText = (text, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

/**
 * Genera un ID único
 * @returns {string} ID único
 */
export const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
};
