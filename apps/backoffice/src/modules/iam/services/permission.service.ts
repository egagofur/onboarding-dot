import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPermission } from 'interface-models/iam/permission.interface';
import { Permission } from 'entities/iam/permission.entity';
import { In, QueryFailedError, Repository } from 'typeorm';

@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>,
    ) {}

    async update(id: number, data: IPermission): Promise<IPermission> {
        const status = await this.permissionRepository.update(
            { id },
            { ...data },
        );
        if (status.affected < 1) {
            throw new QueryFailedError('Error, Data not changed', null, null);
        }

        return data;
    }

    async delete(id: number): Promise<void> {
        const status = await this.permissionRepository.delete({ id });
        if (status.affected < 1) {
            throw new QueryFailedError('Error, Data not changed', null, null);
        }
    }

    async findOneById(id: number): Promise<IPermission> {
        return await this.permissionRepository.findOneOrFail({
            where: { id },
            relations: ['roles'],
        });
    }

    async findOneByKey(key: string): Promise<IPermission> {
        return await this.permissionRepository.findOneOrFail({
            where: {
                key,
            },
        });
    }

    async findAll(): Promise<IPermission[]> {
        return await this.permissionRepository.find();
    }

    async findAllById(ids: number[]): Promise<IPermission[]> {
        return await this.permissionRepository.find({
            where: {
                id: In(ids),
            },
        });
    }
}
