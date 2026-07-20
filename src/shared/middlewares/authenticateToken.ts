import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma.js';
import { logger } from '../../lib/logger.js';

export interface AuthUser {
    id: string;
    email: string;
    role: string;
    organizationId: string;
}

export interface AuthRequest extends Request {
    user: AuthUser;
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await prisma.user.findFirst();
        if (!user) {
            res.status(401).json({ success: false, error: 'No users found in DB to mock auth.' });
            return;
        }

        (req as AuthRequest).user = {
            id: user.id,
            email: user.email,
            role: user.role || 'ADMINISTRADOR',
            organizationId: user.organizationId,
        };

        next();
    } catch (err) {
        logger.error({ err }, 'Authentication middleware error');
        res.status(500).json({ success: false, error: 'Internal server error in auth mock.' });
    }
};
