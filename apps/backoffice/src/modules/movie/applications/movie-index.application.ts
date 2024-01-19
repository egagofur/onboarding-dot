import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginateResponse } from 'apps/backoffice/src/common/interface/index.interface';
import { IndexApplication } from 'apps/backoffice/src/infrastructure/applications/index.application';
import { Movie } from 'entities/movie/movie.entity';
import { IMovie } from 'interface-models/movie/movie.interface';
import { Repository } from 'typeorm';
import { MovieIndexRequest } from '../request/movie-index.request';

const ALLOW_TO_SORT = ['latest', 'oldest', 'name'];

@Injectable()
export class MovieIndexApplication extends IndexApplication {
    constructor(
        @InjectRepository(Movie)
        private readonly movieRepository: Repository<Movie>,
    ) {
        super();
    }

    async fetch(
        request: MovieIndexRequest,
    ): Promise<IPaginateResponse<IMovie>> {
        const query = this.movieRepository.createQueryBuilder('movies');

        if (request.search) {
            query.where(`concat(movies.title, ' ', movies.id) like :search`, {
                search: `%${request.search}%`,
            });
        }

        if (request.sort === 'latest') {
            query.orderBy('movies.createdAt', 'DESC');
        } else if (request.sort === 'oldest') {
            query.orderBy('movies.createdAt', 'ASC');
        } else {
            query.orderBy(
                ALLOW_TO_SORT.indexOf(request.sort) >= 0
                    ? request.sort
                        ? `movies.${request.sort}`
                        : `movies.${ALLOW_TO_SORT[0]}`
                    : `movies.createdAt`,
                this.getOrder(request.order),
            );
        }

        query.take(request.perPage ?? 10);
        query.skip(this.countOffset(request));

        const [data, count] = await query.getManyAndCount();

        const meta = this.mapMeta(count, request);

        const results = {
            data,
            meta,
        };

        return results;
    }
}
