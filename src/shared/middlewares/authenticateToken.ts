import { Request, Response, NextFunction } from 'express';
import { auth } from '../../lib/auth.js';
import { prisma } from '../../lib/prisma.js';

export interface AuthUser {
    id: string;
    email: string;
    role: string;
    organizationId: string;
}

export interface AuthRequest extends Request {
    user: AuthUser;
}

let devOrgReady: Promise<unknown> | null = null;

function ensureDevOrganization() {
    if (!devOrgReady) {
        devOrgReady = prisma.organization.upsert({
            where: { id: 'dev-org-id' },
            update: {},
            create: { id: 'dev-org-id', name: 'Dev Organization' },
        }).catch((error) => {
            devOrgReady = null; 
            throw error;
        });
    }
    return devOrgReady;
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const session = await auth.api.getSession({
            // @ts-ignore
            headers: req.headers
        });
        
        if (!session) {
            if (process.env.NODE_ENV !== 'production') {
                await ensureDevOrganization();
                (req as AuthRequest).user = {
                    id: 'dev-user-id',
                    email: 'dev@example.com',
                    role: 'ADMIN',
                    organizationId: 'dev-org-id',
                };
                return next();
            }
            return res.status(401).json({ success: false, error: 'Access denied. No session provided.' });
        }

        (req as AuthRequest).user = {
            id: session.user.id,
            email: session.user.email,
            role: (session.user as any).role || 'VISUALIZADOR',
            organizationId: (session.user as any).organizationId
        };
        next();
    } catch (err) {
        return res.status(403).json({ success: false, error: 'Invalid session.' });
    }
};
