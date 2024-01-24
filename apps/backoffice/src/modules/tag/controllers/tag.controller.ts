import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { InertiaAdapter } from 'apps/backoffice/src/infrastructure/inertia/adapter/inertia.adapter';
import { TagCrudApplication } from '../applications/tag-crud.application';
import { TagIndexApplication } from '../applications/tag-index.application';
import { TagIndexRequest } from '../requests/tag-index.request';
import { TagMapper } from '../mappers/tag.mapper';
import { ITags } from 'apps/backoffice/app/Modules/Tags/Entities';

@Controller('tags')
export class TagController {
    constructor(
        private readonly inertiaAdapter: InertiaAdapter,
        private readonly tagCrudApplication: TagCrudApplication,
        private readonly tagIndexApplication: TagIndexApplication,
    ) {}

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

    @Get('create')
    async create(): Promise<void> {
        return this.inertiaAdapter.render({
            component: 'Tags/formTags',
        });
    }

    @Get('edit/:id')
    async edit(@Param('id') id: number) {
        const data = await this.tagCrudApplication.findOneById(id);
        return this.inertiaAdapter.render({
            component: 'Tags/formTags',
            props: {
                id,
                data,
                isEdit: true,
            },
        });
    }

    @Post('create')
    async store(@Body() data: ITags) {
        await this.tagCrudApplication.create(data);
        return this.inertiaAdapter.successResponse(
            'tags',
            'Success create tags',
        );
    }

    @Put('edit/:id')
    async update(@Param('id') id: number, @Body() data: ITags) {
        await this.tagCrudApplication.update(id, data);
        return this.inertiaAdapter.successResponse(
            'tags',
            `Success update tags with id ${id}`,
        );
    }
}
