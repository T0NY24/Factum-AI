import { useState, useCallback } from 'react';
import { getPresignedUrl, uploadToS3 } from '../services/apiService';
import { validateFile } from '../utils/helpers';

/**
 * Custom hook para gestionar la carga de imágenes
 * Incluye generación de UUID único y preview en base64 para persistencia
 */
export const useImageUpload = () => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [preview, setPreview] = useState(null);

    /**
     * Convierte un archivo a base64 para persistencia en localStorage
     */
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    const handleUpload = useCallback(async (file) => {
        // Validar archivo
        const validation = validateFile(file);
        if (!validation.valid) {
            setError(validation.error);
            return null;
        }

        setError(null);
        setUploading(true);
        setProgress(10);

        try {
            // Generar ID único para esta imagen
            const uniqueId = crypto.randomUUID();

            // Mantener la extensión original
            const extension = file.name.split('.').pop();
            const fileName = `${uniqueId}.${extension}`;

            // Convertir a base64 para persistencia (preview que sobrevive refresh)
            const base64Preview = await fileToBase64(file);
            setPreview(base64Preview);
            setProgress(20);

            // Paso 1: Obtener presigned URL con el nombre UUID
            setProgress(30);
            const { uploadUrl, imageKey } = await getPresignedUrl(fileName, file.type);

            // Paso 2: Subir a S3
            setProgress(60);
            await uploadToS3(uploadUrl, file);

            setProgress(100);

            // Retornar datos de la imagen con UUID y base64
            return {
                id: uniqueId,              // Identificador único
                key: imageKey,             // Ruta en S3 (uploads/uuid.ext)
                name: file.name,           // Nombre original para mostrar
                type: file.type,
                url: base64Preview         // Base64 que persiste en localStorage
            };
        } catch (err) {
            console.error('Upload error:', err);
            setError(err.message || 'Error al subir la imagen.');
            setPreview(null);
            return null;
        } finally {
            setUploading(false);
            setTimeout(() => setProgress(0), 500);
        }
    }, []);

    const resetUpload = useCallback(() => {
        setUploading(false);
        setProgress(0);
        setError(null);
        setPreview(null);
    }, []);

    return {
        uploading,
        progress,
        error,
        preview,
        handleUpload,
        resetUpload
    };
};
