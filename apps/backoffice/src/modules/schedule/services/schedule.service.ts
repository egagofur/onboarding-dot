import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieSchedule } from 'entities/movie/movie-schedule.entity';
import { Movie } from 'entities/movie/movie.entity';
import { Studio } from 'entities/movie/studio.entity';
import { IMovieSchedule } from 'interface-models/movie/movie-schedule.interface';
import { Repository } from 'typeorm';

@Injectable()
export class ScheduleService {
    constructor(
        @InjectRepository(MovieSchedule)
        private readonly scheduleRepository: Repository<MovieSchedule>,
        @InjectRepository(Studio)
        private readonly studioRepository: Repository<Studio>,
        @InjectRepository(Movie)
        private readonly movieRepository: Repository<Movie>,
    ) {}

    async addSchedule(data: IMovieSchedule): Promise<IMovieSchedule> {
        const newSchedule = new MovieSchedule();

        const studio = await this.studioRepository.findOneOrFail({
            where: {
                id: data.studio,
            },
        });

        const movie = await this.movieRepository.findOneOrFail({
            where: {
                id: data.movie,
            },
        });

        if (!studio || !movie) {
            throw new NotFoundException('Studio or Movie not found');
        }

        const schedule = this.scheduleRepository.save({
            ...newSchedule,
            ...data,
            studio,
            movie,
        });

        return schedule;
    }

    async getNowPlaying(): Promise<MovieSchedule[]> {
        const DATENOW = new Date().toISOString().split('T')[0];

        const schedule = await this.scheduleRepository
            .createQueryBuilder('movie_schedule')
            .where('movie_schedule.date like :date', { date: `%${DATENOW}%` })
            .innerJoinAndSelect('movie_schedule.movie', 'movie')
            .innerJoinAndSelect('movie_schedule.studio', 'studio')
            .getMany();

        return schedule;
    }

    @Cron(CronExpression.EVERY_2_HOURS, { name: 'Get all movie schedule' })
    async getAllSchedule() {
        const allSchedules = await this.scheduleRepository.find();
        console.log(allSchedules);
        Logger.log('Get all movie schedule with cron job');
    }
}
