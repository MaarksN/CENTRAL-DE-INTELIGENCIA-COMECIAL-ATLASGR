import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { logger } from '../logger.js';

const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT || 'http://localhost:9000';
const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY || 'minioadmin';
const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY || 'minioadmin';
const BUCKET_NAME = process.env.STORAGE_BUCKET || 'prospector-assets';

export const s3 = new S3Client({
    endpoint: MINIO_ENDPOINT,
    region: 'us-east-1', // MinIO default
    credentials: {
        accessKeyId: MINIO_ACCESS_KEY,
        secretAccessKey: MINIO_SECRET_KEY,
    },
    forcePathStyle: true, // Crucial for MinIO
});

export const getUploadUrl = async (key: string, contentType: string) => {
    try {
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            ContentType: contentType,
        });
        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
        return { signedUrl, key };
    } catch (err) {
        logger.error({ err, key }, 'Error generating upload URL');
        throw new Error('Failed to generate upload URL');
    }
};

export const getDownloadUrl = async (key: string) => {
    try {
        const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        });
        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
        return { signedUrl, key };
    } catch (err) {
        logger.error({ err, key }, 'Error generating download URL');
        throw new Error('Failed to generate download URL');
    }
};
