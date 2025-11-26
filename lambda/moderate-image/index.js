import { RekognitionClient, DetectModerationLabelsCommand } from '@aws-sdk/client-rekognition';

const rekognitionClient = new RekognitionClient({ region: process.env.AWS_REGION || 'us-east-2' });
const BUCKET_NAME = process.env.S3_BUCKET_NAME;
const CONFIDENCE_THRESHOLD = 70; // Threshold for inappropriate content

/**
 * Lambda handler to moderate images using Amazon Rekognition
 * 
 * Expected input:
 * {
 *   "imageKey": "uploads/timestamp-filename.jpg"
 * }
 * 
 * Response:
 * {
 *   "isInappropriate": true/false,
 *   "confidence": 85.5,
 *   "labels": [...],
 *   "message": "Description message"
 * }
 */
export const handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));

    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
    };

    // Handle OPTIONS preflight request
    if (event.httpMethod === 'OPTIONS' || event.requestContext?.http?.method === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'CORS preflight successful' }),
        };
    }

    try {
        // Parse request body
        const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
        const { imageKey } = body;

        if (!imageKey) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'imageKey is required' }),
            };
        }

        console.log('Moderating image:', imageKey);

        // Call Rekognition DetectModerationLabels
        const command = new DetectModerationLabelsCommand({
            Image: {
                S3Object: {
                    Bucket: BUCKET_NAME,
                    Name: imageKey,
                },
            },
            MinConfidence: 60, // Minimum confidence to return labels
        });

        const response = await rekognitionClient.send(command);
        const moderationLabels = response.ModerationLabels || [];

        console.log('Moderation labels:', JSON.stringify(moderationLabels, null, 2));

        // Check for inappropriate content
        let maxConfidence = 0;
        let isInappropriate = false;
        const detectedLabels = [];

        for (const label of moderationLabels) {
            detectedLabels.push({
                Name: label.Name,
                Confidence: label.Confidence,
                ParentName: label.ParentName,
            });

            if (label.Confidence > maxConfidence) {
                maxConfidence = label.Confidence;
            }

            // Check for explicit content categories
            const explicitCategories = [
                'Explicit Nudity',
                'Nudity',
                'Graphic Male Nudity',
                'Graphic Female Nudity',
                'Sexual Activity',
                'Illustrated Explicit Nudity',
                'Adult Toys',
            ];

            if (explicitCategories.includes(label.Name) && label.Confidence >= CONFIDENCE_THRESHOLD) {
                isInappropriate = true;
            }
        }

        // Prepare response message
        let message;
        if (isInappropriate) {
            message = `Se detectó contenido inapropiado con ${maxConfidence.toFixed(1)}% de confianza. Esta imagen no es apropiada para compartir.`;
        } else if (moderationLabels.length > 0) {
            message = `La imagen parece segura. Se detectaron algunas etiquetas de moderación con baja confianza (${maxConfidence.toFixed(1)}%).`;
        } else {
            message = 'La imagen es segura. No se detectó contenido inapropiado.';
        }

        const result = {
            isInappropriate,
            confidence: maxConfidence,
            labels: detectedLabels,
            message,
            threshold: CONFIDENCE_THRESHOLD,
        };

        console.log('Moderation result:', result);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(result),
        };
    } catch (error) {
        console.error('Error moderating image:', error);

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Internal server error',
                message: error.message,
            }),
        };
    }
};
