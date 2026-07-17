export enum Roles {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ORG_ADMIN = 'ORG_ADMIN',
  REVENUE_DIRECTOR = 'REVENUE_DIRECTOR',
  SALES_MANAGER = 'SALES_MANAGER',
  SDR = 'SDR',
  BDR = 'BDR',
  CLOSER = 'CLOSER',
  READ_ONLY = 'READ_ONLY'
}

export class PermissionManager {
  private static rolePermissions: Record<string, string[]> = {
    [Roles.SUPER_ADMIN]: ['*'],
    [Roles.ORG_ADMIN]: ['manage:org', 'manage:users', 'manage:settings', 'read:all', 'write:all'],
    [Roles.REVENUE_DIRECTOR]: ['read:all', 'write:reports', 'write:strategy'],
    [Roles.SALES_MANAGER]: ['read:team', 'write:leads', 'write:activities'],
    [Roles.SDR]: ['read:assigned_leads', 'write:activities', 'write:qualifications'],
    [Roles.BDR]: ['read:assigned_leads', 'write:activities', 'write:opportunities'],
    [Roles.READ_ONLY]: ['read:public']
  };

  static hasPermission(role: string, requiredPermission: string): boolean {
    const permissions = this.rolePermissions[role] || [];
    if (permissions.includes('*')) return true;
    return permissions.includes(requiredPermission);
  }

  static checkOrThrow(role: string, requiredPermission: string): void {
    if (!this.hasPermission(role, requiredPermission)) {
      throw new Error(`Access Denied: Requires permission ${requiredPermission}`);
    }
  }
}
