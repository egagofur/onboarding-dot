import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieSchedule } from 'entities/movie/movie-schedule.entity';
import { QueryFailedError, Repository } from 'typeorm';

@Injectable()
export class MovieScheduleService {
    constructor(
        @InjectRepository(MovieSchedule)
        private readonly scheduleRepository: Repository<MovieSchedule>,
    ) {}

    async findAll(): Promise<MovieSchedule[]> {
        return this.scheduleRepository.find({
            relations: ['movie', 'studio'],
        });
    }

    async findOne(id: number): Promise<MovieSchedule> {
        return this.scheduleRepository.findOne(id, {
            relations: ['movie', 'studios'],
        });
    }

    async create(data: MovieSchedule): Promise<MovieSchedule> {
        const schedule = this.scheduleRepository.create(data);
        return await this.scheduleRepository.save(schedule);
    }

    async update(id: number, data: MovieSchedule): Promise<MovieSchedule> {
        const schedule = await this.scheduleRepository.update(
            { id },
            { ...data },
        );
        if (schedule.affected < 1) {
            throw new QueryFailedError('Data not changed', null, null);
        }
        return data;
    }

    async delete(id: number): Promise<void> {
        const status = await this.scheduleRepository.delete({ id });
        if (status.affected < 1) {
            throw new QueryFailedError('Data not changed', null, null);
        }
    }

    async findByMovieId(movieId: number): Promise<MovieSchedule[]> {
        return this.scheduleRepository.find({
            where: {
                movie: movieId,
            },
            relations: ['movie', 'studios'],
        });
    }

    @Cron(CronExpression.EVERY_10_MINUTES)
    async getNowPlaying(): Promise<MovieSchedule[]> {
        Logger.log('Cron running every 10 minutes', 'MovieScheduleService');
        return this.scheduleRepository.find({
            where: {
                startTime: new Date(),
            },
        });
    }
}
