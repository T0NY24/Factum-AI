import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({ region: process.env.AWS_REGION || 'us-east-2' });
const BUCKET_NAME = process.env.S3_BUCKET_NAME;
const URL_EXPIRATION = 300; // 5 minutes

/**
 * Lambda handler to generate presigned URL for S3 upload
 * 
 * Expected input:
 * {
 *   "fileName": "example.jpg",
 *   "fileType": "image/jpeg"
 * }
 * 
 * Response:
 * {
 *   "uploadUrl": "https://...",
 *   "imageKey": "uploads/timestamp-filename.jpg"
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
        const { fileName, fileType } = body;

        if (!fileName || !fileType) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'fileName and fileType are required' }),
            };
        }

        // Validate file type
        if (!fileType.startsWith('image/')) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Only image files are allowed' }),
            };
        }

        // Generate unique key for S3
        const timestamp = Date.now();
        const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
        const imageKey = `uploads/${timestamp}-${sanitizedFileName}`;

        // Create S3 PutObject command
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: imageKey,
            ContentType: fileType,
        });

        // Generate presigned URL
        const uploadUrl = await getSignedUrl(s3Client, command, {
            expiresIn: URL_EXPIRATION,
        });

        console.log('Generated presigned URL for:', imageKey);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                uploadUrl,
                imageKey,
                expiresIn: URL_EXPIRATION,
            }),
        };
    } catch (error) {
        console.error('Error generating presigned URL:', error);

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
