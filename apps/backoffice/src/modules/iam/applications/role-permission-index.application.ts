import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { config } from 'apps/backoffice/src/config';
import { IPaginateResponse } from 'apps/backoffice/src/common/interface/index.interface';
import { IndexApplication } from 'apps/backoffice/src/infrastructure/applications/index.application';
import { RolePermission } from 'entities/iam/role-permission.entity';
import { Repository } from 'typeorm';
import { RolePermissionIndexRequest } from '../requests/role-permission-index.request';
import { CacheGetSet } from 'apps/backoffice/src/infrastructure/cache/decorators/cache-get-set.decorator';
import { IRolePermission } from 'interface-models/iam/role-permission.interface';

const ALLOW_TO_SORT = ['latest', 'oldest', 'name'];

@Injectable()
export class RolePermissionIndexApplication extends IndexApplication {
    constructor(
        @InjectRepository(RolePermission)
        private readonly RolePermissionRepository: Repository<RolePermission>,
    ) {
        super();
    }

    @CacheGetSet(config.cache.name.rolePermissions.list)
    async fetch(
        request: RolePermissionIndexRequest,
    ): Promise<IPaginateResponse<IRolePermission>> {
        const query = this.RolePermissionRepository.createQueryBuilder(
            'rolePermission',
        )
            .innerJoinAndSelect('rolePermission.role', 'role')
            .innerJoinAndSelect('rolePermission.permission', 'permission');

        if (request.search) {
            query.where(
                `concat(role.name, ' ', role.key, ' ', permission.name, ' ', permission.key) like :search`,
                {
                    search: `%${request.search}%`,
                },
            );
        }

        if (request.sort == 'latest') {
            query.orderBy('rolePermission.createdAt', 'DESC');
        } else if (request.sort == 'oldest') {
            query.orderBy('rolePermission.createdAt', 'ASC');
        } else {
            query.orderBy(
                ALLOW_TO_SORT.indexOf(request.sort) >= 0
                    ? request.sort
                        ? `role.${request.sort}`
                        : `role.${ALLOW_TO_SORT[0]}`
                    : `role.createdAt`,
                this.getOrder(request.order),
            );

            query.addOrderBy(
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
