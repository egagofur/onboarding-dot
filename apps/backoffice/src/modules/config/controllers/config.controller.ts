import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ConfigCrudApplication } from '../applications/config-crud.application';
import { ConfigCreateRequest } from '../requests/config-create.request';
import { InertiaAdapter } from 'apps/backoffice/src/infrastructure/inertia/adapter/inertia.adapter';
import { ConfigIndexApplication } from '../applications/config-index.application';
import { ConfigIndexRequest } from '../requests/config-index.request';
import { ConfigEditRequest } from '../requests/config-edit.request';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import {
    PERMISSION_BACKOFFICE_CREATE_CONFIG,
    PERMISSION_BACKOFFICE_DELETE_CONFIG,
    PERMISSION_BACKOFFICE_SHOW_CONFIG,
    PERMISSION_BACKOFFICE_UPDATE_CONFIG,
} from 'constants/permission.constant';
import { ConfigMapper } from '../mappers/config.mapper';

@Controller('configs')
export class ConfigController {
    constructor(
        private readonly inertiaAdapter: InertiaAdapter,
        private readonly configCrudApplication: ConfigCrudApplication,
        private readonly configIndexApplication: ConfigIndexApplication,
    ) {}

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_SHOW_CONFIG))
    @Get()
    async indexPage(@Query() indexRequest: ConfigIndexRequest): Promise<void> {
        const props = await this.configIndexApplication.fetch(indexRequest);
        return this.inertiaAdapter.render({
            component: 'Configs',
            props: {
                ...props,
                data: props.data.map((role) => ConfigMapper.fromEntity(role)),
            },
        });
    }

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_CREATE_CONFIG))
    @Get('create')
    async createPage(): Promise<void> {
        return this.inertiaAdapter.render({
            component: 'Configs/FormConfig',
        });
    }

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_SHOW_CONFIG))
    @Get(':id')
    async detailPage(@Param('id') id: number): Promise<void> {
        const data = await this.configCrudApplication.findById(id);
        return this.inertiaAdapter.render({
            component: 'Configs/DetailConfig',
            props: {
                data,
            },
        });
    }

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_UPDATE_CONFIG))
    @Get('edit/:id')
    async editPage(@Param('id') id: number): Promise<void> {
        const data = await this.configCrudApplication.findById(id);
        return this.inertiaAdapter.render({
            component: 'Configs/FormConfig',
            props: {
                id,
                data,
                isUpdate: true,
            },
        });
    }

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_CREATE_CONFIG))
    @Post('create')
    async store(
        @Body() configCreateRequest: ConfigCreateRequest,
    ): Promise<void> {
        await this.configCrudApplication.create(configCreateRequest);
        return this.inertiaAdapter.successResponse('configs', 'Success create');
    }

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_UPDATE_CONFIG))
    @Post('edit/:id')
    async update(
        @Param('id') id: number,
        @Body() configEditRequest: ConfigEditRequest,
    ): Promise<void> {
        await this.configCrudApplication.edit(id, configEditRequest);
        return this.inertiaAdapter.successResponse('configs', 'Success edit');
    }

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_DELETE_CONFIG))
    @Get('delete/:id')
    async delete(@Param('id') id: number): Promise<void> {
        await this.configCrudApplication.delete(id);
        return this.inertiaAdapter.successResponse('configs', 'Success delete');
    }
}
