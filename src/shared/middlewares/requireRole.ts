import { Request, Response, NextFunction } from 'express';
import type { AuthRequest } from './authenticateToken.js';

/**
 * RBAC middleware — garante que o usuário autenticado possui pelo menos um dos
 * papéis (roles) especificados. Deve ser usado APÓS `authenticateToken`.
 *
 * Hierarquia de papéis:
 *   ADMIN > GESTOR > VENDEDOR > VISUALIZADOR
 *
 * Exemplo de uso:
 *   router.delete('/:id', authenticateToken, requireRole(['ADMIN', 'GESTOR']), handler)
 */

const ROLE_HIERARCHY: Record<string, number> = {
    ADMIN: 100,
    GESTOR: 75,
    VENDEDOR: 50,
    VISUALIZADOR: 10,
};

/**
 * Retorna true se `userRole` tem nível igual ou superior ao papel de menor nível em `allowedRoles`.
 */
function hasPermission(userRole: string, allowedRoles: string[]): boolean {
    const userLevel = ROLE_HIERARCHY[userRole] ?? 0;
    const requiredLevel = Math.min(...allowedRoles.map((r) => ROLE_HIERARCHY[r] ?? 999));
    return userLevel >= requiredLevel;
}

export function requireRole(allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const authReq = req as AuthRequest;

        // authenticateToken deve ter sido chamado antes deste middleware
        if (!authReq.user) {
            res.status(401).json({
                success: false,
                error: 'Authentication required.',
            });
            return;
        }

        if (!hasPermission(authReq.user.role, allowedRoles)) {
            res.status(403).json({
                success: false,
                error: `Insufficient permissions. Required: ${allowedRoles.join(' or ')}. Your role: ${authReq.user.role}.`,
            });
            return;
        }

        next();
    };
}
