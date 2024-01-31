import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { InertiaAdapter } from 'apps/backoffice/src/infrastructure/inertia/adapter/inertia.adapter';
import { StudioIndexRequest } from '../request/studio-index.request';
import { StudioMapper } from '../mappers/studio.mapper';
import { StudioIndexApplication } from '../applications/studio-index.application';
import { StudioCrudApplication } from '../applications/studio-crud.application';
import { IStudio } from 'interface-models/movie/studio.interface';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import {
    PERMISSION_BACKOFFICE_CREATE_STUDIO,
    PERMISSION_BACKOFFICE_DELETE_STUDIO,
    PERMISSION_BACKOFFICE_SHOW_STUDIO,
    PERMISSION_BACKOFFICE_UPDATE_STUDIO,
} from 'constants/permission.constant';

@Controller('studios')
export class StudioController {
    constructor(
        private readonly inertiaAdapter: InertiaAdapter,
        private readonly studioIndexApplication: StudioIndexApplication,
        private readonly studioCrudApplication: StudioCrudApplication,
    ) {}

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_SHOW_STUDIO))
    @Get()
    async indexPage(@Query() request: StudioIndexRequest): Promise<void> {
        const props = await this.studioIndexApplication.fetch(request);

        return this.inertiaAdapter.render({
            component: 'Studio',
            props: {
                ...props,
                data: props.data.map((studio) =>
                    StudioMapper.fromEntity(studio),
                ),
            },
        });
    }

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_CREATE_STUDIO))
    @Get('create')
    async createPage(): Promise<void> {
        return this.inertiaAdapter.render({
            component: 'Studio/FormStudio',
        });
    }

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_UPDATE_STUDIO))
    @Get('edit/:id')
    async editPage(@Param('id') id: number): Promise<void> {
        const data = await this.studioCrudApplication.findOneById(id);

        return this.inertiaAdapter.render({
            component: 'Studio/FormStudio',
            props: {
                id: data.id,
                data: StudioMapper.fromEntity(data),
                isEdit: true,
            },
        });
    }

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_CREATE_STUDIO))
    @Post('create')
    async store(@Body() data: IStudio): Promise<void> {
        await this.studioCrudApplication.create(data);

        return this.inertiaAdapter.successResponse(
            'studios',
            'Success create studio',
        );
    }

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_UPDATE_STUDIO))
    @Put('edit/:id')
    async update(
        @Param('id') id: number,
        @Body() data: IStudio,
    ): Promise<void> {
        await this.studioCrudApplication.update(id, data);

        return this.inertiaAdapter.successResponse(
            'studios',
            'Success update studio',
        );
    }

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_DELETE_STUDIO))
    @Delete('delete/:id')
    async delete(@Param('id') id: number): Promise<void> {
        await this.studioCrudApplication.delete(id);

        return this.inertiaAdapter.successResponse(
            'studios',
            'Success delete studio',
        );
    }
}
