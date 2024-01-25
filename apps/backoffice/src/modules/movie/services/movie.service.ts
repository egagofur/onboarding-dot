import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from 'entities/movie/movie.entity';
import { IMovie } from 'interface-models/movie/movie.interface';
import { In, QueryFailedError, Repository } from 'typeorm';

@Injectable()
export class MovieService {
    constructor(
        @InjectRepository(Movie)
        private readonly movieRepository: Repository<Movie>,
    ) {}

    async create(data: IMovie): Promise<IMovie> {
        const movie = this.movieRepository.create(data);
        return await this.movieRepository.save(movie);
    }

    async update(id: number, data: IMovie): Promise<IMovie> {
        try {
            const status = await this.movieRepository.update(
                { id },
                { ...data },
            );
            if (status.affected < 1) {
                throw new QueryFailedError(
                    'Error, Data not changed',
                    null,
                    null,
                );
            }

            return data;
        } catch (error) {
            console.log(error);
        }
    }

    async delete(id: number): Promise<void> {
        const status = await this.movieRepository.delete({ id });
        if (status.affected < 1) {
            throw new QueryFailedError('Error, Data not changed', null, null);
        }
    }

    async findOneById(id: number): Promise<IMovie> {
        const movie = this.movieRepository.createQueryBuilder('movie');
        movie.leftJoinAndSelect('movie.tag', 'tag');
        const results = await movie.where('movie.id = :id', { id }).getOne();
        return results;
    }

    async findOneByIdAndTitle(
        id: number,
        title: string,
    ): Promise<IMovie | null> {
        const movie = this.movieRepository.createQueryBuilder('movie');
        movie.leftJoinAndSelect('movie.tag', 'tag');
        const results = await movie
            .where('movie.id = :id', { id })
            .andWhere('movie.title = :title', { title })
            .getOne();

        return results;
    }

    async findOneByTitle(title: string): Promise<IMovie> {
        return await this.movieRepository.findOne({
            where: {
                title,
            },
        });
    }

    async findAll(): Promise<IMovie[]> {
        return await this.movieRepository.find();
    }

    async findAllById(ids: number[]): Promise<IMovie[]> {
        return await this.movieRepository.find({
            where: {
                id: In(ids),
            },
        });
    }

    async isMovieExistsByTitle(title: string): Promise<boolean> {
        const role = await this.movieRepository.findOne({
            where: {
                title,
            },
        });

        return !!role;
    }

    async findOneWithoutRelations(id: number): Promise<IMovie> {
        return await this.movieRepository.findOne({
            where: {
                id,
            },
        });
    }
}
