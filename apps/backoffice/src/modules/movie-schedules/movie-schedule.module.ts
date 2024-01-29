import { Module, forwardRef } from '@nestjs/common';
import { InertiaAdapter } from '../../infrastructure/inertia/adapter/inertia.adapter';
import { MovieScheduleController } from './controllers/movie-schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieSchedule } from 'entities/movie/movie-schedule.entity';
import { MovieScheduleService } from './services/movie-schedule.services';
import { MovieScheduleCrudApplication } from './applications/movie-schedule.crud.application';
import { MovieScheduleIndexApplication } from './applications/movie-schedule.index.application';
import { MovieModule } from '../movie/movie.module';
import { StudioModule } from '../studio/studio.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([MovieSchedule]),
        forwardRef(() => MovieModule),
        StudioModule,
    ],
    providers: [
        InertiaAdapter,
        MovieScheduleService,
        MovieScheduleCrudApplication,
        MovieScheduleIndexApplication,
    ],
    controllers: [MovieScheduleController],
    exports: [MovieScheduleCrudApplication, MovieScheduleService],
})
export class MovieScheduleModule {}
