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
import { TagCrudApplication } from '../applications/tag-crud.application';
import { TagIndexApplication } from '../applications/tag-index.application';
import { TagIndexRequest } from '../requests/tag-index.request';
import { TagMapper } from '../mappers/tag.mapper';
import { ITags } from 'apps/backoffice/app/Modules/Tags/Entities';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import {
    PERMISSION_BACKOFFICE_CREATE_TAGS,
    PERMISSION_BACKOFFICE_DELETE_TAGS,
    PERMISSION_BACKOFFICE_SHOW_TAGS,
    PERMISSION_BACKOFFICE_UPDATE_TAGS,
} from 'constants/permission.constant';

@Controller('tags')
export class TagController {
    constructor(
        private readonly inertiaAdapter: InertiaAdapter,
        private readonly tagCrudApplication: TagCrudApplication,
        private readonly tagIndexApplication: TagIndexApplication,
    ) {}

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_SHOW_TAGS))
    @Get()
    async indexPage(@Query() indexRequest: TagIndexRequest): Promise<void> {
        const props = await this.tagIndexApplication.fetch(indexRequest);

        return this.inertiaAdapter.render({
            component: 'Tags',
            props: {
                ...props,
                data: props.data.map((tag) => TagMapper.fromEntity(tag)),
            },
        });
    }

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_CREATE_TAGS))
    @Get('create')
    async create(): Promise<void> {
        return this.inertiaAdapter.render({
            component: 'Tags/FormTags',
        });
    }

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_UPDATE_TAGS))
    @Get('edit/:id')
    async edit(@Param('id') id: number): Promise<void> {
        const data = await this.tagCrudApplication.findOneById(id);
        return this.inertiaAdapter.render({
            component: 'Tags/FormTags',
            props: {
                id,
                data,
                isEdit: true,
            },
        });
    }

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_CREATE_TAGS))
    @Post('create')
    async store(@Body() data: ITags): Promise<void> {
        await this.tagCrudApplication.create(data);
        return this.inertiaAdapter.successResponse(
            'tags',
            'Success create tags',
        );
    }

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_UPDATE_TAGS))
    @Put('edit/:id')
    async update(@Param('id') id: number, @Body() data: ITags): Promise<void> {
        await this.tagCrudApplication.update(id, data);
        return this.inertiaAdapter.successResponse(
            'tags',
            `Success update tags with id ${id}`,
        );
    }

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_DELETE_TAGS))
    @Delete('delete/:id')
    async delete(@Param('id') id: number): Promise<void> {
        await this.tagCrudApplication.delete(id);
        return this.inertiaAdapter.successResponse(
            'tags',
            `Success delete tags with id ${id}`,
        );
    }
}
