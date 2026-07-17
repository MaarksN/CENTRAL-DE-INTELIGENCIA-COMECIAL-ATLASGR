import { describe, it, expect } from 'vitest';
import { UnifiedIdentityManager } from '../../../../server/atlas-os/identity/UnifiedIdentityManager.js';
import { Roles } from '../../../../server/platform/security/PermissionManager.js';

describe('UnifiedIdentityManager', () => {
  it('resolves a platform identity from user, tenant and role', () => {
    const identity = UnifiedIdentityManager.resolveContext('user-1', 'tenant-1', Roles.SALES_MANAGER);
    expect(identity).toEqual({ userId: 'user-1', tenantId: 'tenant-1', role: Roles.SALES_MANAGER });
  });
});
