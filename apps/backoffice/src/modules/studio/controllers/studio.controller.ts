import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { InertiaAdapter } from 'apps/backoffice/src/infrastructure/inertia/adapter/inertia.adapter';
import { StudioIndexRequest } from '../request/studio-index.request';
import { StudioMapper } from '../mappers/studio.mapper';
import { StudioIndexApplication } from '../applications/studio-index.application';
import { StudioCrudApplication } from '../applications/studio-crud.application';
import { IStudio } from 'interface-models/movie/studio.interface';

@Controller('studios')
export class StudioController {
    constructor(
        private readonly inertiaAdapter: InertiaAdapter,
        private readonly studioIndexApplication: StudioIndexApplication,
        private readonly studioCrudApplication: StudioCrudApplication,
    ) {}

    @Get()
    async indexPage(@Query() request: StudioIndexRequest) {
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

    @Get('create')
    async createPage() {
        return this.inertiaAdapter.render({
            component: 'Studio/formStudio',
        });
    }

    @Get('edit/:id')
    async editPage(@Param('id') id: number) {
        const data = await this.studioCrudApplication.findOneById(id);

        return this.inertiaAdapter.render({
            component: 'Studio/formStudio',
            props: {
                id: data.id,
                data: StudioMapper.fromEntity(data),
                isEdit: true,
            },
        });
    }

    @Get(':id')
    async detailPage(@Param('id') id: number) {
        const data = await this.studioCrudApplication.findOneById(id);

        return this.inertiaAdapter.render({
            component: 'Studio/detailStudio',
            props: {
                data: StudioMapper.fromEntity(data),
            },
        });
    }

    @Post('create')
    async store(@Body() data: IStudio) {
        await this.studioCrudApplication.create(data);

        return this.inertiaAdapter.successResponse(
            'studios',
            'Success create studio',
        );
    }

    @Put('edit/:id')
    async update(@Param('id') id: number, @Body() data: IStudio) {
        await this.studioCrudApplication.update(id, data);

        return this.inertiaAdapter.successResponse(
            'studios',
            'Success update studio',
        );
    }

    @Delete('delete/:id')
    async delete(@Param('id') id: number) {
        await this.studioCrudApplication.delete(id);

        return this.inertiaAdapter.successResponse(
            'studios',
            'Success delete studio',
        );
    }
}
