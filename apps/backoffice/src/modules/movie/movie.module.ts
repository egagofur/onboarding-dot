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
import { TagService } from '../tag/services/tag.service';
import { TagCrudApplication } from '../tag/applications/tag-crud.application';
import { MovieTagService } from '../movie-tag/services/movie-tag.service';
import { BullModule } from '@nestjs/bull';
import { MovieScheduleService } from '../movie-schedules/services/movie-schedule.services';
import { MulterModule } from '@nestjs/platform-express';
import { config } from '../../config';
import path from 'path';
import { FileUploadProcessor } from './applications/movie.processor';
import { ImageUploadService } from '../auth/services/image-upload.services';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Movie,
            Tag,
            MovieTags,
            Studio,
            MovieSchedule,
        ]),
        BullModule.registerQueue({
            name: 'image-upload-queue',
            limiter: {
                max: 1000,
                duration: 1000,
            },
        }),
        MulterModule.register({
            dest: path.resolve('./') + '/dist/' + config.assets.temp,
        }),
    ],
    providers: [
        MovieService,
        MovieCrudApplication,
        InertiaAdapter,
        MovieIndexApplication,
        TagService,
        TagCrudApplication,
        MovieTagService,
        MovieScheduleService,
        FileUploadProcessor,
        ImageUploadService,
    ],
    controllers: [MovieController],
    exports: [MovieCrudApplication],
})
export class MovieModule {}
