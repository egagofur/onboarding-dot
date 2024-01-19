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
import { MovieCrudApplication } from '../applications/movie-crud.application';
import { MovieIndexApplication } from '../applications/movie-index.application';
import { MovieIndexRequest } from '../request/movie-index.request';
import { MovieMapper } from '../mappers/movie.mapper';
import { MovieCreateRequest } from '../request/movie-create.request';
import { MovieUpdateRequest } from '../request/movie-update.request';

@Controller('movies')
export class MovieController {
    constructor(
        private readonly inertiaAdapter: InertiaAdapter,
        private readonly movieCrudApplication: MovieCrudApplication,
        private readonly movieIndexApplication: MovieIndexApplication,
    ) {}

    @Post('create')
    async store(@Body() moviesCreateRequest: MovieCreateRequest) {
        await this.movieCrudApplication.create(moviesCreateRequest);
        return this.inertiaAdapter.successResponse(
            'movies',
            'Success create movie',
        );
    }

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

    @Delete('delete/:id')
    async delete(@Param('id') id: number) {
        await this.movieCrudApplication.delete(id);

        return this.inertiaAdapter.successResponse(
            'movies',
            `Success delete movies with id ${id}`,
        );
    }

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

    @Get('create')
    async createPage(): Promise<void> {
        const movies = await this.movieCrudApplication.findAll();
        return this.inertiaAdapter.render({
            component: 'Movies/formMovie',
            props: {
                movies,
            },
        });
    }

    @Get('edit/:id')
    async editPage(@Param('id') id: number): Promise<void> {
        const data = await this.movieCrudApplication.findById(id);
        const movies = await this.movieCrudApplication.findAll();

        return this.inertiaAdapter.render({
            component: 'Movies/formMovie',
            props: {
                data,
                movies,
                isEdit: true,
            },
        });
    }
}