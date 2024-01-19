import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { InertiaAdapter } from 'apps/backoffice/src/infrastructure/inertia/adapter/inertia.adapter';
import { RolePermissionIndexApplication } from '../applications/role-permission-index.application';
import { RolePermissionIndexRequest } from '../requests/role-permission-index.request';
import { RolePermissionCrudApplication } from '../applications/role-permission-crud.application';
import { RoleCrudApplication } from '../applications/role-crud.application';
import { PermissionCrudApplication } from '../applications/permission-crud.application';
import {
    PERMISSION_BACKOFFICE_CREATE_ROLE_PERMISSION,
    PERMISSION_BACKOFFICE_DELETE_ROLE_PERMISSION,
    PERMISSION_BACKOFFICE_SHOW_ROLE_PERMISSION,
    PERMISSION_BACKOFFICE_UPDATE_ROLE_PERMISSION,
} from 'constants/permission.constant';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { RolePermissionCreateRequest } from '../requests/role-permission-create.request';
import { RolePermissionEditRequest } from '../requests/role-permission-edit.request';
import { RolePermissionMapper } from '../mappers/role-permission.mapper';

@Controller('role-permissions')
export class RolePermissionController {
    constructor(
        private readonly inertiaAdapter: InertiaAdapter,
        private readonly rolePermissionCrudApplication: RolePermissionCrudApplication,
        private readonly roleCrudApplication: RoleCrudApplication,
        private readonly permissionCrudApplication: PermissionCrudApplication,
        private readonly rolePermissionIndexApplication: RolePermissionIndexApplication,
    ) {}

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_SHOW_ROLE_PERMISSION))
    @Get()
    async indexPage(
        @Query() indexRequest: RolePermissionIndexRequest,
    ): Promise<void> {
        const props = await this.rolePermissionIndexApplication.fetch(
            indexRequest,
        );
        return this.inertiaAdapter.render({
            component: 'Iam/RolePermissions',
            props: {
                ...props,
                data: props.data.map((rolePermission) =>
                    RolePermissionMapper.fromEntity(rolePermission),
                ),
            },
        });
    }

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_CREATE_ROLE_PERMISSION))
    @Get('create')
    async creaatePage(): Promise<void> {
        const roles = await this.roleCrudApplication.findAll();
        const permissions = await this.permissionCrudApplication.findAll();
        return this.inertiaAdapter.render({
            component: 'Iam/RolePermissions/FormRolePermission',
            props: {
                roles,
                permissions,
            },
        });
    }

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_SHOW_ROLE_PERMISSION))
    @Get(':id')
    async detailPage(@Param('id') id: number): Promise<void> {
        const data = await this.rolePermissionCrudApplication.findById(id);
        return this.inertiaAdapter.render({
            component: 'Iam/RolePermissions/DetailRolePermission',
            props: { data, meta: null },
        });
    }

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_UPDATE_ROLE_PERMISSION))
    @Get('edit/:id')
    async editPage(@Param('id') id: number): Promise<void> {
        const data = await this.rolePermissionCrudApplication.findById(id);
        const roles = await this.roleCrudApplication.findAll();
        const permissions = await this.permissionCrudApplication.findAll();
        return this.inertiaAdapter.render({
            component: 'Iam/RolePermissions/FormRolePermission',
            props: {
                id,
                roles,
                permissions,
                data,
                isUpdate: true,
            },
        });
    }

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_CREATE_ROLE_PERMISSION))
    @Post('create')
    async create(
        @Body() rolePermissionCreateRequest: RolePermissionCreateRequest,
    ): Promise<void> {
        await this.rolePermissionCrudApplication.create(
            rolePermissionCreateRequest,
        );
        return this.inertiaAdapter.successResponse(
            'role-permissions',
            'Success create',
        );
    }

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_UPDATE_ROLE_PERMISSION))
    @Post('edit/:id')
    async update(
        @Param('id') id: number,
        @Body() rolePermissionEditRequest: RolePermissionEditRequest,
    ): Promise<void> {
        await this.rolePermissionCrudApplication.edit(
            id,
            rolePermissionEditRequest,
        );
        return this.inertiaAdapter.successResponse(
            'role-permissions',
            'Success edit',
        );
    }

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_DELETE_ROLE_PERMISSION))
    @Get('delete/:id')
    async delete(@Param('id') id: number): Promise<void> {
        await this.rolePermissionCrudApplication.delete(id);
        return this.inertiaAdapter.successResponse(
            'role-permissions',
            'Success delete',
        );
    }
}
