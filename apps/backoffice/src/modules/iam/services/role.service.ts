import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IRole } from 'interface-models/iam/role.interface';
import { Role } from 'entities/iam/role.entity';
import { QueryFailedError, Repository } from 'typeorm';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
    ) {}

    async create(data: IRole): Promise<IRole> {
        const newRole = this.roleRepository.create(data);
        return await this.roleRepository.save(newRole);
    }

    async update(id: number, data: IRole): Promise<IRole> {
        await this.roleRepository.update(id, data);
        return data;
    }

    async delete(id: number): Promise<void> {
        const status = await this.roleRepository.delete({ id });
        if (status.affected < 1) {
            throw new QueryFailedError('Error, Data not changed', null, null);
        }
    }

    async findOneById(id: number): Promise<IRole> {
        return await this.roleRepository.findOneOrFail({
            where: {
                id,
            },
            relations: ['permissions'],
        });
    }

    async findOneByKey(key: string): Promise<IRole> {
        return await this.roleRepository.findOneOrFail({
            where: {
                key,
            },
        });
    }

    async findRoleByKeyAndId(key: string, id: number): Promise<IRole> {
        const role = await this.roleRepository.findOne({
            where: {
                key,
                id,
            },
            relations: ['permissions'],
        });

        return role;
    }

    async isRoleExistsByKey(key: string): Promise<boolean> {
        const role = await this.roleRepository.findOne({
            where: {
                key,
            },
        });

        return role != null;
    }

    async findAll(): Promise<IRole[]> {
        return await this.roleRepository.find();
    }
}
