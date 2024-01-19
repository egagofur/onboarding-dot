import { IRolePermission } from 'interface-models/iam/role-permission.interface';
import { RolePermissionResponse } from '../responses/role-permission.response';

export class RolePermissionMapper {
    public static fromEntity = (
        rolePermission: IRolePermission,
    ): RolePermissionResponse => ({
        id: rolePermission.id,
        role: rolePermission.role,
        permission: rolePermission.permission,
    });
}
