import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { config } from 'apps/backoffice/src/config';
import { CacheService } from 'apps/backoffice/src/infrastructure/cache/services/cache.service';
import { IPaginateResponse } from 'apps/backoffice/src/common/interface/index.interface';
import { IndexApplication } from 'apps/backoffice/src/infrastructure/applications/index.application';
import { Role } from 'entities/iam/role.entity';
import { Repository } from 'typeorm';
import { RoleIndexRequest } from '../requests/role-index.request';
import { CacheGetSet } from 'apps/backoffice/src/infrastructure/cache/decorators/cache-get-set.decorator';
import { IRole } from 'interface-models/iam/role.interface';

const ALLOW_TO_SORT = ['latest', 'oldest', 'name', 'key'];

@Injectable()
export class RoleIndexApplication extends IndexApplication {
    constructor(
        @InjectRepository(Role)
        private readonly RoleRepository: Repository<Role>,
        private readonly cacheService: CacheService,
    ) {
        super();
    }

    @CacheGetSet(config.cache.name.roles.list)
    async fetch(request: RoleIndexRequest): Promise<IPaginateResponse<IRole>> {
        const query = this.RoleRepository.createQueryBuilder('role');

        if (request.search) {
            query.where(
                `concat(role.name, ' ', role.key, ' ', role.id) like :search`,
                {
                    search: `%${request.search}%`,
                },
            );
        }

        if (request.sort == 'latest') {
            query.orderBy('role.createdAt', 'DESC');
        } else if (request.sort == 'oldest') {
            query.orderBy('role.createdAt', 'ASC');
        } else {
            query.orderBy(
                ALLOW_TO_SORT.indexOf(request.sort) >= 0
                    ? request.sort
                        ? `role.${request.sort}`
                        : `role.${ALLOW_TO_SORT[0]}`
                    : `role.createdAt`,
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
