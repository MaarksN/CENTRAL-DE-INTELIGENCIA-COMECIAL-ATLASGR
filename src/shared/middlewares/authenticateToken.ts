import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error('[FATAL] JWT_SECRET environment variable is not set. Server will not start.');
    process.exit(1);
}

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

/** Garante que a organização de desenvolvimento exista (FK obrigatória para Company/Lead/Contact). */
function ensureDevOrganization() {
    if (!devOrgReady) {
        devOrgReady = prisma.organization.upsert({
            where: { id: 'dev-org-id' },
            update: {},
            create: { id: 'dev-org-id', name: 'Dev Organization' },
        }).catch((error) => {
            devOrgReady = null; // permite nova tentativa na próxima requisição
            throw error;
        });
    }
    return devOrgReady;
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        if (process.env.NODE_ENV !== 'production') {
            try {
                await ensureDevOrganization();
            } catch (error) {
                return next(error);
            }
            (req as AuthRequest).user = {
                id: 'dev-user-id',
                email: 'dev@example.com',
                role: 'ADMIN',
                organizationId: 'dev-org-id',
            };
            return next();
        }
        return res.status(401).json({ success: false, error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET!) as AuthUser;
        (req as AuthRequest).user = decoded;
        next();
    } catch {
        return res.status(403).json({ success: false, error: 'Invalid or expired token.' });
    }
};
