export type Role =
    | 'SUPER_ADMIN'
    | 'TENANT_OWNER'
    | 'ADMIN'
    | 'MANAGER'
    | 'COORDINATOR'
    | 'SALES_MANAGER'
    | 'SDR'
    | 'BDR'
    | 'CLOSER'
    | 'CSM'
    | 'FINANCE'
    | 'HR'
    | 'LEGAL'
    | 'MARKETING'
    | 'OPERATIONS'
    | 'SUPPORT'
    | 'AI_AGENT'
    | 'API'
    | 'READ_ONLY'
    | 'GUEST';

export type Permission =
    | 'crm.read'
    | 'crm.write'
    | 'crm.delete'
    | 'lead.create'
    | 'lead.update'
    | 'lead.delete'
    | 'workflow.execute'
    | 'tenant.manage'
    | 'audit.read'
    | 'ai.execute'
    | 'settings.manage'
    | 'billing.read'
    | 'billing.manage'
    | 'users.manage';

const rolePermissions: Record<Role, Permission[]> = {
    SUPER_ADMIN: [
        'crm.read', 'crm.write', 'crm.delete', 'lead.create', 'lead.update', 'lead.delete',
        'workflow.execute', 'tenant.manage', 'audit.read', 'ai.execute', 'settings.manage',
        'billing.read', 'billing.manage', 'users.manage'
    ],
    TENANT_OWNER: [
        'crm.read', 'crm.write', 'crm.delete', 'lead.create', 'lead.update', 'lead.delete',
        'workflow.execute', 'tenant.manage', 'audit.read', 'ai.execute', 'settings.manage',
        'billing.read', 'billing.manage', 'users.manage'
    ],
    ADMIN: [
        'crm.read', 'crm.write', 'crm.delete', 'lead.create', 'lead.update', 'lead.delete',
        'workflow.execute', 'audit.read', 'ai.execute', 'settings.manage', 'billing.read', 'users.manage'
    ],
    MANAGER: [
        'crm.read', 'crm.write', 'lead.create', 'lead.update', 'lead.delete',
        'workflow.execute', 'ai.execute', 'users.manage'
    ],
    COORDINATOR: [
        'crm.read', 'crm.write', 'lead.create', 'lead.update', 'workflow.execute'
    ],
    SALES_MANAGER: [
        'crm.read', 'crm.write', 'lead.create', 'lead.update', 'lead.delete', 'workflow.execute', 'ai.execute'
    ],
    SDR: [
        'crm.read', 'crm.write', 'lead.create', 'lead.update', 'ai.execute'
    ],
    BDR: [
        'crm.read', 'crm.write', 'lead.create', 'lead.update', 'ai.execute'
    ],
    CLOSER: [
        'crm.read', 'crm.write', 'lead.update', 'workflow.execute'
    ],
    CSM: [
        'crm.read', 'crm.write', 'workflow.execute'
    ],
    FINANCE: [
        'billing.read', 'billing.manage'
    ],
    HR: [
        'users.manage'
    ],
    LEGAL: [
        'audit.read'
    ],
    MARKETING: [
        'crm.read', 'lead.create'
    ],
    OPERATIONS: [
        'crm.read', 'settings.manage', 'workflow.execute'
    ],
    SUPPORT: [
        'crm.read'
    ],
    AI_AGENT: [
        'crm.read', 'crm.write', 'lead.create', 'lead.update', 'ai.execute'
    ],
    API: [
        'crm.read', 'crm.write', 'lead.create', 'lead.update', 'workflow.execute'
    ],
    READ_ONLY: [
        'crm.read'
    ],
    GUEST: [
        'crm.read'
    ]
};

export class AuthorizationService {
    static getPermissions(role: Role): Permission[] {
        return rolePermissions[role] || [];
    }

    static hasPermission(role: Role, permission: Permission): boolean {
        const permissions = this.getPermissions(role);
        return permissions.includes(permission);
    }

    static hasAnyPermission(role: Role, permissions: Permission[]): boolean {
        const rolePerms = this.getPermissions(role);
        return permissions.some(perm => rolePerms.includes(perm));
    }
}
