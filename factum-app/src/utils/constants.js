// Constantes globales de la aplicación

// Nombres de las pantallas
export const SCREEN_NAMES = {
    1: 'Zona de Aterrizaje',
    2: 'Procesando',
    3: 'Contenido Seguro',
    4: 'Contenido Inapropiado',
    5: 'Historial',
    6: 'Configuración'
};

// Estados de contenido
export const STATUS_SAFE = 'safe';
export const STATUS_UNSAFE = 'unsafe';

// Límites de archivo
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Formatos aceptados
export const ACCEPTED_FORMATS = {
    'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
};

// Pasos de procesamiento
export const PROCESSING_STEPS = {
    UPLOADING: 'uploading',
    LAMBDA: 'lambda',
    REKOGNITION: 'rekognition'
};

// Storage keys
export const STORAGE_KEYS = {
    HISTORY: 'factum_history',
    CONFIG: 'factum_config'
};

// Configuración por defecto
export const DEFAULT_CONFIG = {
    threshold: 85,
    explicitNudity: true,
    suggestive: false
};
