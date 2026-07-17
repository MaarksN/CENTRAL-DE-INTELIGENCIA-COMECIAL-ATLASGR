import { describe, it, expect } from 'vitest';
import { PermissionManager, Roles } from '../../../../server/platform/security/PermissionManager.js';

describe('PermissionManager', () => {
  it('grants super admin wildcard access to any permission', () => {
    expect(PermissionManager.hasPermission(Roles.SUPER_ADMIN, 'anything:at_all')).toBe(true);
  });

  it('grants a role only the permissions explicitly assigned to it', () => {
    expect(PermissionManager.hasPermission(Roles.SDR, 'write:activities')).toBe(true);
    expect(PermissionManager.hasPermission(Roles.SDR, 'manage:users')).toBe(false);
  });

  it('denies permissions for unknown roles', () => {
    expect(PermissionManager.hasPermission('NOT_A_ROLE', 'read:public')).toBe(false);
  });

  it('checkOrThrow does not throw when permission is granted', () => {
    expect(() => PermissionManager.checkOrThrow(Roles.READ_ONLY, 'read:public')).not.toThrow();
  });

  it('checkOrThrow throws a descriptive error when permission is missing', () => {
    expect(() => PermissionManager.checkOrThrow(Roles.READ_ONLY, 'write:activities')).toThrow(
      /Access Denied: Requires permission write:activities/,
    );
  });
});
