import { Module } from '@nestjs/common';
import { MovieService } from './services/movie.service';
import { MovieController } from './controller/movie.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from 'entities/movie/movie.entity';
import { Tags } from 'entities/movie/tags.entity';
import { MovieTags } from 'entities/movie/movie-tags.entity';
import { Studio } from 'entities/movie/studio.entity';
import { MovieSchedule } from 'entities/movie/movie-schedule.entity';
import { MovieCrudApplication } from './applications/movie-crud.application';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Movie,
            Tags,
            MovieTags,
            Studio,
            MovieSchedule,
        ]),
    ],
    providers: [MovieService],
    controllers: [MovieController],
    exports: [MovieCrudApplication],
})
export class MovieModule {}
