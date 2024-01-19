import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { InertiaAdapter } from 'apps/backoffice/src/infrastructure/inertia/adapter/inertia.adapter';
import { PERMISSION_BACKOFFICE_SHOW_PERMISSION } from 'constants/permission.constant';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { PermissionCrudApplication } from '../applications/permission-crud.application';
import { PermissionIndexApplication } from '../applications/permission-index.application';
import { PermissionMapper } from '../mappers/permission.mapper';
import { PermissionIndexRequest } from '../requests/permission-index.request';

@Controller('permissions')
export class PermissionController {
    constructor(
        private readonly inertiaAdapter: InertiaAdapter,
        private readonly permissionCrudApplication: PermissionCrudApplication,
        private readonly permissionIndexApplication: PermissionIndexApplication,
    ) {}

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_SHOW_PERMISSION))
    @Get()
    async indexPage(
        @Query() indexRequest: PermissionIndexRequest,
    ): Promise<void> {
        const props = await this.permissionIndexApplication.fetch(indexRequest);
        return this.inertiaAdapter.render({
            component: 'Iam/Permissions',
            props: {
                ...props,
                data: props.data.map((permission) =>
                    PermissionMapper.fromEntity(permission),
                ),
            },
        });
    }

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_SHOW_PERMISSION))
    @Get(':id')
    async detailPage(@Param('id') id: number): Promise<void> {
        const data = await this.permissionCrudApplication.findById(id);
        return this.inertiaAdapter.render({
            component: 'Iam/Permissions/DetailPermission',
            props: { data, meta: null },
        });
    }
}
