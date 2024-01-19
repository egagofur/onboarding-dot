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
    PERMISSION_BACKOFFICE_SHOW_CONFIG,
    PERMISSION_BACKOFFICE_DETAIL_CONFIG,
    PERMISSION_BACKOFFICE_UPDATE_CONFIG,
    PERMISSION_BACKOFFICE_CREATE_CONFIG,
    PERMISSION_BACKOFFICE_DELETE_CONFIG,
    PERMISSION_BACKOFFICE_SHOW_PERMISSION,
    PERMISSION_BACKOFFICE_DETAIL_PERMISSION,
    PERMISSION_BACKOFFICE_UPDATE_PERMISSION,
    PERMISSION_BACKOFFICE_SHOW_ROLE_PERMISSION,
    PERMISSION_BACKOFFICE_DETAIL_ROLE_PERMISSION,
    PERMISSION_BACKOFFICE_UPDATE_ROLE_PERMISSION,
    PERMISSION_BACKOFFICE_CREATE_ROLE_PERMISSION,
    PERMISSION_BACKOFFICE_DELETE_ROLE_PERMISSION,
    PERMISSION_BACKOFFICE_SHOW_LOG_ACTIVITY,
    PERMISSION_BACKOFFICE_DETAIL_LOG_ACTIVITY,
} from 'constants/permission.constant';
import { Permission } from '../../entities/iam/permission.entity';
import { Exception } from 'handlebars';

export class CreatePermissionSeeder implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<void> {
        const datax = await connection.getRepository(Permission).find();
        if (datax.length <= 0) {
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

            const deleteAll = await connection
                .getRepository(Permission)
                .delete({});

            if (!deleteAll) {
                throw new Exception('Error not deleted');
            }

            for (let i = 0; i < permissionConstant.length; i++) {
                const newPermission = connection
                    .getRepository(Permission)
                    .create();
                newPermission.name = permissionConstant[i]
                    .split('-')
                    .join(' ')
                    .toUpperCase();
                newPermission.key = permissionConstant[i];

                try {
                    await connection
                        .getRepository(Permission)
                        .save(newPermission);
                } catch (_) {
                    console.log('pass...');
                }
            }
        }
    }
}
