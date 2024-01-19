import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { IRolePermission } from 'interface-models/iam/role-permission.interface';
import { RolePermissionCreateRequest } from '../requests/role-permission-create.request';
import { RolePermissionService } from '../services/role-permission.service';
import { RolePermissionEditRequest } from '../requests/role-permission-edit.request';
import { RoleService } from '../services/role.service';
import { PermissionService } from '../services/permission.service';
import { CacheService } from 'apps/backoffice/src/infrastructure/cache/services/cache.service';
import { config } from 'apps/backoffice/src/config';
import { CacheClear } from 'apps/backoffice/src/infrastructure/cache/decorators/cache-clear.decorator';

@Injectable()
export class RolePermissionCrudApplication {
    constructor(
        private readonly rolePermissionService: RolePermissionService,
        private readonly roleService: RoleService,
        private readonly permissionService: PermissionService,
        private readonly cacheService: CacheService,
    ) {}

    @CacheClear(config.cache.name.rolePermissions.detail)
    async create(
        rolePermissionRequest: RolePermissionCreateRequest,
    ): Promise<IRolePermission> {
        const rolePermissionExists =
            await this.rolePermissionService.findOneByRoleIdAndPermissionId(
                rolePermissionRequest.roleId,
                rolePermissionRequest.permissionId,
            );

        if (rolePermissionExists) {
            throw new UnprocessableEntityException(
                `Combination role and permission has already exists`,
            );
        }

        const newRolePermission = <IRolePermission>{};
        newRolePermission.role = await this.roleService.findOneById(
            rolePermissionRequest.roleId,
        );
        newRolePermission.permission = await this.permissionService.findOneById(
            rolePermissionRequest.permissionId,
        );

        return await this.rolePermissionService.create(newRolePermission);
    }

    @CacheClear(config.cache.name.rolePermissions.detail)
    async edit(
        id: number,
        rolePermissionRequest: RolePermissionEditRequest,
    ): Promise<IRolePermission> {
        await this.rolePermissionService.findOneById(id);
        return await this.rolePermissionService.update(id, {
            id: id,
            role: await this.roleService.findOneById(
                rolePermissionRequest.roleId,
            ),
            permission: await this.permissionService.findOneById(
                rolePermissionRequest.permissionId,
            ),
        });
    }

    @CacheClear(config.cache.name.rolePermissions.detail)
    async delete(id: number): Promise<void> {
        await this.rolePermissionService.findOneById(id);
        await this.rolePermissionService.delete(id);
    }

    async findById(id: number): Promise<IRolePermission> {
        const results = await this.rolePermissionService.findOneById(id);
        return results;
    }
}
