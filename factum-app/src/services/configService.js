import { STORAGE_KEYS, DEFAULT_CONFIG } from '../utils/constants';

/**
 * Obtiene la configuración actual
 * @returns {Object} Configuración
 */
export const getConfig = () => {
    try {
        const config = localStorage.getItem(STORAGE_KEYS.CONFIG);
        return config ? JSON.parse(config) : DEFAULT_CONFIG;
    } catch (error) {
        console.error('Error getting config:', error);
        return DEFAULT_CONFIG;
    }
};

/**
 * Guarda la configuración
 * @param {Object} config - Configuración a guardar
 */
export const saveConfig = (config) => {
    try {
        const mergedConfig = {
            ...DEFAULT_CONFIG,
            ...config
        };
        localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(mergedConfig));
        return mergedConfig;
    } catch (error) {
        console.error('Error saving config:', error);
        throw new Error('No se pudo guardar la configuración.');
    }
};

/**
 * Resetea la configuración a valores por defecto
 */
export const resetConfig = () => {
    try {
        localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(DEFAULT_CONFIG));
        return DEFAULT_CONFIG;
    } catch (error) {
        console.error('Error resetting config:', error);
        throw new Error('No se pudo resetear la configuración.');
    }
};

/**
 * Obtiene el threshold actual
 * @returns {number} Threshold value
 */
export const getThreshold = () => {
    const config = getConfig();
    return config.threshold || DEFAULT_CONFIG.threshold;
};

/**
 * Actualiza solo el threshold
 * @param {number} threshold - Nuevo threshold
 */
export const updateThreshold = (threshold) => {
    const config = getConfig();
    return saveConfig({ ...config, threshold });
};
