import { Request, Response, NextFunction } from 'express';
import { auth } from '../../lib/auth.js';
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
        const session = await auth.api.getSession({
            // @ts-expect-error Better Auth uses web-standard Headers, Express uses IncomingHttpHeaders
            headers: req.headers
        });

        if (!session) {
            res.status(401).json({ success: false, error: 'Access denied. Authentication required.' });
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const user = session.user as any;

        if (!user.organizationId) {
            logger.warn({ userId: user.id }, 'Authenticated user has no organizationId');
            res.status(403).json({ success: false, error: 'User not associated with any organization.' });
            return;
        }

        (req as AuthRequest).user = {
            id: user.id,
            email: user.email,
            role: (user.role as string) || 'VISUALIZADOR',
            organizationId: user.organizationId as string,
        };

        next();
    } catch (err) {
        logger.error({ err }, 'Authentication middleware error');
        res.status(403).json({ success: false, error: 'Invalid session.' });
    }
};
