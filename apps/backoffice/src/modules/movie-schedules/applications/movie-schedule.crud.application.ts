import { Injectable } from '@nestjs/common';
import { IMovieSchedule } from 'interface-models/movie/movie-schedule.interface';
import { MovieScheduleService } from '../services/movie-schedule.services';
import { MovieService } from '../../movie/services/movie.service';
import { StudioService } from '../../studio/services/studio.service';

@Injectable()
export class MovieScheduleCrudApplication {
    constructor(
        private readonly movieScheduleService: MovieScheduleService,
        private readonly movieService: MovieService,
        private readonly studioService: StudioService,
    ) {}

    async create(data: IMovieSchedule): Promise<IMovieSchedule> {
        return await this.movieScheduleService.create(data);
    }

    async update(id: number, data: IMovieSchedule): Promise<IMovieSchedule> {
        return await this.movieScheduleService.update(id, data);
    }

    async delete(id: number): Promise<void> {
        await this.movieScheduleService.delete(id);
    }

    async getStudioList(): Promise<any> {
        return await this.studioService.findAll();
    }

    async getMovieList(): Promise<any> {
        return await this.movieService.findAll();
    }

    async findOneById(id: number): Promise<IMovieSchedule> {
        return await this.movieScheduleService.findOne(id);
    }

    async getNowPlaying(): Promise<IMovieSchedule[]> {
        return await this.movieScheduleService.getNowPlaying();
    }
}
