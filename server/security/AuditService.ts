import { prisma } from '../../src/lib/prisma.js';
import { Request } from 'express';
import crypto from 'crypto';

export class AuditService {
    /**
     * Immutable audit log. Writes directly to the AuditLog table.
     */
    static async logEvent(
        action: string,
        entity: string,
        req?: any,
        entityId?: string,
        details?: object
    ) {
        try {
            const actorId = req?.user?.id || null;
            const tenantId = req?.user?.organizationId || req?.tenantId || null;
            const ipAddress = req?.ip || req?.headers?.['x-forwarded-for'] || null;
            const traceId = req?.traceId || null;

            const logDetails = {
                ...details,
                traceId,
                userAgent: req?.headers?.['user-agent']
            };

            await prisma.auditLog.create({
                data: {
                    action,
                    entity,
                    entityId,
                    actorId,
                    tenantId,
                    ipAddress,
                    details: JSON.stringify(logDetails)
                }
            });
        } catch (error) {
            // In a real enterprise system, if the DB is down, write to a local immutable file or queue.
            console.error('[AuditService] Failed to write audit log:', error);
        }
    }
}

export const addTraceId = (req: any, res: any, next: any) => {
    req.traceId = req.headers['x-trace-id'] || crypto.randomUUID();
    res.setHeader('X-Trace-Id', req.traceId);
    next();
};
