import { Module } from '@nestjs/common';
import { MovieService } from './services/movie.service';
import { MovieController } from './controllers/movie.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from 'entities/movie/movie.entity';
import { Tag } from 'entities/movie/tag.entity';
import { MovieTags } from 'entities/movie/movie-tags.entity';
import { Studio } from 'entities/movie/studio.entity';
import { MovieSchedule } from 'entities/movie/movie-schedule.entity';
import { MovieCrudApplication } from './applications/movie-crud.application';
import { InertiaAdapter } from '../../infrastructure/inertia/adapter/inertia.adapter';
import { MovieIndexApplication } from './applications/movie-index.application';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Movie,
            Tag,
            MovieTags,
            Studio,
            MovieSchedule,
        ]),
    ],
    providers: [
        MovieService,
        MovieCrudApplication,
        InertiaAdapter,
        MovieIndexApplication,
    ],
    controllers: [MovieController],
    exports: [MovieCrudApplication],
})
export class MovieModule {}
