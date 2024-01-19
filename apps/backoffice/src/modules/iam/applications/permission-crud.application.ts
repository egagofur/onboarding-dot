import { Injectable } from '@nestjs/common';
import { IPermission } from 'interface-models/iam/permission.interface';
import { PermissionService } from '../services/permission.service';
import { PermissionEditRequest } from '../requests/permission-edit.request';
import { config } from 'apps/backoffice/src/config';
import { CacheClear } from 'apps/backoffice/src/infrastructure/cache/decorators/cache-clear.decorator';

@Injectable()
export class PermissionCrudApplication {
    constructor(private readonly permissionService: PermissionService) {}

    @CacheClear(config.cache.name.permissions.detail)
    async edit(
        id: number,
        permissionRequest: PermissionEditRequest,
    ): Promise<IPermission> {
        await this.permissionService.findOneById(id);
        const updatePermission = await this.permissionService.update(id, {
            id: id,
            name: permissionRequest.name,
            key: permissionRequest.key,
        });

        return {
            id: updatePermission.id,
            name: updatePermission.name,
            key: updatePermission.key,
        };
    }

    async findById(id: number): Promise<IPermission> {
        const results = await this.permissionService.findOneById(id);
        return results;
    }

    async findAll(): Promise<IPermission[]> {
        const results = await this.permissionService.findAll();
        return results;
    }
}
