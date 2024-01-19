import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginateResponse } from 'apps/backoffice/src/common/interface/index.interface';
import { IndexApplication } from 'apps/backoffice/src/infrastructure/applications/index.application';
import { LogActivity } from 'entities/log-activity/log-activity.entity';
import { Repository } from 'typeorm';
import { LogActivityIndexRequest } from '../requests/log-activity-index.request';

const ALLOW_TO_SORT = ['latest', 'oldest', 'menu'];

@Injectable()
export class LogActivityIndexApplication extends IndexApplication {
    constructor(
        @InjectRepository(LogActivity)
        private readonly logActivityRepository: Repository<LogActivity>,
    ) {
        super();
    }

    async fetch(
        request: LogActivityIndexRequest,
    ): Promise<IPaginateResponse<LogActivity>> {
        const query = this.logActivityRepository
            .createQueryBuilder('logActivity')
            .leftJoinAndSelect('logActivity.user', 'user');

        if (request.search) {
            query.andWhere(
                `concat(logActivity.activity, ' ', logActivity.menu, ' ', logActivity.path) like :search`,
                {
                    search: `%${request.search}%`,
                },
            );
        }

        if (request.start_at && request.end_at) {
            query.andWhere(
                `CAST(logActivity.createdAt as DATE) BETWEEN CAST(:startAt AS DATE) AND CAST(:endAt AS DATE)`,
                {
                    startAt: request.start_at,
                    endAt: request.end_at,
                },
            );
        }

        if (request.menu) {
            query.andWhere(`logActivity.menu = :menu`, {
                menu: request.menu,
            });
        }

        if (request.sort == 'latest') {
            query.orderBy('createdAt', 'DESC');
        } else if (request.sort == 'oldest') {
            query.orderBy('createdAt', 'ASC');
        } else {
            query.orderBy(
                ALLOW_TO_SORT.indexOf(request.sort) >= 0
                    ? request.sort
                        ? `logActivity.${request.sort}`
                        : `logActivity.${ALLOW_TO_SORT[0]}`
                    : `logActivity.createdAt`,
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
