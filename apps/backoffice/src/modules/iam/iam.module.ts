import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'entities/iam/user.entity';
import { InertiaAdapter } from '../../infrastructure/inertia/adapter/inertia.adapter';
import { UserCrudApplication } from './applications/user-crud.application';
import { UserIndexApplication } from './applications/user-index.application';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { RoleCrudApplication } from './applications/role-crud.application';
import { RoleIndexApplication } from './applications/role-index.application';
import { RoleController } from './controllers/role.controller';
import { RoleService } from './services/role.service';
import { Role } from 'entities/iam/role.entity';
import { PermissionCrudApplication } from './applications/permission-crud.application';
import { PermissionService } from './services/permission.service';
import { PermissionIndexApplication } from './applications/permission-index.application';
import { Permission } from 'entities/iam/permission.entity';
import { PermissionController } from './controllers/permission.controller';
import { RolePermissionController } from './controllers/role-permission.controller';
import { RolePermission } from 'entities/iam/role-permission.entity';
import { RolePermissionCrudApplication } from './applications/role-permission-crud.application';
import { RolePermissionService } from './services/role-permission.service';
import { RolePermissionIndexApplication } from './applications/role-permission-index.application';
import { CacheModule } from '../../infrastructure/cache/cache.module';
import { LogActivity } from 'entities/log-activity/log-activity.entity';
import { LogActivityService } from '../log-activity/services/log-activity.service';
import { LdapService } from '../auth/services/ldap.service';
import { AbilityModule } from '../../infrastructure/ability/ability.module';
import { UserRole } from 'entities/iam/user-role.entity';
import { UserRoleService } from './services/user-role.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            Role,
            Permission,
            RolePermission,
            LogActivity,
            UserRole,
        ]),
        CacheModule,
        AbilityModule,
    ],
    controllers: [
        UserController,
        RoleController,
        PermissionController,
        RolePermissionController,
    ],
    providers: [
        LdapService,
        InertiaAdapter,
        UserCrudApplication,
        UserService,
        UserIndexApplication,
        RoleCrudApplication,
        RoleService,
        RoleIndexApplication,
        RolePermissionCrudApplication,
        RolePermissionService,
        RolePermissionIndexApplication,
        PermissionCrudApplication,
        PermissionService,
        PermissionIndexApplication,
        LogActivityService,
        UserRoleService,
    ],
    exports: [UserCrudApplication],
})
export class IamModule {}
