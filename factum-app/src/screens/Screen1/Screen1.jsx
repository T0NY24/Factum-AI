import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Cloud } from 'lucide-react';
import { useImageUpload } from '../../hooks/useImageUpload';
import './Screen1.css';

const Screen1 = ({ onNavigate, onImageSelected }) => {
    const { uploading, progress, error, preview, handleUpload } = useImageUpload();
    const [selectedFile, setSelectedFile] = React.useState(null);

    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setSelectedFile(file);
        const imageData = await handleUpload(file);

        if (imageData) {
            // Notificar al componente padre y navegar automáticamente
            onImageSelected(imageData);
            setTimeout(() => {
                onNavigate(2); // Ir a Screen 2 (Procesando)
            }, 500);
        }
    }, [handleUpload, onImageSelected, onNavigate]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
        },
        multiple: false,
        disabled: uploading
    });

    return (
        <div className="screen1-container">
            <div className="screen1-card">
                <div className="screen1-header">
                    <h2 className="screen1-title">Análisis de Contenido</h2>
                    <p className="screen1-subtitle">Sube una imagen para verificar su contenido con IA</p>
                </div>

                <div
                    {...getRootProps()}
                    className={`screen1-dropzone ${isDragActive ? 'active' : ''} ${uploading ? 'uploading' : ''}`}
                >
                    <input {...getInputProps()} />
                    <Cloud className="screen1-icon" />
                    <p className="screen1-drop-text">
                        Arrastra tu imagen aquí o haz clic para buscar
                    </p>
                    <p className="screen1-formats">Formatos soportados: JPG, PNG, GIF (Máx. 10MB)</p>

                    {uploading && (
                        <div className="upload-progress">
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                            </div>
                            <p className="progress-text">Subiendo... {progress}%</p>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="screen1-error">
                        {error}
                    </div>
                )}

                <div className="screen1-action">
                    <button
                        className="screen1-button"
                        disabled={!selectedFile || uploading}
                    >
                        Analizar Contenido
                    </button>
                    {!selectedFile && !uploading && (
                        <p className="screen1-hint">Primero selecciona una imagen</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Screen1;
