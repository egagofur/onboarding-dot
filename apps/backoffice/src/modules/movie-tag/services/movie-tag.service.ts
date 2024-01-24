import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieTags } from 'entities/movie/movie-tags.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MovieTagService {
    constructor(
        @InjectRepository(MovieTags)
        private readonly movieTagRepository: Repository<MovieTags>,
    ) {}

    async deleteByMovieId(movieId: number): Promise<void> {
        const status = await this.movieTagRepository.delete({
            movie: { id: movieId },
        });
        if (status.affected < 1) {
            throw new Error('Error, Data not changed');
        }
    }

    async bulkSave(data: MovieTags[]): Promise<MovieTags[]> {
        const movieTags = this.movieTagRepository.create(data);
        return await this.movieTagRepository.save(movieTags);
    }
}
