import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieSchedule } from 'entities/movie/movie-schedule.entity';
import { ScheduleService } from './services/schedule.service';
import { ScheduleController } from './controller/schedule.controller';
import { Studio } from 'entities/movie/studio.entity';
import { Movie } from 'entities/movie/movie.entity';
import { ScheduleCrudApplication } from './applications/schedule-crud.application';

@Module({
    imports: [TypeOrmModule.forFeature([MovieSchedule, Studio, Movie])],
    providers: [ScheduleService],
    controllers: [ScheduleController],
    exports: [ScheduleCrudApplication],
})
export class MovieModule {}
