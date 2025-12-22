import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:3001';

/**
 * Request a presigned URL from API Gateway to upload image to S3
 * @param {string} fileName - Name of the file to upload
 * @param {string} fileType - MIME type of the file
 * @returns {Promise<{uploadUrl: string, imageKey: string}>}
 */
export const getPresignedUrl = async (fileName, fileType) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/presigned-url`, {
            fileName,
            fileType,
        });
        return response.data;
    } catch (error) {
        console.error('Error getting presigned URL:', error);
        throw new Error('No se pudo obtener la URL de carga. Verifica la configuración de API Gateway.');
    }
};

/**
 * Upload image to S3 using presigned URL
 * @param {string} presignedUrl - Presigned URL from S3
 * @param {File} file - File object to upload
 * @returns {Promise<void>}
 */
export const uploadToS3 = async (presignedUrl, file) => {
    try {
        await axios.put(presignedUrl, file, {
            headers: {
                'Content-Type': file.type,
            },
        });
    } catch (error) {
        console.error('Error uploading to S3:', error);
        throw new Error('Error al subir la imagen a S3.');
    }
};

/**
 * Request image moderation analysis from API Gateway
 * @param {string} imageKey - S3 key of the uploaded image
 * @param {number} threshold - Optional threshold for moderation (0-100)
 * @returns {Promise<{isInappropriate: boolean, labels: Array, confidence: number}>}
 */
export const moderateImage = async (imageKey, threshold = 85) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/moderate`, {
            imageKey,
            threshold
        });
        return response.data;
    } catch (error) {
        console.error('Error moderating image:', error);
        throw new Error('Error al analizar la imagen.');
    }
};

