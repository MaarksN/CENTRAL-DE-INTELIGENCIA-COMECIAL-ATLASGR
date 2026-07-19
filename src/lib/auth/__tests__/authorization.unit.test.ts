import { describe, it, expect } from 'vitest';
import { AuthorizationService } from '../authorization';

describe('AuthorizationService', () => {
    it('should return correct permissions for SUPER_ADMIN', () => {
        const perms = AuthorizationService.getPermissions('SUPER_ADMIN');
        expect(perms).toContain('tenant.manage');
        expect(perms).toContain('users.manage');
    });

    it('should accurately check if a role has a specific permission', () => {
        expect(AuthorizationService.hasPermission('ADMIN', 'crm.read')).toBe(true);
        expect(AuthorizationService.hasPermission('GUEST', 'tenant.manage')).toBe(false);
    });

    it('should correctly evaluate hasAnyPermission', () => {
        expect(AuthorizationService.hasAnyPermission('READ_ONLY', ['crm.read', 'lead.create'])).toBe(true);
        expect(AuthorizationService.hasAnyPermission('READ_ONLY', ['lead.create', 'lead.delete'])).toBe(false);
    });
});
