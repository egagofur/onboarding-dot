import { Module } from '@nestjs/common';
import { MovieService } from './services/movie.service';
import { MovieController } from './controllers/movie.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from 'entities/movie/movie.entity';
import { MovieCrudApplication } from './applications/movie-crud.application';
import { InertiaAdapter } from '../../infrastructure/inertia/adapter/inertia.adapter';
import { MovieIndexApplication } from './applications/movie-index.application';
import { BullModule } from '@nestjs/bull';
import { MulterModule } from '@nestjs/platform-express';
import { config } from '../../config';
import path from 'path';
import { MovieTagModule } from '../movie-tag/movie-tag.module';
import { MovieScheduleModule } from '../movie-schedules/movie-schedule.module';
import { TagModule } from '../tag/tag.module';
import { FileUploadProcessor } from './applications/movie.processor';

@Module({
    imports: [
        TypeOrmModule.forFeature([Movie]),
        BullModule.registerQueue({
            name: 'image-upload-queue',
        }),
        MulterModule.register({
            dest: path.resolve('./') + '/dist/' + config.assets.temp,
        }),
        MovieTagModule,
        MovieScheduleModule,
        TagModule,
    ],
    providers: [
        MovieService,
        MovieCrudApplication,
        InertiaAdapter,
        MovieIndexApplication,
        FileUploadProcessor,
    ],
    controllers: [MovieController],
    exports: [MovieCrudApplication],
})
export class MovieModule {}
