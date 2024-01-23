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
        const status = await this.movieRepository.update({ id }, { ...data });
        if (status.affected < 1) {
            throw new QueryFailedError('Error, Data not changed', null, null);
        }

        return data;
    }

    async delete(id: number): Promise<void> {
        const status = await this.movieRepository.delete({ id });
        if (status.affected < 1) {
            throw new QueryFailedError('Error, Data not changed', null, null);
        }
    }

    async findOneById(id: number): Promise<IMovie> {
        try {
            const movie = this.movieRepository.createQueryBuilder('movie');
            movie.leftJoinAndSelect('movie.tag', 'tag');
            const result = await movie.where('movie.id = :id', { id }).getOne();
            console.log(result);
            return result;
        } catch (error) {
            console.log(error);
        }
    }

    async findOneByTitle(title: string): Promise<IMovie> {
        return await this.movieRepository.findOneOrFail({
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

        return role != null;
    }
}
