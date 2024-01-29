import { Module } from '@nestjs/common';
import { InertiaAdapter } from '../../infrastructure/inertia/adapter/inertia.adapter';
import { MovieScheduleController } from './controllers/movie-schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieSchedule } from 'entities/movie/movie-schedule.entity';
import { Movie } from 'entities/movie/movie.entity';
import { Studio } from 'entities/movie/studio.entity';
import { MovieScheduleService } from './services/movie-schedule.services';
import { MovieScheduleCrudApplication } from './applications/movie-schedule.crud.application';
import { MovieScheduleIndexApplication } from './applications/movie-schedule.index.application';
import { MovieService } from '../movie/services/movie.service';
import { StudioService } from '../studio/services/studio.service';

@Module({
    imports: [TypeOrmModule.forFeature([MovieSchedule, Movie, Studio])],
    providers: [
        InertiaAdapter,
        MovieScheduleService,
        MovieScheduleCrudApplication,
        MovieScheduleIndexApplication,
        MovieService,
        StudioService,
    ],
    controllers: [MovieScheduleController],
    exports: [MovieScheduleCrudApplication, MovieScheduleService],
})
export class MovieScheduleModule {}
