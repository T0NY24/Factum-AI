import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

                <motion.div
                    {...getRootProps()}
                    initial={false}
                    animate={{
                        borderColor: isDragActive ? '#3b82f6' : '#d1d5db',
                        backgroundColor: isDragActive ? '#eff6ff' : '#f9fafb',
                        scale: isDragActive ? 1.02 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                    className={`screen1-dropzone relative overflow-hidden group ${isDragActive ? 'active' : ''} ${uploading ? 'uploading' : ''}`}
                >
                    <input {...getInputProps()} />

                    {/* Anillo de luz animado de fondo */}
                    <AnimatePresence>
                        {isDragActive && (
                            <motion.div
                                layoutId="active-ring"
                                className="absolute inset-0 border-4 border-blue-400 opacity-50 rounded-xl pointer-events-none"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 0.5, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                            />
                        )}
                    </AnimatePresence>

                    <div className="relative z-10 flex flex-col items-center">
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
                </motion.div>

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
