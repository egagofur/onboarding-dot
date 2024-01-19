import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import {
    PERMISSION_BACKOFFICE_SHOW_USER,
    PERMISSION_BACKOFFICE_DETAIL_USER,
    PERMISSION_BACKOFFICE_UPDATE_USER,
    PERMISSION_BACKOFFICE_CREATE_USER,
    PERMISSION_BACKOFFICE_DELETE_USER,
    PERMISSION_BACKOFFICE_SHOW_ROLE,
    PERMISSION_BACKOFFICE_DETAIL_ROLE,
    PERMISSION_BACKOFFICE_UPDATE_ROLE,
    PERMISSION_BACKOFFICE_CREATE_ROLE,
    PERMISSION_BACKOFFICE_DELETE_ROLE,
    PERMISSION_BACKOFFICE_SHOW_PERMISSION,
    PERMISSION_BACKOFFICE_DETAIL_PERMISSION,
    PERMISSION_BACKOFFICE_UPDATE_PERMISSION,
    PERMISSION_BACKOFFICE_SHOW_ROLE_PERMISSION,
    PERMISSION_BACKOFFICE_DETAIL_ROLE_PERMISSION,
    PERMISSION_BACKOFFICE_UPDATE_ROLE_PERMISSION,
    PERMISSION_BACKOFFICE_CREATE_ROLE_PERMISSION,
    PERMISSION_BACKOFFICE_DELETE_ROLE_PERMISSION,
    PERMISSION_BACKOFFICE_SHOW_CONFIG,
    PERMISSION_BACKOFFICE_DETAIL_CONFIG,
    PERMISSION_BACKOFFICE_UPDATE_CONFIG,
    PERMISSION_BACKOFFICE_CREATE_CONFIG,
    PERMISSION_BACKOFFICE_DELETE_CONFIG,
    PERMISSION_BACKOFFICE_SHOW_LOG_ACTIVITY,
    PERMISSION_BACKOFFICE_DETAIL_LOG_ACTIVITY,
} from 'constants/permission.constant';
import { RolePermission } from '../../entities/iam/role-permission.entity';
import { Role } from 'entities/iam/role.entity';
import { Permission } from 'entities/iam/permission.entity';
import { Exception } from 'handlebars/runtime';

export class CreateRoleAdminPermissionSeeder implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<void> {
        const permissionConstant = [
            PERMISSION_BACKOFFICE_SHOW_CONFIG,
            PERMISSION_BACKOFFICE_DETAIL_CONFIG,
            PERMISSION_BACKOFFICE_UPDATE_CONFIG,
            PERMISSION_BACKOFFICE_CREATE_CONFIG,
            PERMISSION_BACKOFFICE_DELETE_CONFIG,

            PERMISSION_BACKOFFICE_SHOW_LOG_ACTIVITY,
            PERMISSION_BACKOFFICE_DETAIL_LOG_ACTIVITY,

            PERMISSION_BACKOFFICE_SHOW_USER,
            PERMISSION_BACKOFFICE_DETAIL_USER,
            PERMISSION_BACKOFFICE_UPDATE_USER,
            PERMISSION_BACKOFFICE_CREATE_USER,
            PERMISSION_BACKOFFICE_DELETE_USER,

            PERMISSION_BACKOFFICE_SHOW_ROLE,
            PERMISSION_BACKOFFICE_DETAIL_ROLE,
            PERMISSION_BACKOFFICE_UPDATE_ROLE,
            PERMISSION_BACKOFFICE_CREATE_ROLE,
            PERMISSION_BACKOFFICE_DELETE_ROLE,

            PERMISSION_BACKOFFICE_SHOW_ROLE_PERMISSION,
            PERMISSION_BACKOFFICE_DETAIL_ROLE_PERMISSION,
            PERMISSION_BACKOFFICE_UPDATE_ROLE_PERMISSION,
            PERMISSION_BACKOFFICE_CREATE_ROLE_PERMISSION,
            PERMISSION_BACKOFFICE_DELETE_ROLE_PERMISSION,

            PERMISSION_BACKOFFICE_SHOW_PERMISSION,
            PERMISSION_BACKOFFICE_DETAIL_PERMISSION,
            PERMISSION_BACKOFFICE_UPDATE_PERMISSION,
        ];

        const role = await connection
            .createQueryBuilder(Role, 'roles')
            .where({
                key: 'admin',
            })
            .getOne();

        if (!role) {
            return;
        }

        const deleteAll = await connection
            .getRepository(RolePermission)
            .delete({
                role: {
                    id: role.id,
                },
            });

        if (!deleteAll) {
            throw new Exception('Error not deleted');
        }

        const permissions = await connection
            .createQueryBuilder(Permission, 'permissions')
            .where('permissions.key IN (:...keys)', {
                keys: permissionConstant,
            })
            .getMany();

        for (let i = 0; i < permissions.length; i++) {
            const newRolePermission = connection
                .getRepository(RolePermission)
                .create();
            newRolePermission.role = role;
            newRolePermission.permission = permissions[i];

            try {
                await connection
                    .getRepository(RolePermission)
                    .save(newRolePermission);
            } catch (_) {
                console.log('pass...');
            }
        }
    }
}
