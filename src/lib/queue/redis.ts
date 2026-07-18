import Redis from 'ioredis';
import { logger } from '../logger.js';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Connection instance for standard queue operations
export const connection = new Redis(redisUrl, {
    maxRetriesPerRequest: null, // Required by BullMQ
});

connection.on('error', (err) => {
    logger.error({ err }, 'Redis connection error');
});

connection.on('connect', () => {
    logger.info('Connected to Redis successfully');
});
