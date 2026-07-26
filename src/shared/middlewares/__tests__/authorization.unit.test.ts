import { describe, it, expect, vi } from 'vitest';
import { requireTenant, requirePermission } from '../authorization';
import { Request, Response } from 'express';

describe('Authorization Middlewares', () => {
    describe('requireTenant', () => {
        it('should call next if organizationId is present', () => {
            const req = { user: { organizationId: 'org-1' } } as unknown as Request;
            const res = {} as Response;
            const next = vi.fn();

            requireTenant(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        it('should return 403 if organizationId is missing', () => {
            const req = { user: { id: 'user-1' } } as unknown as Request;
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn()
            } as unknown as Response;
            const next = vi.fn();

            requireTenant(req, res, next);
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ success: false, error: 'User is not associated with any tenant/organization.' });
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe('requirePermission', () => {
        it('should call next if user has permission', () => {
            const req = { user: { role: 'ADMIN' } } as unknown as Request;
            const res = {} as Response;
            const next = vi.fn();

            const middleware = requirePermission('crm.read');
            middleware(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        it('should return 403 if user lacks permission', () => {
            const req = { user: { role: 'GUEST' } } as unknown as Request;
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn()
            } as unknown as Response;
            const next = vi.fn();

            const middleware = requirePermission('settings.manage');
            middleware(req, res, next);
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ success: false, error: 'Forbidden: Insufficient permissions.' });
            expect(next).not.toHaveBeenCalled();
        });
    });
});
