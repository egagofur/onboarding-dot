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
import { MovieScheduleIndexApplication } from '../applications/movie-schedule.index.application';
import { MovieIndexRequest } from '../../movie/request/movie-index.request';
import { MovieScheduleMapper } from '../mappers/movie-schedule.mapper';
import { MovieScheduleCrudApplication } from '../applications/movie-schedule.crud.application';
import { IMovieSchedule } from 'interface-models/movie/movie-schedule.interface';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import {
    PERMISSION_BACKOFFICE_SHOW_SCHEDULE,
    PERMISSION_BACKOFFICE_CREATE_SCHEDULE,
    PERMISSION_BACKOFFICE_UPDATE_SCHEDULE,
    PERMISSION_BACKOFFICE_DELETE_SCHEDULE,
} from 'constants/permission.constant';

@Controller('movie-schedules')
export class MovieScheduleController {
    constructor(
        private readonly inertiaAdapter: InertiaAdapter,
        private readonly movieScheduleIndexApplication: MovieScheduleIndexApplication,
        private readonly movieScheduleCrudApplication: MovieScheduleCrudApplication,
    ) {}

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_SHOW_SCHEDULE))
    @Get()
    async indexPage(@Query() indexRequest: MovieIndexRequest): Promise<void> {
        const props = await this.movieScheduleIndexApplication.fetch(
            indexRequest,
        );
        const movieNowPlaying =
            await this.movieScheduleCrudApplication.getNowPlaying();

        return this.inertiaAdapter.render({
            component: 'MovieSchedules',
            props: {
                ...props,
                movieNowPlaying,
                data: props.data.map((movieSchedule) =>
                    MovieScheduleMapper.fromEntity(movieSchedule),
                ),
            },
        });
    }

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_CREATE_SCHEDULE))
    @Get('create')
    async create(): Promise<void> {
        const movies = await this.movieScheduleCrudApplication.getMovieList();
        const studios = await this.movieScheduleCrudApplication.getStudioList();

        return this.inertiaAdapter.render({
            component: 'MovieSchedules/formMovieSchedules',
            props: {
                movies,
                studios,
            },
        });
    }

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_UPDATE_SCHEDULE))
    @Get('edit/:id')
    async edit(@Param('id') id: number) {
        const data = await this.movieScheduleCrudApplication.findOneById(id);
        const movies = await this.movieScheduleCrudApplication.getMovieList();
        const studios = await this.movieScheduleCrudApplication.getStudioList();

        return this.inertiaAdapter.render({
            component: 'MovieSchedules/formMovieSchedules',
            props: {
                id,
                data,
                movies,
                studios,
                isEdit: true,
            },
        });
    }

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_CREATE_SCHEDULE))
    @Post('create')
    async store(@Body() data: IMovieSchedule): Promise<void> {
        await this.movieScheduleCrudApplication.create(data);

        return this.inertiaAdapter.successResponse(
            'movie-schedules',
            'Success create movie schedule',
        );
    }

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_UPDATE_SCHEDULE))
    @Put('edit/:id')
    async update(
        @Param('id') id: number,
        @Body() data: IMovieSchedule,
    ): Promise<void> {
        await this.movieScheduleCrudApplication.update(id, data);

        return this.inertiaAdapter.successResponse(
            'movie-schedules',
            `Success update movie schedule with id ${id}`,
        );
    }

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_DELETE_SCHEDULE))
    @Delete('delete/:id')
    async delete(@Param('id') id: number): Promise<void> {
        await this.movieScheduleCrudApplication.delete(id);

        return this.inertiaAdapter.successResponse(
            'movie-schedules',
            `Success delete movie schedule with id ${id}`,
        );
    }
}
