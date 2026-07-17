import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export const generateApiKey = (): string => {
    return crypto.randomBytes(32).toString('hex');
};

export const validateApiKeyMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-api-key'];
    const validApiKey = process.env.VALID_API_KEY || 'default-dev-api-key';

    if (!apiKey || apiKey !== validApiKey) {
        res.status(401).json({ error: 'Invalid or missing API Key' });
        return;
    }

    next();
};
