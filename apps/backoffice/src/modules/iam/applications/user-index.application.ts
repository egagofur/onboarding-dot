import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginateResponse } from 'apps/backoffice/src/common/interface/index.interface';
import { IndexApplication } from 'apps/backoffice/src/infrastructure/applications/index.application';
import { User } from 'entities/iam/user.entity';
import { Repository } from 'typeorm';
import { UserIndexRequest } from '../requests/user-index.request';
import { config } from 'apps/backoffice/src/config';
import { CacheGetSet } from 'apps/backoffice/src/infrastructure/cache/decorators/cache-get-set.decorator';
import { IUser } from 'interface-models/iam/user.interface';

const ALLOW_TO_SORT = ['latest', 'oldest', 'fullname', 'email'];

@Injectable()
export class UserIndexApplication extends IndexApplication {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
        super();
    }

    @CacheGetSet(config.cache.name.users.list)
    async fetch(request: UserIndexRequest): Promise<IPaginateResponse<IUser>> {
        const query = this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.roles', 'role');

        if (request.search) {
            query.where(
                `concat(user.fullname, ' ', user.id, ' ', user.phoneNumber, ' ', user.email) like :search`,
                {
                    search: `%${request.search}%`,
                },
            );
        }

        if (request.created_at) {
            const [startAt, endAt] = request.created_at.split(',');
            query
                .where(`user.createdAt >= :startAt`, {
                    startAt,
                })
                .andWhere(`user.createdAt <= :endAt`, {
                    endAt,
                });
        }

        if (request.gender) {
            query.where(`user.gender = :gender`, {
                gender: `${request.gender}`,
            });
        }

        if (request.sort == 'latest') {
            query.orderBy('user.createdAt', 'DESC');
        } else if (request.sort == 'oldest') {
            query.orderBy('user.createdAt', 'ASC');
        } else {
            query.orderBy(
                ALLOW_TO_SORT.indexOf(request.sort) >= 0
                    ? `user.${request.sort}`
                    : `user.createdAt`,
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
