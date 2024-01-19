import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { UserCrudApplication } from '../applications/user-crud.application';
import { RoleCrudApplication } from '../applications/role-crud.application';
import { UserCreateRequest } from '../requests/user-create.request';
import { InertiaAdapter } from 'apps/backoffice/src/infrastructure/inertia/adapter/inertia.adapter';
import { UserIndexApplication } from '../applications/user-index.application';
import { UserIndexRequest } from '../requests/user-index.request';
import {
    PERMISSION_BACKOFFICE_CREATE_USER,
    PERMISSION_BACKOFFICE_DELETE_USER,
    PERMISSION_BACKOFFICE_SHOW_USER,
    PERMISSION_BACKOFFICE_UPDATE_USER,
} from 'constants/permission.constant';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { UserUpdateRequest } from '../requests/user-update.request';
import { UserMapper } from '../mappers/user.mapper';
import { UserBulkDeleteRequest } from '../requests/user-bulk-delete.request';

@Controller('users')
export class UserController {
    constructor(
        private readonly inertiaAdapter: InertiaAdapter,
        private readonly userCrudApplication: UserCrudApplication,
        private readonly roleCrudApplication: RoleCrudApplication,
        private readonly userIndexApplication: UserIndexApplication,
    ) {}

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_SHOW_USER))
    @Get()
    async indexPage(@Query() indexRequest: UserIndexRequest): Promise<void> {
        const props = await this.userIndexApplication.fetch(indexRequest);
        return this.inertiaAdapter.render({
            component: 'Iam/Users',
            props: {
                ...props,
                data: props.data.map((user) => UserMapper.fromEntity(user)),
            },
        });
    }

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_SHOW_USER))
    @Get('create')
    async createPage(): Promise<void> {
        const roles = await this.roleCrudApplication.findAll();
        return this.inertiaAdapter.render({
            component: 'Iam/Users/FormUser',
            props: {
                roles,
            },
        });
    }

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_SHOW_USER))
    @Get(':id')
    async detailPage(@Param('id') id: number): Promise<void> {
        const data = await this.userCrudApplication.findById(id);
        return this.inertiaAdapter.render({
            component: 'Iam/Users/DetailUser',
            props: { data },
        });
    }

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_UPDATE_USER))
    @Get('edit/:id')
    async editPage(@Param('id') id: number): Promise<void> {
        const data = await this.userCrudApplication.findById(id);
        const roles = await this.roleCrudApplication.findAll();
        return this.inertiaAdapter.render({
            component: 'Iam/Users/FormUser',
            props: {
                id,
                data,
                roles,
                isUpdate: true,
            },
        });
    }

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_CREATE_USER))
    @Post('create')
    async store(@Body() userCreateRequest: UserCreateRequest): Promise<void> {
        await this.userCrudApplication.create(userCreateRequest);
        this.inertiaAdapter.successResponse('users', 'Success create');
    }

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_UPDATE_USER))
    @Put('edit/:id')
    async update(
        @Param('id') id: number,
        @Body() userUpdateRequest: UserUpdateRequest,
    ): Promise<void> {
        await this.userCrudApplication.update(id, userUpdateRequest);
        this.inertiaAdapter.successResponse('users', 'Success update');
    }

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_DELETE_USER))
    @Post('delete/:id')
    async delete(@Param('id') id: number): Promise<void> {
        await this.userCrudApplication.delete(id);
        this.inertiaAdapter.successResponse('users', 'Success delete');
    }

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_DELETE_USER))
    @Post('deletes')
    async batchDelete(@Body() request: UserBulkDeleteRequest): Promise<void> {
        await this.userCrudApplication.bulkDelete(request.ids);
        this.inertiaAdapter.successResponse('users', 'Success delete');
    }
}
