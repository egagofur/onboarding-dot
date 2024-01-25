import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginateResponse } from 'apps/backoffice/src/common/interface/index.interface';
import { IndexApplication } from 'apps/backoffice/src/infrastructure/applications/index.application';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Studio } from 'entities/movie/studio.entity';
import { IStudio } from 'interface-models/movie/studio.interface';
import { StudioIndexRequest } from '../request/studio-index.request';

const ALLOW_TO_SORT = ['latest', 'oldest', 'name'];

@Injectable()
export class StudioIndexApplication extends IndexApplication {
    constructor(
        @InjectRepository(Studio)
        private readonly movieRepository: Repository<Studio>,
        @Inject(REQUEST) private request: Request,
    ) {
        super();
    }

    async fetch(
        request: StudioIndexRequest,
    ): Promise<IPaginateResponse<IStudio>> {
        try {
            const query = this.movieRepository.createQueryBuilder('studios');

            if (request.search) {
                query.where(
                    `concat(studios.studioNumber, ' ', studios.id) like :search`,
                    {
                        search: `%${request.search}%`,
                    },
                );
            }

            if (request.sort === 'latest') {
                query.orderBy('studios.createdAt', 'DESC');
            } else if (request.sort === 'oldest') {
                query.orderBy('studios.createdAt', 'ASC');
            } else {
                query.orderBy(
                    ALLOW_TO_SORT.indexOf(request.sort) >= 0
                        ? request.sort
                            ? `studios.${request.sort}`
                            : `studios.${ALLOW_TO_SORT[0]}`
                        : `studios.createdAt`,
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
