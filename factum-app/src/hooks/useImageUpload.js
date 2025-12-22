import { useState, useCallback } from 'react';
import { getPresignedUrl, uploadToS3 } from '../services/apiService';
import { validateFile } from '../utils/helpers';

/**
 * Custom hook para gestionar la carga de imágenes
 */
export const useImageUpload = () => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [preview, setPreview] = useState(null);

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
            // Crear preview
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Paso 1: Obtener presigned URL
            setProgress(30);
            const { uploadUrl, imageKey } = await getPresignedUrl(file.name, file.type);

            // Paso 2: Subir a S3
            setProgress(60);
            await uploadToS3(uploadUrl, file);

            setProgress(100);

            // Retornar datos de la imagen
            return {
                key: imageKey,
                name: file.name,
                type: file.type,
                url: preview
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
    }, [preview]);

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
