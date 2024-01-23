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
import { MovieCrudApplication } from '../applications/movie-crud.application';
import { MovieIndexApplication } from '../applications/movie-index.application';
import { MovieIndexRequest } from '../request/movie-index.request';
import { MovieMapper } from '../mappers/movie.mapper';
import { MovieCreateRequest } from '../request/movie-create.request';
import { MovieUpdateRequest } from '../request/movie-update.request';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import {
    PERMISSION_BACKOFFICE_CREATE_MOVIE,
    PERMISSION_BACKOFFICE_DELETE_MOVIE,
    PERMISSION_BACKOFFICE_SHOW_MOVIE,
    PERMISSION_BACKOFFICE_UPDATE_MOVIE,
} from 'constants/permission.constant';
import { TagCrudApplication } from '../../tag/applications/tag-crud.application';

@Controller('movies')
export class MovieController {
    constructor(
        private readonly inertiaAdapter: InertiaAdapter,
        private readonly movieCrudApplication: MovieCrudApplication,
        private readonly movieIndexApplication: MovieIndexApplication,
        private readonly tagCrudApplication: TagCrudApplication,
    ) {}

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_CREATE_MOVIE))
    @Post('create')
    async store(@Body() moviesCreateRequest: MovieCreateRequest) {
        await this.movieCrudApplication.create(moviesCreateRequest);
        return this.inertiaAdapter.successResponse(
            'movies',
            'Success create movie',
        );
    }

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_UPDATE_MOVIE))
    @Put('edit/:id')
    async update(
        @Param('id') id: number,
        @Body() movieUpdateRequest: MovieUpdateRequest,
    ) {
        await this.movieCrudApplication.update(id, movieUpdateRequest);

        return this.inertiaAdapter.successResponse(
            'movies',
            `Success update movies with id ${id}`,
        );
    }

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_DELETE_MOVIE))
    @Delete('delete/:id')
    async delete(@Param('id') id: number) {
        await this.movieCrudApplication.delete(id);

        return this.inertiaAdapter.successResponse(
            'movies',
            `Success delete movies with id ${id}`,
        );
    }

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_SHOW_MOVIE))
    @Get()
    async indexProps(@Query() indexRequest: MovieIndexRequest): Promise<void> {
        const props = await this.movieIndexApplication.fetch(indexRequest);

        return this.inertiaAdapter.render({
            component: 'Movies',
            props: {
                ...props,
                data: props.data.map((movie) => MovieMapper.fromEntity(movie)),
            },
        });
    }

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_CREATE_MOVIE))
    @Get('create')
    async createPage(): Promise<void> {
        const tags = await this.tagCrudApplication.findAll();
        return this.inertiaAdapter.render({
            component: 'Movies/formMovie',
            props: {
                tags,
            },
        });
    }

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_UPDATE_MOVIE))
    @Get('edit/:id')
    async editPage(@Param('id') id: number): Promise<void> {
        const data = await this.movieCrudApplication.findById(id);
        const tags = await this.tagCrudApplication.findAll();

        return this.inertiaAdapter.render({
            component: 'Movies/formMovie',
            props: {
                id,
                data,
                tags,
                isEdit: true,
            },
        });
    }
}
