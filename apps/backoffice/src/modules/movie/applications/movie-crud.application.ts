import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { MovieService } from '../services/movie.service';
import { MovieCreateRequest } from '../request/movie-create.request';
import { IMovie } from 'interface-models/movie/movie.interface';
import { MovieUpdateRequest } from '../request/movie-update.request';

@Injectable()
export class MovieCrudApplication {
    constructor(private readonly movieService: MovieService) {}

    // TODO: Mapping Tags and views on index page
    async create(movieRequest: MovieCreateRequest): Promise<void> {
        const isMovieExist = await this.movieService.isMovieExistsByTitle(
            movieRequest.title,
        );

        if (isMovieExist) {
            throw new UnprocessableEntityException(
                `Movie ${movieRequest.title} has already exists`,
            );
        }

        const newMovie = <IMovie>{
            title: movieRequest.title,
            overview: movieRequest.overview,
            playUntil: movieRequest.playUntil,
            poster: movieRequest.poster,
            tags: movieRequest.tags,
            shedule: movieRequest.shedule,
        };

        await this.movieService.create(newMovie);
    }

    async update(id: number, movieRequest: MovieUpdateRequest): Promise<void> {
        const isMovieExist = await this.movieService.isMovieExistsByTitle(
            movieRequest.title,
        );

        if (isMovieExist) {
            throw new UnprocessableEntityException(
                `Movie ${movieRequest.title} has already exists`,
            );
        }

        const updateMovie = <IMovie>{
            title: movieRequest.title,
            overview: movieRequest.overview,
            playUntil: movieRequest.playUntil,
            poster: movieRequest.poster,
            tags: movieRequest.tags,
            shedule: movieRequest.shedule,
        };

        await this.movieService.update(id, updateMovie);
    }

    async delete(id: number): Promise<void> {
        await this.movieService.delete(id);
    }

    async findById(id: number): Promise<IMovie> {
        const results = await this.movieService.findOneById(id);
        return results;
    }

    async findAll(): Promise<IMovie[]> {
        const results = await this.movieService.findAll();
        return results;
    }

    async findAllById(ids: number[]): Promise<IMovie[]> {
        const results = await this.movieService.findAllById(ids);
        return results;
    }

    async findOneByTitle(title: string): Promise<IMovie> {
        const results = await this.movieService.findOneByTitle(title);
        return results;
    }
}
