import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { config } from 'apps/backoffice/src/config';
import { CacheService } from 'apps/backoffice/src/infrastructure/cache/services/cache.service';
import { IPaginateResponse } from 'apps/backoffice/src/common/interface/index.interface';
import { IndexApplication } from 'apps/backoffice/src/infrastructure/applications/index.application';
import { Permission } from 'entities/iam/permission.entity';
import { Repository } from 'typeorm';
import { PermissionIndexRequest } from '../requests/permission-index.request';
import { CacheGetSet } from 'apps/backoffice/src/infrastructure/cache/decorators/cache-get-set.decorator';
import { IPermission } from 'interface-models/iam/permission.interface';

const ALLOW_TO_SORT = ['latest', 'oldest', 'name', 'key'];

@Injectable()
export class PermissionIndexApplication extends IndexApplication {
    constructor(
        @InjectRepository(Permission)
        private readonly PermissionRepository: Repository<Permission>,
        private readonly cacheService: CacheService,
    ) {
        super();
    }

    @CacheGetSet(config.cache.name.permissions.list)
    async fetch(
        request: PermissionIndexRequest,
    ): Promise<IPaginateResponse<IPermission>> {
        const query = this.PermissionRepository.createQueryBuilder(
            'permission',
        ).leftJoinAndSelect('permission.roles', 'role');

        if (request.search) {
            query.where(
                `concat(permission.name, ' ', permission.key, ' ', permission.id) like :search`,
                {
                    search: `%${request.search}%`,
                },
            );
        }

        if (request.sort == 'latest') {
            query.orderBy('permission.createdAt', 'DESC');
        } else if (request.sort == 'oldest') {
            query.orderBy('permission.createdAt', 'ASC');
        } else {
            query.orderBy(
                ALLOW_TO_SORT.indexOf(request.sort) >= 0
                    ? request.sort
                        ? `permission.${request.sort}`
                        : `permission.${ALLOW_TO_SORT[0]}`
                    : `permission.createdAt`,
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
