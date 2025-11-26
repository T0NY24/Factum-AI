import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { getPresignedUrl, uploadToS3 } from '../services/apiService';
import './ImageUploader.css';

const ImageUploader = ({ onUploadComplete, onUploadError }) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [progress, setProgress] = useState(0);

    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];

        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            onUploadError('Por favor selecciona un archivo de imagen válido.');
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            onUploadError('La imagen es demasiado grande. Máximo 10MB.');
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onload = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Upload to S3
        setUploading(true);
        setProgress(10);

        try {
            // Step 1: Get presigned URL
            setProgress(30);
            const { uploadUrl, imageKey } = await getPresignedUrl(file.name, file.type);

            // Step 2: Upload to S3
            setProgress(60);
            await uploadToS3(uploadUrl, file);

            setProgress(100);

            // Notify parent component
            onUploadComplete(imageKey, file.name);
        } catch (error) {
            console.error('Upload error:', error);
            onUploadError(error.message || 'Error al subir la imagen.');
            setPreview(null);
        } finally {
            setUploading(false);
            setProgress(0);
        }
    }, [onUploadComplete, onUploadError]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
        },
        multiple: false,
        disabled: uploading
    });

    return (
        <div className="uploader-container">
            <div
                {...getRootProps()}
                className={`dropzone ${isDragActive ? 'active' : ''} ${uploading ? 'uploading' : ''}`}
            >
                <input {...getInputProps()} />

                {preview ? (
                    <div className="preview-container">
                        <img src={preview} alt="Preview" className="preview-image" />
                        {uploading && (
                            <div className="upload-overlay">
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                                </div>
                                <p className="upload-text">Subiendo... {progress}%</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="dropzone-content">
                        <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <h3>Arrastra una imagen aquí</h3>
                        <p>o haz click para seleccionar</p>
                        <span className="file-types">PNG, JPG, GIF, WEBP (máx. 10MB)</span>
                    </div>
                )}
            </div>

            {uploading && !preview && (
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Procesando...</p>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
