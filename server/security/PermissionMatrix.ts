export const ROLE_PERMISSIONS = {
    ADMINISTRADOR: ['create:users', 'read:all_leads', 'manage:billing', 'use:intelligence'],
    GESTOR_COMERCIAL: ['read:all_leads', 'manage:team', 'use:intelligence'],
    CLOSER: ['read:assigned_leads', 'update:deals', 'use:intelligence'],
    SDR: ['create:leads', 'read:assigned_leads', 'use:intelligence'],
    VISUALIZADOR: ['read:assigned_leads']
};

export type Role = keyof typeof ROLE_PERMISSIONS;
export type Permission = string;

export const hasPermission = (role: Role, permission: Permission): boolean => {
    const permissions = ROLE_PERMISSIONS[role];
    if (!permissions) return false;
    return permissions.includes(permission);
};
