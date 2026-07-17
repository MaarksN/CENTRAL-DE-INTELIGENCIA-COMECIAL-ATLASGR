import { Roles } from '../../platform/security/PermissionManager.js';

export interface PlatformIdentity {
  userId: string;
  tenantId: string;
  role: Roles;
}

export class UnifiedIdentityManager {
  static resolveContext(userId: string, tenantId: string, role: Roles): PlatformIdentity {
    return { userId, tenantId, role };
  }
}
