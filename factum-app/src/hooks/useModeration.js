import { useState, useCallback, useEffect } from 'react';
import { moderateImage } from '../services/apiService';
import { getThreshold } from '../services/configService';
import { PROCESSING_STEPS } from '../utils/constants';

/**
 * Custom hook para gestionar el análisis de moderación
 */
export const useModeration = () => {
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [currentStep, setCurrentStep] = useState(null);
    const [steps, setSteps] = useState([
        { id: PROCESSING_STEPS.UPLOADING, title: '1. Subiendo a S3...', status: 'pending', message: '' },
        { id: PROCESSING_STEPS.LAMBDA, title: '2. Invocando AWS Lambda...', status: 'pending', message: '' },
        { id: PROCESSING_STEPS.REKOGNITION, title: '3. Consultando Amazon Rekognition...', status: 'pending', message: '' }
    ]);

    const updateStepStatus = useCallback((stepId, status, message = '') => {
        setSteps(prevSteps =>
            prevSteps.map(step =>
                step.id === stepId ? { ...step, status, message } : step
            )
        );
    }, []);

    const analyzeImage = useCallback(async (imageKey) => {
        setAnalyzing(true);
        setError(null);
        setResult(null);

        try {
            // Paso 1: Subiendo a S3 (ya completado en upload)
            setCurrentStep(PROCESSING_STEPS.UPLOADING);
            updateStepStatus(PROCESSING_STEPS.UPLOADING, 'completed', 'Completado');
            await new Promise(resolve => setTimeout(resolve, 500));

            // Paso 2: Invocando Lambda
            setCurrentStep(PROCESSING_STEPS.LAMBDA);
            updateStepStatus(PROCESSING_STEPS.LAMBDA, 'loading', 'Procesando...');
            await new Promise(resolve => setTimeout(resolve, 800));
            updateStepStatus(PROCESSING_STEPS.LAMBDA, 'completed', 'Completado');

            // Paso 3: Consultando Rekognition
            setCurrentStep(PROCESSING_STEPS.REKOGNITION);
            updateStepStatus(PROCESSING_STEPS.REKOGNITION, 'loading', 'Procesando...');

            const threshold = getThreshold();
            const moderationResult = await moderateImage(imageKey, threshold);

            updateStepStatus(PROCESSING_STEPS.REKOGNITION, 'completed', 'Completado');
            setResult(moderationResult);

            return moderationResult;
        } catch (err) {
            console.error('Moderation error:', err);
            setError(err.message || 'Error al analizar la imagen.');
            updateStepStatus(currentStep, 'error', 'Error');
            return null;
        } finally {
            setAnalyzing(false);
            setCurrentStep(null);
        }
    }, [currentStep, updateStepStatus]);

    const resetModeration = useCallback(() => {
        setAnalyzing(false);
        setResult(null);
        setError(null);
        setCurrentStep(null);
        setSteps([
            { id: PROCESSING_STEPS.UPLOADING, title: '1. Subiendo a S3...', status: 'pending', message: '' },
            { id: PROCESSING_STEPS.LAMBDA, title: '2. Invocando AWS Lambda...', status: 'pending', message: '' },
            { id: PROCESSING_STEPS.REKOGNITION, title: '3. Consultando Amazon Rekognition...', status: 'pending', message: '' }
        ]);
    }, []);

    return {
        analyzing,
        result,
        error,
        currentStep,
        steps,
        analyzeImage,
        resetModeration
    };
};
