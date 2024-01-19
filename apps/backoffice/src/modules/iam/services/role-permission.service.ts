import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IRolePermission } from 'interface-models/iam/role-permission.interface';
import { RolePermission } from 'entities/iam/role-permission.entity';
import { QueryFailedError, Repository } from 'typeorm';

@Injectable()
export class RolePermissionService {
    constructor(
        @InjectRepository(RolePermission)
        private readonly rolePermissionRepository: Repository<RolePermission>,
    ) {}

    async create(data: IRolePermission): Promise<IRolePermission> {
        const newRole = this.rolePermissionRepository.create(data);
        return await this.rolePermissionRepository.save(newRole);
    }

    async createAll(data: IRolePermission[]): Promise<IRolePermission[]> {
        const rolePermissions = this.rolePermissionRepository.create(data);
        return await this.rolePermissionRepository.save(rolePermissions);
    }

    async deleteByRoleId(roleId: number): Promise<void> {
        const status = await this.rolePermissionRepository.delete({
            role: { id: roleId },
        });
        if (status.affected < 1) {
            throw new QueryFailedError('Error, Data not changed', null, null);
        }
    }

    async update(id: number, data: IRolePermission): Promise<IRolePermission> {
        const status = await this.rolePermissionRepository.update(
            { id },
            { ...data },
        );
        if (status.affected < 1) {
            throw new QueryFailedError('Error, Data not changed', null, null);
        }

        return data;
    }

    async delete(id: number): Promise<void> {
        const status = await this.rolePermissionRepository.delete({ id });
        if (status.affected < 1) {
            throw new QueryFailedError('Error, Data not changed', null, null);
        }
    }

    async findOneById(id: number): Promise<IRolePermission> {
        return await this.rolePermissionRepository.findOneOrFail({
            where: { id },
            relations: ['role', 'permission'],
        });
    }

    async findByRoleId(roleId: number): Promise<IRolePermission[]> {
        return await this.rolePermissionRepository.find({
            where: {
                role: { id: roleId },
            },
        });
    }

    async findByPermissionId(roleId: number): Promise<IRolePermission[]> {
        return await this.rolePermissionRepository.find({
            where: {
                permission: { id: roleId },
            },
        });
    }

    async findOneByRoleIdAndPermissionId(
        roleId: number,
        permissionId: number,
    ): Promise<IRolePermission> {
        return await this.rolePermissionRepository.findOne({
            where: {
                role: { id: roleId },
                permission: { id: permissionId },
            },
        });
    }
}
