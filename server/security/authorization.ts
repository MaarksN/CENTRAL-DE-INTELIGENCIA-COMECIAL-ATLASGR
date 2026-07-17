import { Request, Response, NextFunction } from 'express';
import { hasPermission, Role, Permission } from './PermissionMatrix.js';

export const requireRole = (allowedRoles: Role[]) => {
    return (req: any, res: Response, next: NextFunction) => {
        const user = req.user;
        if (!user || !user.role) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        if (!allowedRoles.includes(user.role as Role)) {
            res.status(403).json({ error: 'Insufficient role permissions' });
            return;
        }

        next();
    };
};

export const requirePermission = (permission: Permission) => {
    return (req: any, res: Response, next: NextFunction) => {
        const user = req.user;
        if (!user || !user.role) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        if (!hasPermission(user.role as Role, permission)) {
            res.status(403).json({ error: `Missing required permission: ${permission}` });
            return;
        }

        next();
    };
};

// Tenant Isolation Middleware
// Ensures that routes operating on tenant data only access data for the user's organization.
// It achieves this by attaching the user's organizationId to `req.tenantId` for downstream usage.
export const requireTenant = (req: any, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user || !user.organizationId) {
        res.status(403).json({ error: 'Tenant context missing' });
        return;
    }

    // Explicitly set the tenant ID on the request so controllers use it for scoping Prisma queries
    req.tenantId = user.organizationId;
    next();
};
