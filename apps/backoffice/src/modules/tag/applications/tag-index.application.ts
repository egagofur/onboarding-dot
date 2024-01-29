import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginateResponse } from 'apps/backoffice/src/common/interface/index.interface';
import { IndexApplication } from 'apps/backoffice/src/infrastructure/applications/index.application';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Tag } from 'entities/movie/tag.entity';
import { ITags } from 'interface-models/movie/tags.interface';
import { TagIndexRequest } from '../requests/tag-index.request';

const ALLOW_TO_SORT = ['latest', 'oldest', 'name'];

@Injectable()
export class TagIndexApplication extends IndexApplication {
    constructor(
        @InjectRepository(Tag)
        private readonly movieRepository: Repository<Tag>,
        @Inject(REQUEST) private request: Request,
    ) {
        super();
    }

    async fetch(request: TagIndexRequest): Promise<IPaginateResponse<ITags>> {
        const query = this.movieRepository.createQueryBuilder('tags');

        if (request.search) {
            query.where(`concat(tags.title, ' ', tags.id) like :search`, {
                search: `%${request.search}%`,
            });
        }

        if (request.sort === 'latest') {
            query.orderBy('tags.createdAt', 'DESC');
        } else if (request.sort === 'oldest') {
            query.orderBy('tags.createdAt', 'ASC');
        } else {
            query.orderBy(
                ALLOW_TO_SORT.indexOf(request.sort) >= 0
                    ? request.sort
                        ? `tags.${request.sort}`
                        : `tags.${ALLOW_TO_SORT[0]}`
                    : `tags.createdAt`,
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
