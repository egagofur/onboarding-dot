import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginateResponse } from 'apps/backoffice/src/common/interface/index.interface';
import { IndexApplication } from 'apps/backoffice/src/infrastructure/applications/index.application';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { IMovieSchedule } from 'interface-models/movie/movie-schedule.interface';
import { MovieSchedule } from 'entities/movie/movie-schedule.entity';
import { MovieScheduleIndexRequest } from '../request/movie-schedule.index.request';

const ALLOW_TO_SORT = ['latest', 'oldest', 'name'];

@Injectable()
export class MovieScheduleIndexApplication extends IndexApplication {
    constructor(
        @InjectRepository(MovieSchedule)
        private readonly scheduleRepository: Repository<MovieSchedule>,
        @Inject(REQUEST) private request: Request,
    ) {
        super();
    }

    async fetch(
        request: MovieScheduleIndexRequest,
    ): Promise<IPaginateResponse<IMovieSchedule>> {
        try {
            const query = this.scheduleRepository
                .createQueryBuilder('movieSchedules')
                .leftJoinAndSelect('movieSchedules.movie', 'movie')
                .leftJoinAndSelect('movieSchedules.studios', 'studio');

            if (request.search) {
                query.where(
                    `concat(movieSchedules.price, ' ', movieSchedules.id) like :search`,
                    {
                        search: `%${request.search}%`,
                    },
                );
            }

            if (request.sort === 'latest') {
                query.orderBy('movieSchedules.createdAt', 'DESC');
            } else if (request.sort === 'oldest') {
                query.orderBy('movieSchedules.createdAt', 'ASC');
            } else {
                query.orderBy(
                    ALLOW_TO_SORT.indexOf(request.sort) >= 0
                        ? request.sort
                            ? `movieSchedules.${request.sort}`
                            : `movieSchedules.${ALLOW_TO_SORT[0]}`
                        : `movieSchedules.createdAt`,
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
        } catch (error) {
            console.log(error);
        }
    }
}
